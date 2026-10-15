'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authRequest, ApiError } from '@/lib/auth';
import { hasSessionHint, clearSignedIn, logout } from '@/lib/session';
import styles from './page.module.css';

const MEALS_EMAIL = 'meals@iiitn.ac.in';
const SUCCESS_RESET_MS = 3500;
const ERROR_RESET_MS = 4500;

type ScanPhase = 'idle' | 'processing' | 'success' | 'error';

type ClaimResult = {
  mealId: number;
  typeOfMeal: string;
  date: string;
  scannedAt: string;
  scannedByStaff?: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    festId: string;
    email: string;
  };
  grantedByEvent?: string;
};

type MealSession = {
  id: number;
  name: string;
  typeOfMeal: string;
  isServingNow: boolean;
  scannedCount: number;
};

// ── Mobile Audio & Haptic Feedback ──────────────────────────────
function playFeedbackTone(type: 'success' | 'error') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      // High pleasant chime (880Hz -> 1320Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else {
      // Warning buzzer (240Hz -> 160Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}

  // Mobile physical vibration
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'success') {
        navigator.vibrate([80]);
      } else {
        navigator.vibrate([150, 70, 150]);
      }
    }
  } catch {}
}

export default function MealScannerPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [message, setMessage] = useState('');
  const [claim, setClaim] = useState<ClaimResult | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [cameraError, setCameraError] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [meals, setMeals] = useState<MealSession[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  // Camera feature state
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const isLockedRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Strict Auth Gate: ONLY meals@iiitn.ac.in has access
  useEffect(() => {
    if (!hasSessionHint()) {
      router.replace('/login?next=/meal-scanner');
      return;
    }

    authRequest('/api/auth/me')
      .then(({ data }) => {
        const userEmail = (data?.user?.email || '').trim().toLowerCase();
        if (userEmail !== MEALS_EMAIL && !userEmail.startsWith('meals@')) {
          router.replace('/login');
        } else {
          setAuthed(true);
        }
      })
      .catch(() => {
        clearSignedIn();
        router.replace('/login?next=/meal-scanner');
      });
  }, [router]);

  // 2. Fetch available meal sessions for manual fallback
  useEffect(() => {
    if (!authed) return;
    authRequest('/api/admin/meals')
      .then(({ data }) => {
        const list: MealSession[] = (data.meals || []).map((m: any) => ({
          id: m.id,
          name: m.name || `${m.typeOfMeal.toUpperCase()} ${m.slot}`,
          typeOfMeal: m.typeOfMeal,
          isServingNow: !!m.isServingNow,
          scannedCount: m.scannedCount || 0,
        }));
        setMeals(list);
        const serving = list.find((m) => m.isServingNow);
        if (serving) setSelectedMealId(serving.id);
        else if (list.length > 0) setSelectedMealId(list[0].id);
      })
      .catch(() => {});
  }, [authed]);

  // 3. Scan processing function with atomic locking & double-scan safeguards
  const handleRedeem = useCallback(
    async (tokenOrCode: string, isManual = false) => {
      // FOOLPROOF CONCURRENCY GUARD:
      // If already processing or locked, strictly reject new attempts
      if (isLockedRef.current) return;
      isLockedRef.current = true;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      setPhase('processing');
      setMessage('Verifying pass & claiming meal...');
      setClaim(null);

      // Immediately pause camera decoding while API verifies claim
      try {
        await scannerRef.current?.pause(true);
      } catch {}

      try {
        let response: any;
        if (isManual) {
          if (!selectedMealId) throw new Error('Please select an active meal session');
          response = await authRequest(
            `/api/admin/meals/${selectedMealId}/verify-code`,
            { code: tokenOrCode.trim() }
          );
        } else {
          response = await authRequest('/api/admin/meals/redeem-pass', {
            passToken: tokenOrCode.trim(),
          });
        }

        playFeedbackTone('success');
        setPhase('success');
        setMessage(response.message || 'Meal pass successfully redeemed!');
        setClaim(response.data);
        setSessionCount((prev) => prev + 1);
        if (isManual) setManualCode('');

        // Hold success screen for duration before allowing next scan
        resetTimerRef.current = setTimeout(() => {
          setPhase('idle');
          setMessage('');
          setClaim(null);
          isLockedRef.current = false;
          try {
            scannerRef.current?.resume();
          } catch {}
        }, SUCCESS_RESET_MS);
      } catch (err: any) {
        playFeedbackTone('error');
        setPhase('error');
        const errMsg =
          err instanceof ApiError
            ? err.message
            : err?.message || 'Verification failed. Pass is not valid.';
        setMessage(errMsg);

        // Hold error screen so staff notices the invalid/already-claimed attempt
        resetTimerRef.current = setTimeout(() => {
          setPhase('idle');
          setMessage('');
          setClaim(null);
          isLockedRef.current = false;
          try {
            scannerRef.current?.resume();
          } catch {}
        }, ERROR_RESET_MS);
      }
    },
    [selectedMealId]
  );

  // 4. Initialize Camera QR Scanner via html5-qrcode
  useEffect(() => {
    if (!authed) return;
    let isMounted = true;

    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!isMounted) return;

        // Discover available cameras
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0 && isMounted) {
            setCameras(devices.map((d) => ({ id: d.id, label: d.label || `Camera ${d.id}` })));
          }
        } catch {}

        const scanner = new Html5Qrcode('meal-qr-reader', { verbose: false });
        scannerRef.current = scanner;

        const cameraConfig = selectedCameraId
          ? { deviceId: { exact: selectedCameraId } }
          : { facingMode: 'environment' };

        await scanner.start(
          cameraConfig,
          {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            if (isMounted) {
              void handleRedeem(decodedText, false);
            }
          },
          () => {} // silence normal frame-by-frame non-matches
        );

        // Check torch capability
        try {
          const videoTrack = (scanner as any).getRunningTrackCameraCapabilities?.() || null;
          if (videoTrack?.torch) {
            setHasTorch(true);
          }
        } catch {}
      } catch (err: any) {
        if (isMounted) {
          setCameraError(
            err?.message ||
              'Unable to access camera. Please allow camera permissions or use manual entry below.'
          );
        }
      }
    })();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [authed, selectedCameraId, handleRedeem]);

  // Torch toggle
  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      const nextTorch = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch {}
  };

  // Switch camera toggle
  const switchCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCameraId(cameras[nextIndex].id);
  };

  // 5. Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!authed) {
    return (
      <div className={styles.loading_page}>
        <div className={styles.spinner} />
        <p>Authenticating Food Counter Staff...</p>
      </div>
    );
  }

  return (
    <div className={styles.scanner_page}>
      <div className={styles.ambient_glow} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brand_dot} />
          <div className={styles.brand_title}>
            <span className={styles.brand_text}>Food Counter</span>
            <span className={styles.brand_sub}>TantraFiesta 2026</span>
          </div>
        </div>

        <div className={styles.header_actions}>
          <div className={styles.session_badge} title="Meals redeemed this session">
            <span>●</span>
            <span>{sessionCount} claimed</span>
          </div>
          <button className={styles.logout_btn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Scanner Body */}
      <main className={styles.body}>
        {/* Camera Viewfinder */}
        <div className={styles.viewfinder_container}>
          <div className={styles.viewfinder_wrap} data-state={phase}>
            {cameraError ? (
              <div className={styles.camera_error}>
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.75"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2v9.34" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p>{cameraError}</p>
                <button
                  className={styles.retry_btn}
                  onClick={() => window.location.reload()}
                >
                  Retry Camera
                </button>
              </div>
            ) : (
              <>
                <div id="meal-qr-reader" className={styles.qr_reader} />

                {/* Viewfinder brackets and laser sweep when idle */}
                {phase === 'idle' && (
                  <>
                    <div className={styles.corners}>
                      <div className={`${styles.corner} ${styles.tl}`} />
                      <div className={`${styles.corner} ${styles.tr}`} />
                      <div className={`${styles.corner} ${styles.bl}`} />
                      <div className={`${styles.corner} ${styles.br}`} />
                    </div>
                    <div className={styles.scan_line} />
                  </>
                )}

                {/* Processing overlay freeze */}
                {phase === 'processing' && (
                  <div className={styles.freeze_overlay}>
                    <div className={styles.spinner} />
                    <p style={{ fontWeight: 800, fontSize: '13px', color: '#faff52', letterSpacing: '0.06em' }}>
                      LOCKING & CLAIMING...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Camera Tools (Torch / Flip) */}
          <div className={styles.camera_tools}>
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`${styles.tool_btn} ${isTorchOn ? styles.active : ''}`}
                title="Toggle Flashlight"
              >
                <span>⚡</span>
                <span>{isTorchOn ? 'Flash On' : 'Flash'}</span>
              </button>
            )}

            {cameras.length > 1 && (
              <button
                type="button"
                onClick={switchCamera}
                className={styles.tool_btn}
                title="Switch Camera"
              >
                <span>🔄</span>
                <span>Flip Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Status Bar with Countdown Progress */}
        <div className={styles.status_container}>
          <div
            className={`${styles.status_bar} ${
              phase === 'idle'
                ? styles.status_idle
                : phase === 'processing'
                ? styles.status_processing
                : phase === 'success'
                ? styles.status_success
                : styles.status_error
            }`}
          >
            {phase === 'idle' && (
              <>
                <span style={{ fontSize: '18px' }}>📷</span>
                <span>Align participant meal QR inside frame</span>
              </>
            )}
            {phase === 'processing' && (
              <>
                <span>⏳</span>
                <span>{message}</span>
              </>
            )}
            {phase === 'success' && (
              <>
                <span style={{ fontSize: '18px' }}>✓</span>
                <span>{message}</span>
              </>
            )}
            {phase === 'error' && (
              <>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>{message}</span>
              </>
            )}
          </div>

          {/* Countdown timer track */}
          {(phase === 'success' || phase === 'error') && (
            <div className={styles.countdown_track}>
              <div
                className={`${styles.countdown_progress} ${
                  phase === 'success'
                    ? styles.countdown_success
                    : styles.countdown_error
                }`}
                style={{
                  animationDuration: `${
                    phase === 'success' ? SUCCESS_RESET_MS : ERROR_RESET_MS
                  }ms`,
                }}
              />
            </div>
          )}
        </div>

        {/* Success Redemption Details Card */}
        {claim && phase === 'success' && (
          <div className={styles.result_card}>
            <div className={styles.result_header}>
              <h3>Participant Verified</h3>
              <span className={styles.pill_verified}>CLAIMED</span>
            </div>
            <div className={styles.result_grid}>
              <div className={styles.result_row}>
                <span className={styles.result_label}>Name</span>
                <span className={styles.result_value}>
                  {claim.participant?.firstName} {claim.participant?.lastName}
                </span>
              </div>
              <div className={styles.result_row}>
                <span className={styles.result_label}>Fest ID</span>
                <span className={styles.result_festid}>
                  {claim.participant?.festId || 'N/A'}
                </span>
              </div>
              <div className={styles.result_row}>
                <span className={styles.result_label}>Meal Type</span>
                <span className={styles.result_value}>
                  {claim.typeOfMeal?.toUpperCase()} (Meal #{claim.mealId})
                </span>
              </div>
              {claim.grantedByEvent && (
                <div className={styles.result_row}>
                  <span className={styles.result_label}>Event</span>
                  <span className={styles.result_value}>
                    {claim.grantedByEvent}
                  </span>
                </div>
              )}
              <div className={styles.result_row}>
                <span className={styles.result_label}>Timestamp</span>
                <span className={styles.result_value} style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(claim.scannedAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Spoken Code Entry Fallback */}
        <div className={styles.manual_section}>
          <button
            className={styles.manual_toggle}
            onClick={() => setShowManual((v) => !v)}
          >
            <span>{showManual ? '▴ Hide Manual Code Entry' : "▾ Can't scan? Enter 8-letter pass code"}</span>
          </button>

          {showManual && (
            <div className={styles.manual_panel}>
              {meals.length > 0 && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Select Serving Session
                  </span>
                  <select
                    className={styles.meal_picker}
                    value={selectedMealId ?? ''}
                    onChange={(e) => setSelectedMealId(Number(e.target.value))}
                  >
                    {meals.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.isServingNow ? '★ ACTIVE' : ''} ({m.scannedCount} served)
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className={styles.manual_form}>
                <input
                  className={styles.manual_input}
                  placeholder="e.g. Y2MZ-CYTY"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleRedeem(manualCode, true);
                  }}
                  maxLength={9}
                  inputMode="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={phase === 'processing'}
                />
                <button
                  className={styles.manual_btn}
                  onClick={() => void handleRedeem(manualCode, true)}
                  disabled={
                    !manualCode.trim() ||
                    !selectedMealId ||
                    phase === 'processing'
                  }
                >
                  Redeem
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

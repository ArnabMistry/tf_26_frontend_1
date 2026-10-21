'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { Html5Qrcode } from 'html5-qrcode';
import s from './Portal.module.css';

export function MealQrScanner({ onScan, onClose }: {
  onScan: (token: string) => void;
  onClose: () => void;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const dialog = useRef<HTMLDialogElement>(null);
  const callbacks = useRef({ onScan, onClose });
  useEffect(() => { callbacks.current = { onScan, onClose }; }, [onScan, onClose]);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let decoded = false;
    let scanner: Html5Qrcode | undefined;
    const modal = dialog.current;
    modal?.showModal();
    const stop = async () => {
      if (!scanner) return;
      // start() may resolve before the first video frame sets isScanning.
      // stop() uses the scanner state machine and still releases that stream.
      await scanner.stop();
      if (document.getElementById(id)) scanner.clear();
    };
    const start = async () => {
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access requires HTTPS. Open the secure website and try again.');
        }
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
        if (cancelled) return;
        scanner = new Html5Qrcode(id, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false });
        await scanner.start({ facingMode: 'environment' }, { fps: 10 }, (value) => {
          if (cancelled || decoded) return;
          let token = '';
          try {
            const url = new URL(value);
            if (['https:', 'http:'].includes(url.protocol) && url.pathname === '/profile') {
              token = url.searchParams.get('claimMealToken') || '';
            }
          } catch { /* Unrelated QR codes are not meal claims. */ }
          if (!token || token.length > 256) {
            setError('This is not a meal counter QR. Scan the QR displayed by the event admin.');
            return;
          }
          decoded = true;
          // Ignore subsequent frames; unmount releases the camera stream.
          callbacks.current.onScan(token);
        }, () => { /* No QR in this frame; keep scanning. */ });
        if (cancelled) await stop();
        else setReady(true);
      } catch (err) {
        if (cancelled) return;
        const message = String(err);
        setError(/NotAllowed|Permission|denied/i.test(message)
          ? 'Camera permission was denied. Allow camera access in your browser settings, then close and reopen the scanner.'
          : /NotFound|DevicesNotFound/i.test(message)
            ? 'No camera was found. Use a device with a camera, or give your pass code to the counter staff.'
            : /HTTPS/.test(message) ? message.replace(/^Error: /, '')
              : 'Could not open the camera. Close other apps using it, then close and reopen the scanner. You can also give your pass code to the counter staff.');
      }
    };
    void start();
    return () => {
      cancelled = true;
      modal?.close();
      // If permission/start is still pending, start() stops it as soon as it resolves.
      if (scanner) void stop().catch(() => {});
    };
  }, [id]);

  return <dialog ref={dialog} className={s.scannerDialog} onCancel={event => { event.preventDefault(); callbacks.current.onClose(); }} aria-labelledby={`${id}-title`}>
    <div className={s.row}>
      <h2 id={`${id}-title`}>Scan counter QR</h2>
      <button className={s.secondary} onClick={onClose} autoFocus>Close camera</button>
    </div>
    <p className={s.muted}>Point your camera at the meal or snack QR on the admin counter. A valid scan claims your pass automatically.</p>
    {!ready && !error && <p role="status">Opening camera… Allow camera access when prompted.</p>}
    {error && <p role="alert" className={s.error}>{error}</p>}
    <div id={id} className={s.scannerViewport} />
  </dialog>;
}

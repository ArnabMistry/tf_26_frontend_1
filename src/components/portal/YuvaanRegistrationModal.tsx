'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { participantRequest } from '@/lib/participant';
import {
  YUVAAN_EVENT_ID,
  YUVAAN_SLUG,
  type YuvaanFormData,
  type YuvaanValidationErrors,
  validateYuvaanForm,
} from '@/lib/yuvaan';
import { YuvaanAddonSection } from './YuvaanAddonSection';
import s from './Portal.module.css';

interface YuvaanRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function YuvaanRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: YuvaanRegistrationModalProps) {
  const router = useRouter();
  const { user, loading } = useParticipant();

  const [formData, setFormData] = useState<YuvaanFormData>(() => ({
    pref1Committee: '',
    pref1Motion: 'For',
    pref2Committee: '',
    pref2Motion: 'For',
    pref3Committee: '',
    pref3Motion: 'For',
    schoolCollege: user?.collegeName || '',
    classYear: '',
  }));

  const [errors, setErrors] = useState<YuvaanValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof YuvaanFormData>(field: K, value: YuvaanFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      ...(field.includes('Committee') ? { committees: undefined } : {}),
    }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!user) {
      const returnUrl = `/events/${YUVAAN_SLUG}`;
      sessionStorage.setItem('tf_return_to', returnUrl);
      router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
      return;
    }

    const validation = validateYuvaanForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      await participantRequest('/api/user/registrations', {
        eventId: YUVAAN_EVENT_ID,
        preferences: [
          { committee: formData.pref1Committee, motion: formData.pref1Motion },
          { committee: formData.pref2Committee, motion: formData.pref2Motion },
          { committee: formData.pref3Committee, motion: formData.pref3Motion },
        ],
        schoolCollege: formData.schoolCollege.trim(),
        classYear: formData.classYear.trim(),
      });

      setIsSuccess(true);
      window.dispatchEvent(new Event('tf-inbox-change'));
      if (onSuccess) onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      role="presentation"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#2a1d42] to-[#1a1228] border border-[#65508288] rounded-2xl p-6 sm:p-8 shadow-2xl my-8 text-white max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Yuvaan Conclave Preferences"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="absolute top-4 right-4 text-[#b8afcf] hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 id="yuvaan-modal-title" className="text-2xl font-bold text-white">
              Registration Confirmed!
            </h3>
            <p className="text-sm text-[#b8afcf] max-w-md mx-auto">
              Your delegate application for <strong>Yuvaan: Youth Conclave</strong> has been successfully submitted.
            </p>

            <div className="text-left bg-black/30 border border-[#faff52]/20 rounded-xl p-4 space-y-2.5 mt-4 text-xs sm:text-sm">
              <p className="font-mono text-[#faff52] uppercase tracking-wider text-xs font-semibold">
                Submitted Preferences:
              </p>
              <p className="text-white">
                <span className="text-[#b8afcf]">1st Preference: </span>
                <span className="font-semibold text-[#faff52]">{formData.pref1Committee}</span>
                <span className="text-[#83ebba] font-mono ml-2">({formData.pref1Motion})</span>
              </p>
              <p className="text-white">
                <span className="text-[#b8afcf]">2nd Preference: </span>
                <span className="font-semibold text-[#faff52]">{formData.pref2Committee}</span>
                <span className="text-[#83ebba] font-mono ml-2">({formData.pref2Motion})</span>
              </p>
              <p className="text-white">
                <span className="text-[#b8afcf]">3rd Preference: </span>
                <span className="font-semibold text-[#faff52]">{formData.pref3Committee}</span>
                <span className="text-[#83ebba] font-mono ml-2">({formData.pref3Motion})</span>
              </p>
              <p className="text-white pt-1 border-t border-white/10">
                <span className="text-[#b8afcf]">Institution: </span>
                <span className="font-semibold">{formData.schoolCollege} ({formData.classYear})</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/profile"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ed1686] hover:bg-[#cc126f] text-white font-bold text-sm transition-colors text-center"
              >
                Go to My Portal ↗
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!loading && !user && (
              <div className="p-4 rounded-xl bg-[#faff52]/10 border border-[#faff52]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-bold text-[#faff52]">Sign in required</p>
                  <p className="text-xs text-[#b8afcf]">
                    You must be logged in to complete Yuvaan registration.
                  </p>
                </div>
                <Link
                  href={`/login?next=${encodeURIComponent(`/events/${YUVAAN_SLUG}`)}`}
                  className="px-4 py-2 bg-[#faff52] text-[#211832] font-bold text-xs rounded-lg hover:bg-[#faff52]/90 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
              </div>
            )}

            <YuvaanAddonSection
              data={formData}
              onChange={handleChange}
              errors={errors}
              disabled={submitting}
            />

            {apiError && (
              <div className="p-3.5 rounded-xl bg-pink-500/15 border border-pink-500/40 text-pink-300 text-sm" role="alert">
                ⚠️ {apiError}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#65508255]">
              <Link
                href={`/register/event?eventId=${YUVAAN_SLUG}`}
                className="text-xs text-[#b8afcf] hover:text-[#faff52] transition-colors"
              >
                Open standard portal registration →
              </Link>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#746087] text-sm font-semibold transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${s.button} w-full sm:w-auto whitespace-nowrap`}
                >
                  {submitting ? 'Registering…' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

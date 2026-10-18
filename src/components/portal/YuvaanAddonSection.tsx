'use client';

import React from 'react';
import {
  YUVAAN_COMMITTEES,
  YUVAAN_COMMITTEE_DESCRIPTIONS,
  type YuvaanFormData,
  type YuvaanValidationErrors,
  type YuvaanMotion,
} from '@/lib/yuvaan';
import s from './Portal.module.css';

interface YuvaanAddonSectionProps {
  data: YuvaanFormData;
  onChange: <K extends keyof YuvaanFormData>(field: K, value: YuvaanFormData[K]) => void;
  errors: YuvaanValidationErrors;
  disabled?: boolean;
}

const PREFERENCE_CONFIG = [
  {
    num: 1,
    title: 'Preference 1',
    committeeField: 'pref1Committee' as const,
    motionField: 'pref1Motion' as const,
    committeeId: 'yuvaan-pref-1-committee',
    motionForId: 'yuvaan-pref-1-motion-for',
    motionAgainstId: 'yuvaan-pref-1-motion-against',
    placeholder: 'Select 1st Committee Preference',
    errorKey: 'pref1Committee' as const,
    motionErrorKey: 'pref1Motion' as const,
  },
  {
    num: 2,
    title: 'Preference 2',
    committeeField: 'pref2Committee' as const,
    motionField: 'pref2Motion' as const,
    committeeId: 'yuvaan-pref-2-committee',
    motionForId: 'yuvaan-pref-2-motion-for',
    motionAgainstId: 'yuvaan-pref-2-motion-against',
    placeholder: 'Select 2nd Committee Preference',
    errorKey: 'pref2Committee' as const,
    motionErrorKey: 'pref2Motion' as const,
  },
  {
    num: 3,
    title: 'Preference 3',
    committeeField: 'pref3Committee' as const,
    motionField: 'pref3Motion' as const,
    committeeId: 'yuvaan-pref-3-committee',
    motionForId: 'yuvaan-pref-3-motion-for',
    motionAgainstId: 'yuvaan-pref-3-motion-against',
    placeholder: 'Select 3rd Committee Preference',
    errorKey: 'pref3Committee' as const,
    motionErrorKey: 'pref3Motion' as const,
  },
] as const;

export function YuvaanAddonSection({
  data,
  onChange,
  errors,
  disabled = false,
}: YuvaanAddonSectionProps) {
  const { pref1Committee, pref2Committee, pref3Committee, schoolCollege, classYear } = data;

  const isComplete =
    Boolean(pref1Committee) &&
    Boolean(pref2Committee) &&
    Boolean(pref3Committee) &&
    pref1Committee !== pref2Committee &&
    pref1Committee !== pref3Committee &&
    pref2Committee !== pref3Committee &&
    Boolean(data.pref1Motion) &&
    Boolean(data.pref2Motion) &&
    Boolean(data.pref3Motion) &&
    Boolean(schoolCollege.trim()) &&
    Boolean(classYear.trim());

  return (
    <section id="yuvaan-addon-form" className={s.card} aria-labelledby="yuvaan-form-heading">
      <div className={s.row}>
        <div>
          <p className={s.eyebrow}>Delegate Registration</p>
          <h2 id="yuvaan-form-heading" className="mt-2 text-xl sm:text-2xl font-bold text-white">
            Yuvaan Conclave Preferences
          </h2>
        </div>
        <span className={`${s.badge} ${isComplete ? s.accepted : s.pending}`}>
          {isComplete ? 'All Preferences Complete' : 'Mandatory Add-ons'}
        </span>
      </div>

      <p className={`${s.muted} mb-6`}>
        Yuvaan is an intellectual conclave focusing on structured debate and dialogue. Please select your 3 distinct committee
        preferences along with your motion stance (<strong>For</strong> or <strong>Against</strong>) for each committee, and
        provide your academic details.
      </p>

      {/* Global/Committee Error Alert */}
      {errors.committees && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-pink-500/15 border border-pink-500/40 text-pink-300 text-sm flex items-center gap-2"
          role="alert"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{errors.committees}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* PER-PREFERENCE CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">
              Committee Preferences &amp; Motion Stances <span className="text-[#faff52]">*</span>
            </label>
            <span className="text-xs text-[#b8afcf]">Select committee &amp; stance for all 3</span>
          </div>

          <div className="space-y-3">
            {PREFERENCE_CONFIG.map(({ num, title, committeeField, motionField, committeeId, motionForId, motionAgainstId, placeholder, errorKey, motionErrorKey }) => {
              const currentCommittee = data[committeeField];
              const currentMotion = data[motionField] as YuvaanMotion;
              const hasCommitteeError = Boolean(errors[errorKey]);

              // Check if this committee is duplicated in another preference
              const isDuplicate =
                Boolean(currentCommittee) &&
                ((num === 1 && (currentCommittee === pref2Committee || currentCommittee === pref3Committee)) ||
                  (num === 2 && (currentCommittee === pref1Committee || currentCommittee === pref3Committee)) ||
                  (num === 3 && (currentCommittee === pref1Committee || currentCommittee === pref2Committee)));

              return (
                <div
                  key={num}
                  className={`p-4 rounded-xl border transition-all ${
                    isDuplicate
                      ? 'bg-pink-500/10 border-pink-500/60'
                      : currentCommittee
                      ? 'bg-[#150e25]/90 border-[#65508288]'
                      : 'bg-black/25 border-[#65508244]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#faff52] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#faff52] text-[#211832] inline-flex items-center justify-center text-xs font-bold">
                        {num}
                      </span>
                      {title}
                    </span>
                    {currentCommittee && (
                      <span className="text-xs text-[#83ebba] font-mono">
                        Stance: <strong>{currentMotion}</strong>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                    {/* Committee Selection */}
                    <div className="lg:col-span-7 flex flex-col gap-1.5">
                      <label htmlFor={committeeId} className="text-xs text-[#b8afcf] font-medium">
                        Committee Track
                      </label>
                      <select
                        id={committeeId}
                        value={currentCommittee}
                        disabled={disabled}
                        onChange={(e) => onChange(committeeField, e.target.value)}
                        className={`w-full rounded-xl p-3 text-sm bg-[#1c1333] border transition-colors cursor-pointer text-white focus:outline-none focus:ring-2 focus:ring-[#faff52] ${
                          hasCommitteeError || isDuplicate
                            ? 'border-pink-500 ring-1 ring-pink-500/40'
                            : 'border-[#786088] hover:border-[#faff52]/50'
                        }`}
                        aria-required="true"
                      >
                        <option value="" className="bg-[#1b1230] text-gray-400">
                          {placeholder}
                        </option>
                        {YUVAAN_COMMITTEES.map((comm) => (
                          <option key={comm} value={comm} className="bg-[#1b1230] text-white">
                            {comm}
                          </option>
                        ))}
                      </select>
                      {errors[errorKey] && (
                        <span className="text-xs text-pink-400">{errors[errorKey]}</span>
                      )}
                    </div>

                    {/* Motion Stance Toggle / Radios */}
                    <div className="lg:col-span-5 flex flex-col gap-1.5">
                      <span className="text-xs text-[#b8afcf] font-medium">
                        Motion Stance for {title}
                      </span>
                      <div
                        className="grid grid-cols-2 gap-2"
                        role="radiogroup"
                        aria-label={`Motion Stance for ${title}`}
                      >
                        <label
                          htmlFor={motionForId}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                            currentMotion === 'For'
                              ? 'bg-[#faff52]/15 border-[#faff52] text-[#faff52] shadow-sm shadow-[#faff52]/20'
                              : 'bg-black/30 border-[#786088] text-[#cdbfdc] hover:border-[#faff52]/40 hover:bg-white/[0.03]'
                          } ${disabled ? 'opacity-80 cursor-default' : ''}`}
                        >
                          <input
                            type="radio"
                            id={motionForId}
                            name={`yuvaan-motion-pref-${num}`}
                            value="For"
                            checked={currentMotion === 'For'}
                            disabled={disabled}
                            onChange={() => onChange(motionField, 'For')}
                            className="accent-[#faff52] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>For</span>
                        </label>

                        <label
                          htmlFor={motionAgainstId}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                            currentMotion === 'Against'
                              ? 'bg-[#faff52]/15 border-[#faff52] text-[#faff52] shadow-sm shadow-[#faff52]/20'
                              : 'bg-black/30 border-[#786088] text-[#cdbfdc] hover:border-[#faff52]/40 hover:bg-white/[0.03]'
                          } ${disabled ? 'opacity-80 cursor-default' : ''}`}
                        >
                          <input
                            type="radio"
                            id={motionAgainstId}
                            name={`yuvaan-motion-pref-${num}`}
                            value="Against"
                            checked={currentMotion === 'Against'}
                            disabled={disabled}
                            onChange={() => onChange(motionField, 'Against')}
                            className="accent-[#faff52] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>Against</span>
                        </label>
                      </div>
                      {errors[motionErrorKey] && (
                        <span className="text-xs text-pink-400">{errors[motionErrorKey]}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Committee brief guide */}
          <div className="mt-2.5 p-3 rounded-lg bg-black/20 border border-[#65508244] text-xs text-[#b8afcf] space-y-1">
            <p className="font-semibold text-white/90">Official Committees Overview:</p>
            <p>
              • <strong className="text-[#faff52]">Human Development</strong>: {YUVAAN_COMMITTEE_DESCRIPTIONS['Human Development']}
            </p>
            <p>
              • <strong className="text-[#faff52]">Civic laws and policies</strong>: {YUVAAN_COMMITTEE_DESCRIPTIONS['Civic laws and policies']}
            </p>
            <p>
              • <strong className="text-[#faff52]">Press</strong>: {YUVAAN_COMMITTEE_DESCRIPTIONS['Press']}
            </p>
          </div>
        </div>

        {/* INSTITUTION AND CLASS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#65508244]">
          {/* School / College Name */}
          <div className="space-y-1.5">
            <label htmlFor="yuvaan-school-college" className="text-sm font-semibold text-white block">
              School / College Name <span className="text-[#faff52]">*</span>
            </label>
            <input
              id="yuvaan-school-college"
              type="text"
              value={schoolCollege}
              disabled={disabled}
              placeholder="e.g. IIIT Nagpur"
              maxLength={160}
              onChange={(e) => onChange('schoolCollege', e.target.value)}
              className={`w-full rounded-xl p-3 text-sm bg-[#150e25] border transition-colors text-white focus:outline-none focus:ring-2 focus:ring-[#faff52] ${
                errors.schoolCollege ? 'border-pink-500 ring-1 ring-pink-500/40' : 'border-[#786088] hover:border-[#faff52]/50'
              }`}
              aria-required="true"
            />
            <p className="text-[11px] text-[#b8afcf]">Pre-filled from your profile. You may edit if needed.</p>
            {errors.schoolCollege && (
              <span className="text-xs text-pink-400 block">{errors.schoolCollege}</span>
            )}
          </div>

          {/* Class / Year of Study */}
          <div className="space-y-1.5">
            <label htmlFor="yuvaan-class-year" className="text-sm font-semibold text-white block">
              Class / Year of Study <span className="text-[#faff52]">*</span>
            </label>
            <input
              id="yuvaan-class-year"
              type="text"
              value={classYear}
              disabled={disabled}
              placeholder="e.g. 3rd Year, 12th Grade"
              maxLength={80}
              onChange={(e) => onChange('classYear', e.target.value)}
              className={`w-full rounded-xl p-3 text-sm bg-[#150e25] border transition-colors text-white focus:outline-none focus:ring-2 focus:ring-[#faff52] ${
                errors.classYear ? 'border-pink-500 ring-1 ring-pink-500/40' : 'border-[#786088] hover:border-[#faff52]/50'
              }`}
              aria-required="true"
            />
            <p className="text-[11px] text-[#b8afcf]">Enter your current grade or university academic year.</p>
            {errors.classYear && (
              <span className="text-xs text-pink-400 block">{errors.classYear}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

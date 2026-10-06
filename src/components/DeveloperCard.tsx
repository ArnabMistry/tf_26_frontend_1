"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Developer } from "@/data/developers";

interface DeveloperCardProps {
  developer: Developer;
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(developer.image) && !hasError;

  return (
    <article className="group flex flex-col items-center w-full max-w-[340px] mx-auto transition-transform duration-200">
      {/* Photo frame: exact UI/UX team 338x390 proportion with 16px corner radius and sticker shadow */}
      <div
        className="relative w-full aspect-[338/390] rounded-[16px] bg-[#E7137D] overflow-hidden transition-all duration-200 ease-out group-hover:-translate-y-2 shadow-[8px_8px_0px_#730E40] sm:shadow-[12px_12px_0px_#730E40] group-hover:shadow-[12px_16px_0px_#730E40]"
        aria-label={`${developer.name} photo`}
      >
        {showImage && (
          <Image
            src={developer.image!}
            alt={`${developer.name} - ${developer.role}`}
            fill
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 320px, 340px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Name & Role */}
      <div className="mt-3.5 sm:mt-4 flex flex-col items-center text-center px-1">
        <h3
          className="text-[15px] sm:text-base md:text-[17px] font-bold uppercase tracking-wider text-white leading-tight"
          style={{ fontFamily: 'var(--font-futura)' }}
        >
          {developer.name}
        </h3>
        <p
          className="mt-1 text-xs sm:text-[13px] font-normal text-white/70 tracking-normal"
          style={{ fontFamily: 'var(--font-futura)' }}
        >
          {developer.role}
        </p>
      </div>
    </article>
  );
}

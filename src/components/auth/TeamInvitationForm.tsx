"use client";

import React, { useState } from "react";

export function TeamInvitationForm() {
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [tfIds, setTfIds] = useState(["", ""]);

  const handleAddMore = () => {
    setTfIds([...tfIds, ""]);
  };

  const updateTfId = (index: number, value: string) => {
    const newTfIds = [...tfIds];
    newTfIds[index] = value;
    setTfIds(newTfIds);
  };

  return (
    <div className="w-full max-w-[500px]">
      <form className="flex flex-col gap-6 md:gap-8 w-full" onSubmit={(e) => e.preventDefault()}>
        {/* TEAM NAME */}
        <div>
          <label
            htmlFor="team-name"
            className="block text-white font-extrabold text-xs md:text-sm tracking-wider uppercase mb-2"
            style={{ fontFamily: "var(--font-futura)" }}
          >
            TEAM NAME
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full h-10 md:h-12 px-4 rounded-lg bg-[#160d35]/40 border-[1.5px] border-[#E7137D] text-white focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all font-sans text-sm md:text-base"
          />
        </div>

        {/* TEAM LEADER NAME */}
        <div>
          <label
            htmlFor="team-leader"
            className="block text-white font-extrabold text-xs md:text-sm tracking-wider uppercase mb-2"
            style={{ fontFamily: "var(--font-futura)" }}
          >
            TEAM LEADER NAME
          </label>
          <input
            id="team-leader"
            type="text"
            value={teamLeader}
            onChange={(e) => setTeamLeader(e.target.value)}
            className="w-full h-10 md:h-12 px-4 rounded-lg bg-[#160d35]/40 border-[1.5px] border-[#E7137D] text-white focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all font-sans text-sm md:text-base"
          />
        </div>

        {/* TF ID'S list */}
        <div className="flex flex-col gap-6">
          {tfIds.map((id, index) => (
            <div key={index}>
              <label
                className="block text-white font-extrabold text-xs md:text-sm tracking-wider uppercase mb-2"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                TF ID&apos;S
              </label>
              <div className="flex gap-4 items-center h-10 md:h-12">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => updateTfId(index, e.target.value)}
                  className="flex-1 h-full px-4 rounded-lg bg-[#160d35]/40 border-[1.5px] border-[#E7137D] text-white focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all font-sans text-sm md:text-base"
                />
                
                {/* INVITE BUTTON */}
                <button
                  type="button"
                  className="relative shrink-0 h-full px-6 bg-[#E7137D] text-white font-extrabold uppercase text-sm md:text-base tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all hover:brightness-110 active:translate-y-[2px]"
                  style={{
                    fontFamily: "var(--font-futura)",
                    transform: "skewX(-10deg)",
                    boxShadow: "3px 4px 0 0 #A80D5A"
                  }}
                  onClick={() => alert(`Inviting ID: ${id}`)}
                >
                  <span className="flex items-center gap-2" style={{ transform: "skewX(10deg)" }}>
                    INVITE
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD MORE ID'S BUTTON */}
        <div className="mt-2">
          <button
            type="button"
            onClick={handleAddMore}
            className="w-fit h-10 md:h-12 px-6 md:px-8 bg-[#E7137D] text-white font-extrabold uppercase text-sm md:text-base tracking-wider rounded-lg flex items-center justify-center gap-2 md:gap-3 transition-all hover:brightness-110 active:translate-y-[2px]"
            style={{
              fontFamily: "var(--font-futura)",
              boxShadow: "3px 4px 0 0 #A80D5A"
            }}
          >
            <span className="bg-white text-[#E7137D] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-lg md:text-xl font-bold leading-none pb-[2px]">
              +
            </span>
            ADD MORE ID&apos;S
          </button>
        </div>
      </form>
    </div>
  );
}

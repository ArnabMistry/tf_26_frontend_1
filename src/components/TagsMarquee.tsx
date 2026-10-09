import React from "react";

const row1 = [
  { text: "REGISTRATIONS", bgFront: "bg-[#F44383]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#F44383]" },
  { text: "ROBOTICS", bgFront: "bg-[#107548]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#107548]" },
  { text: "WORKSHOPS", bgFront: "bg-[#564BE3]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#564BE3]" },
  { text: "INNOVATION", bgFront: "bg-[#D45631]", fgFront: "text-[#FDF8E4]", bgBack: "bg-[#FDF8E4]", fgBack: "text-[#D45631]" },
  { text: "REGISTRATIONS", bgFront: "bg-[#F44383]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#F44383]" },
  { text: "ROBOTICS", bgFront: "bg-[#107548]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#107548]" },
];

const row2 = [
  { text: "SPORTS", bgFront: "bg-[#CEF213]", fgFront: "text-[#13633C]", bgBack: "bg-[#13633C]", fgBack: "text-[#CEF213]" },
  { text: "SPEAKERS", bgFront: "bg-[#564BE3]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#564BE3]" },
  { text: "HACKATHONS", bgFront: "bg-[#FDF8E4]", fgFront: "text-[#F44383]", bgBack: "bg-[#F44383]", fgBack: "text-[#FDF8E4]" },
  { text: "DESIGN", bgFront: "bg-[#D45631]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#D45631]" },
  { text: "SPORTS", bgFront: "bg-[#CEF213]", fgFront: "text-[#13633C]", bgBack: "bg-[#13633C]", fgBack: "text-[#CEF213]" },
  { text: "SPEAKERS", bgFront: "bg-[#564BE3]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#564BE3]" },
];

const row3 = [
  { text: "VR", bgFront: "bg-[#D45631]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#D45631]" },
  { text: "EVENTS", bgFront: "bg-[#107548]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#107548]" },
  { text: "INSTAGRAM", bgFront: "bg-[#FDF8E4]", fgFront: "text-[#564BE3]", bgBack: "bg-[#564BE3]", fgBack: "text-[#FDF8E4]" },
  { text: "MUSIC PLAYLIST", bgFront: "bg-[#F44383]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#F44383]" },
  { text: "VR", bgFront: "bg-[#D45631]", fgFront: "text-white", bgBack: "bg-white", fgBack: "text-[#D45631]" },
  { text: "EVENTS", bgFront: "bg-[#107548]", fgFront: "text-[#FDF12C]", bgBack: "bg-[#FDF12C]", fgBack: "text-[#107548]" },
];

const makeSeamlessTrack = (arr: typeof row1) => {
  const base = [...arr, ...arr, ...arr];
  return [...base, ...base];
};

const PillCard = ({ item }: { item: typeof row1[0] }) => (
  <div className="group shrink-0 cursor-pointer [perspective:1200px]">
    <div className="relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
      
      {/* Front Face */}
      <div className={`${item.bgFront} ${item.fgFront} px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-4 md:py-5 lg:py-6 rounded-2xl md:rounded-3xl shadow-xl border-b-[5px] md:border-b-8 border-black/20 flex items-center justify-center [backface-visibility:hidden]`}>
        <span className="font-tantra text-5xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] tracking-tight uppercase leading-none block [text-shadow:1px_2px_0px_rgba(0,0,0,0.25)]">
          {item.text}
        </span>
      </div>

      {/* Back Face */}
      <div className={`${item.bgBack} ${item.fgBack} absolute inset-0 px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-4 md:py-5 lg:py-6 rounded-2xl md:rounded-3xl shadow-xl border-b-[5px] md:border-b-8 border-black/20 flex items-center justify-center [backface-visibility:hidden] [transform:rotateX(180deg)]`}>
        <span className="font-tantra text-5xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] tracking-tight uppercase leading-none block [text-shadow:1px_2px_0px_rgba(0,0,0,0.25)]">
          {item.text}
        </span>
      </div>

    </div>
  </div>
);

export function TagsMarquee() {
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat py-14 md:py-24 overflow-hidden flex flex-col gap-6 md:gap-8">
      
      {/* Row 1 */}
      <div className="flex w-full overflow-hidden select-none">
        <div 
          className="animate-marquee flex gap-6 md:gap-8 items-center whitespace-nowrap pr-6 md:pr-8"
          style={{ animationDuration: "80s" }}
        >
          {makeSeamlessTrack(row1).map((item, idx) => (
            <PillCard key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2 (Reverse) */}
      <div className="flex w-full overflow-hidden select-none">
        <div 
          className="animate-marquee-reverse flex gap-6 md:gap-8 items-center whitespace-nowrap pr-6 md:pr-8"
          style={{ animationDuration: "80s", animationDelay: "-25s" }}
        >
          {makeSeamlessTrack(row2).map((item, idx) => (
            <PillCard key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex w-full overflow-hidden select-none">
        <div 
          className="animate-marquee flex gap-6 md:gap-8 items-center whitespace-nowrap pr-6 md:pr-8"
          style={{ animationDuration: "80s", animationDelay: "-45s" }}
        >
          {makeSeamlessTrack(row3).map((item, idx) => (
            <PillCard key={idx} item={item} />
          ))}
        </div>
      </div>
      
    </section>
  );
}

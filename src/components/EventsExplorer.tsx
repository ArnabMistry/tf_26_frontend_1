"use client";

import { useMemo, useRef, useCallback, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { Reveal } from "@/components/Reveal";
import { getClubLogo } from "@/lib/clubs";
import { eventCategories, groupEventsForLayout, type EventListing } from "@/lib/events";
import styles from "./EventsExplorer.module.css";

interface EventsExplorerProps {
  events: EventListing[];
}

export function EventsExplorer({ events }: EventsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [registrationEvent, setRegistrationEvent] = useState<EventListing | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  // Read filter state from URL so back/forward navigation restores filters
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? null;
  const clubFilter = searchParams.get("club") ?? null;

  // The search input is a controlled local value that only commits on submit
  const searchInputRef = useRef<HTMLInputElement>(null);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Clubs actually present in this catalog, alphabetized, so the filter list
  // never offers a club with zero events in it. A joint event lists under
  // each of its organizing clubs.
  const clubOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const event of events) {
      for (const club of event.clubs) {
        if (!seen.has(club.slug)) seen.set(club.slug, club.name);
      }
    }
    return [...seen.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleEvents = events.filter((event) => {
    const clubNames = event.clubs.map((c) => c.name).join(" ");
    const haystack = `${event.name} ${clubNames} ${event.description}`.toLocaleLowerCase();
    const matchesSearch = haystack.includes(normalizedSearch);
    const matchesCategory = !category || event.categories.includes(category);
    const matchesClub = !clubFilter || event.clubs.some((c) => c.slug === clubFilter);
    return matchesSearch && matchesCategory && matchesClub;
  });
  const eventGroups = groupEventsForLayout(visibleEvents);

  const clubFilterName = clubFilter ? clubOptions.find((c) => c.slug === clubFilter)?.name : undefined;
  const heading = normalizedSearch
    ? "Search Results"
    : eventCategories.find((item) => item.id === category)?.heading
      || (clubFilterName ? `${clubFilterName} Events` : "All Events");

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = searchInputRef.current?.value ?? "";
    updateParams({ q: value || null });
    resultsRef.current?.focus({ preventScroll: true });
  }

  function resetFilters() {
    if (searchInputRef.current) searchInputRef.current.value = "";
    updateParams({ q: null, category: null, club: null });
  }

  function showRegistration(event: EventListing) {
    setRegistrationEvent(event);
    dialogRef.current?.showModal();
  }

  return (
    <main className={styles.explorer} id="events-content">
      <div className={styles.toolbar}>
        <h1 className={`${styles.pageTitle} drop-shadow-md`}>EVENTS</h1>
        <div className={styles.controls}>
          <form role="search" aria-label="Search events" className={styles.searchForm} onSubmit={handleSearch}>
            <label htmlFor="event-search" className="sr-only">Search for an event or club</label>
            <input
              id="event-search"
              ref={searchInputRef}
              type="search"
              placeholder="Search For Event Here"
              defaultValue={search}
              key={search}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton} aria-label="Search events">
              <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" />
              </svg>
            </button>
          </form>
          <div className={styles.filterControl}>
            <button type="button" className={`${styles.filterButton} ${clubFilter ? styles.filterButtonActive : ""}`} popoverTarget="club-filter-notice">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2.5" fill="#393163" /><circle cx="15" cy="17" r="2.5" fill="#393163" />
              </svg>
              {clubFilterName ? `Club: ${clubFilterName}` : "Filter"}
            </button>
            <div id="club-filter-notice" popover="auto" className={styles.filterNotice}>
              <strong>Filter by club</strong>
              <div className={styles.clubList} role="group" aria-label="Filter events by club">
                {clubOptions.map((club) => {
                  const logo = getClubLogo(club.slug);
                  return (
                    <button
                      key={club.slug}
                      type="button"
                      className={styles.clubChip}
                      aria-pressed={clubFilter === club.slug}
                      onClick={() => updateParams({ club: clubFilter === club.slug ? null : club.slug })}
                    >
                      {logo ? (
                        <Image src={logo} alt="" width={28} height={28} className={styles.clubChipLogo} />
                      ) : (
                        <span className={styles.clubChipMonogram} aria-hidden="true">
                          {club.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {club.name}
                    </button>
                  );
                })}
              </div>
              <div className={styles.filterActions}>
                <button type="button" className={styles.filterClear} onClick={() => updateParams({ club: null })}>Clear</button>
                <button type="button" popoverTarget="club-filter-notice" popoverTargetAction="hide">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.categories} role="group" aria-label="Event categories">
        {eventCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.category}
            aria-pressed={category === item.id}
            onClick={() => updateParams({ category: category === item.id ? null : item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className={styles.results} aria-labelledby="event-results-heading" id="event-list">
        <h2 id="event-results-heading" ref={resultsRef} tabIndex={-1} className={styles.sectionTitle}>{heading}</h2>
        <p className="sr-only" role="status">{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"} found{normalizedSearch ? ` for ${search}` : ""}.</p>
        {visibleEvents.length > 0 ? (
          <div className={styles.cardGroups}>
            {eventGroups.map((group) => (
              <Reveal variant="split" key={group.map((event) => event.id).join(":")} className={`${styles.cards} ${styles.eventEntrance} ${group.length === 4 ? styles.evenCards : ""} ${group.length === 1 ? styles.singleCard : ""}`}>
                {group.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    reveal
                    variant={group.length === 1 || (group.length === 3 && index === 2) ? "center" : index % 2 === 0 ? "left" : "right"}
                    lowerWing={group.length === 4 && index >= 2}
                    onRegister={showRegistration}
                  />
                ))}
              </Reveal>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{normalizedSearch ? "No matching events" : "More events on the way"}</p>
            <p>{normalizedSearch ? "Try another event or club name, or explore a different category." : "Stay tuned. Events in this category will be announced soon."}</p>
            {(category || normalizedSearch || clubFilter) && <button type="button" onClick={resetFilters}>Show all events <span aria-hidden="true">↗</span></button>}
          </div>
        )}
      </section>

      <dialog ref={dialogRef} className={styles.registrationDialog} aria-labelledby="registration-title" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        <div className={styles.dialogContent}>
          <p className={styles.dialogEyebrow}>{registrationEvent?.name}</p>
          <h2 id="registration-title">See you at the starting line.</h2>
          <p>Registration details will be announced soon. Check back for the official registration link.</p>
          <form method="dialog"><button autoFocus>Got it <span aria-hidden="true">↗</span></button></form>
        </div>
      </dialog>
    </main>
  );
}

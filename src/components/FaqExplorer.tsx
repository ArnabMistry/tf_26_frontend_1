"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import { FAQ_CATEGORIES, FAQS_DATA, type FAQItem } from "@/data/faqs";
import styles from "./FaqExplorer.module.css";

export function FaqExplorer() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([FAQS_DATA[0]?.id, FAQS_DATA[1]?.id]));
  const baseId = useId();

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS_DATA.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesQuery = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [search, activeCategory]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const allExpanded = filteredFaqs.length > 0 && filteredFaqs.every((f) => openIds.has(f.id));

  return (
    <div className={styles.faqContainer}>
      <div className={styles.controlsBar}>
        {/* Search */}
        <div className={styles.searchForm}>
          <input
            id="faq-search"
            type="search"
            placeholder="Search questions (e.g., certificates, hostel, registration)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search frequently asked questions"
          />
          <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Category Pills */}
        <div className={styles.categoriesList} role="tablist" aria-label="FAQ Categories">
          {FAQ_CATEGORIES.map((cat) => {
            const count = cat.id === "all" ? FAQS_DATA.length : FAQS_DATA.filter((f) => f.category === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className={styles.actionsHeader}>
        <span className={styles.resultsCount}>
          Showing <strong>{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? "question" : "questions"}
          {search && ` for "${search}"`}
        </span>
        {filteredFaqs.length > 0 && (
          <button
            type="button"
            onClick={allExpanded ? collapseAll : expandAll}
            className={styles.toggleAllBtn}
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        )}
      </div>

      {/* Questions Accordion */}
      {filteredFaqs.length > 0 ? (
        <ul className={styles.accordionList} role="list">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIds.has(faq.id);
            const questionId = `${baseId}-q-${faq.id}`;
            const answerId = `${baseId}-a-${faq.id}`;

            return (
              <li key={faq.id} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={questionId}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleItem(faq.id)}
                    className={styles.faqTrigger}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={styles.faqChevron}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={styles.faqAnswer}
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No matching questions found</p>
          <p className={styles.emptyText}>
            Try adjusting your search terms or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className={styles.resetBtn}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Support Callout */}
      <div className={styles.supportCallout}>
        <h2 className={styles.supportTitle}>Still have questions?</h2>
        <p className={styles.supportText}>
          Can&apos;t find what you&apos;re looking for? Our student organizing committee and hospitality team are ready to assist you.
        </p>
        <div className={styles.supportActions}>
          <Link href="/contact" className={styles.supportBtn}>
            <span>Contact Helpdesk</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/refund-policy" className={styles.secondaryBtn}>
            <span>View Refund Policy</span>
          </Link>
          <a href="mailto:contact@tantrafiesta.in" className={styles.secondaryBtn}>
            <span>Email Organizers</span>
          </a>
        </div>
      </div>
    </div>
  );
}

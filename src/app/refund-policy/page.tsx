import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Cancellation & Refund Policy",
  "Official cancellation and refund policy for event registrations, workshops, and fees at TantraFiesta 2026, IIIT Nagpur.",
  "/refund-policy",
  {
    keywords: [
      "TantraFiesta refund policy",
      "IIIT Nagpur tech fest refund",
      "cancellation policy",
      "event registration fee refund",
      "Razorpay refund TantraFiesta",
    ],
  }
);

export default function RefundPolicyPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Refund Policy", path: "/refund-policy" },
  ]);

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#policy-content" className={styles.skipLink}>
        Skip to policy content
      </a>
      <Navbar currentPath="/refund-policy" />

      <main id="policy-content" className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>CANCELLATION &amp; REFUND POLICY</h1>
          <p className={styles.subtitle}>
            TantraFiesta 2026 is committed to fair, transparent, and prompt handling of participant fees, cancellations, and transaction disputes.
          </p>
          <span className={styles.lastUpdated}>Effective for TantraFiesta 2026 (Updated October 2026)</span>
        </header>

        {/* Quick Summary Cards */}
        <div className={styles.highlightBanner}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} aria-hidden="true">🔄</div>
            <h2 className={styles.highlightTitle}>100% Cancellation Refund</h2>
            <p className={styles.highlightText}>
              Full refund if any event or competition is cancelled by the organizing committee.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} aria-hidden="true">⏱️</div>
            <h2 className={styles.highlightTitle}>5–7 Business Days</h2>
            <p className={styles.highlightText}>
              Approved refunds are disbursed directly to your original source account via Razorpay.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} aria-hidden="true">🛡️</div>
            <h2 className={styles.highlightTitle}>Duplicate Payment Protection</h2>
            <p className={styles.highlightText}>
              Automatic reconciliation and 100% reimbursement for inadvertent double debits.
            </p>
          </div>
        </div>

        {/* Detailed Sections Card */}
        <article className={styles.policyCard}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>1</span>
              <span>Overview &amp; Scope</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                This policy governs all registration fees, workshop passes, competitive entry fees, and hospitality bookings paid through the official TantraFiesta portal (<strong>tantrafiesta.in</strong>) or authorized payment gateways for the 2026 edition of TantraFiesta, hosted by the Indian Institute of Information Technology, Nagpur (IIIT Nagpur).
              </p>
              <p>
                By completing an event registration or fee transaction, the participant (and in the case of team events, the team leader and all registered members) acknowledges and accepts the terms outlined below.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>2</span>
              <span>General Registration Fees</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                Except under the specific circumstances delineated in Section 3 and Section 4 below, <strong>event registration fees are generally non-refundable once payment is confirmed</strong>.
              </p>
              <p>
                Upon payment confirmation, the organizing clubs commit campus resources, infrastructure bandwidth, cloud hosting capacity, evaluation slots, delegate kits, and hospitality provisions for your squad. Therefore, voluntary cancellations by participants are not eligible for a refund.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>3</span>
              <span>Cancellation or Postponement by Organizers</span>
            </h2>
            <div className={styles.sectionContent}>
              <ul className={styles.sectionList}>
                <li>
                  <strong>Event Cancellation:</strong> In the rare circumstance that an official competition, workshop, or flagship hackathon is cancelled entirely by TantraFiesta and not rescheduled, all registered participants will receive a <strong>100% full refund</strong> of their entry fee.
                </li>
                <li>
                  <strong>Schedule Adjustments:</strong> If an event&apos;s offline round is postponed by more than 48 hours from its published dates due to unforeseen campus emergencies or force majeure, registered participants who are unable to attend the rescheduled date may request a full refund within 48 hours of the announcement.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>4</span>
              <span>Duplicate &amp; Erroneous Transactions</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                In case of technical errors, connection dropouts, or gateway timeouts resulting in multiple debits for a single registration:
              </p>
              <ul className={styles.sectionList}>
                <li>
                  The duplicate transaction will be identified during daily payment gateway audits and refunded automatically.
                </li>
                <li>
                  Participants may also notify our finance desk immediately by emailing <strong>contact@tantrafiesta.in</strong> with their transaction UTR, Razorpay Payment ID, and registered contact number to expedite reconciliation.
                </li>
              </ul>
              <div className={styles.alertBox}>
                <strong>Note:</strong> Bank charges or payment gateway convenience fees (if levied by your card provider or bank) are non-refundable as they are consumed by financial intermediaries during transaction processing.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>5</span>
              <span>Multi-Stage &amp; Qualification-Triggered Events</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                Certain competitions (e.g. Crown Clash) operate on a multi-stage qualification model where online preliminary entry is free and the registration fee is payable only upon qualification to the offline final rounds:
              </p>
              <ul className={styles.sectionList}>
                <li>
                  Entry fees paid upon Round 2 promotion are final once paid and cannot be refunded if the participant subsequently forfeits or fails to arrive on campus.
                </li>
                <li>
                  If an organizer disqualifies a team prior to the round commencing due to an administrative error on our end, the fee is refunded in full.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>6</span>
              <span>Non-Refundable Scenarios</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>Refunds will strictly NOT be granted under the following circumstances:</p>
              <ul className={styles.sectionList}>
                <li>
                  <strong>No-shows:</strong> Failure to arrive on the IIIT Nagpur campus or join an online contest at the scheduled reporting time.
                </li>
                <li>
                  <strong>Disqualification:</strong> Disqualification from any competition due to plagiarism, cheating, tab-switching malpractices, code of conduct breaches, or misbehavior with organizers, judges, or fellow participants.
                </li>
                <li>
                  <strong>Incomplete Teams:</strong> Inability of one or more team members to attend, provided the team still meets minimum eligibility or chooses to proceed short-handed.
                </li>
                <li>
                  <strong>Device or Internet Failure:</strong> Personal hardware failure, laptop issues, or loss of personal mobile connectivity during online contests.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>7</span>
              <span>Refund Processing &amp; Disbursement Timeline</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                All sanctioned refunds are initiated directly through Razorpay back to the original source account (UPI ID, Debit/Credit Card, or Net Banking account) from which the payment originated.
              </p>
              <p>
                Under normal banking operations, the refunded amount reflects in the customer&apos;s bank account within <strong>5 to 7 business days</strong> from the date of approval. No cash refunds will be issued under any circumstances.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>8</span>
              <span>Grievance Redressal &amp; Support Contact</span>
            </h2>
            <div className={styles.sectionContent}>
              <p>
                For any questions, refund requests, or payment issues regarding TantraFiesta 2026, please write to our finance and organizing desk with the following details:
              </p>
              <ul className={styles.sectionList}>
                <li>Full Name and College/Institute Name</li>
                <li>Registered Email Address and Phone Number</li>
                <li>Event Name and Team Name (if applicable)</li>
                <li>Payment Receipt / Razorpay Payment ID</li>
                <li>Brief description of the issue or refund reason</li>
              </ul>
            </div>
          </section>
        </article>

        {/* Contact Helpdesk Callout */}
        <div className={styles.contactBox}>
          <h2 className={styles.contactTitle}>Need help with a payment or refund?</h2>
          <p className={styles.contactText}>
            Our finance and student organizing teams are committed to assisting you quickly. Reach out via email or visit the on-campus Central Helpdesk during fest days.
          </p>
          <div className={styles.contactActions}>
            <a href="mailto:contact@tantrafiesta.in?subject=Refund%20Query%20-%20TantraFiesta%202026" className={styles.contactBtn}>
              <span>Email Finance Desk</span>
              <span aria-hidden="true">→</span>
            </a>
            <Link href="/faqs" className={styles.faqLinkBtn}>
              <span>Browse All FAQs</span>
            </Link>
            <Link href="/contact" className={styles.faqLinkBtn}>
              <span>Contact Organizers</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer variant="yellow" />
    </div>
  );
}

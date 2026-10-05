import Image from "next/image";
import Link from "next/link";
import styles from "./BrandFooter.module.css";

export function BrandFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.clubs}>
        <h2 className="sr-only">Our organizing clubs</h2>
        <div className={styles.logoScroll} role="region" aria-label="Organizing club logos" tabIndex={0}>
          <Image src="/assets/club%20logos.svg" alt="TantraFiesta organizing clubs" width={1395} height={146} className={styles.clubLogos} unoptimized />
        </div>
      </div>
      <Link href="/" aria-label="TantraFiesta home" className={styles.wordmark}>
        <Image src="/assets/tf_nav.png" alt="TantraFiesta" width={4096} height={514} sizes="100vw" className={styles.wordmarkImage} />
      </Link>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { Container } from "@/components/Container";
import { NAV_LINKS } from "@/config/routes";
import { SITE } from "@/config/site";
import styles from "./Footer.module.css";

const EXTERNAL_LINKS = [
  { label: "Substack", href: SITE.substack.baseUrl },
  { label: "Notes", href: SITE.substack.notesUrl },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.brandColumn}>
            <p className={styles.brand}>{SITE.name}</p>
            <p className={styles.tagline}>{SITE.tagline}</p>
            <p className={styles.location}>{SITE.location}</p>
          </div>

          <nav className={styles.linkColumn} aria-label="Footer">
            <p className={styles.columnHeading}>Explore</p>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {EXTERNAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.linkColumn}>
            <p className={styles.columnHeading}>Say hello</p>
            <a href={`mailto:${SITE.contactEmail}`} className={styles.link}>
              {SITE.contactEmail}
            </a>
          </div>
        </div>

        <p className={styles.legal}>
          © {currentYear} {SITE.name}. Written by {SITE.authors}.
        </p>
      </Container>
    </footer>
  );
}

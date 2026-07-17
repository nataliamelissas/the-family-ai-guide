import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { NAV_LINKS, ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { classNames } from "@/lib/classNames";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link to={ROUTES.HOME} className={styles.brand}>
            {SITE.name}
          </Link>

          <nav className={styles.nav} aria-label="Main">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      classNames(styles.navLink, isActive && styles.navLinkActive)
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Button href={SITE.substack.baseUrl} className={styles.cta}>
            Subscribe
          </Button>
        </div>
      </Container>
    </header>
  );
}

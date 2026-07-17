import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { classNames } from "@/lib/classNames";
import styles from "./Section.module.css";

type SectionTone = "canvas" | "warm";
type SectionWidth = "default" | "narrow";
type SectionAlign = "start" | "center";

interface SectionProps {
  children: ReactNode;
  id?: string | undefined;
  eyebrow?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  tone?: SectionTone;
  width?: SectionWidth;
  align?: SectionAlign;
}

export function Section({
  children,
  id,
  eyebrow,
  title,
  description,
  tone = "canvas",
  width = "default",
  align = "start",
}: SectionProps) {
  const hasHeader = Boolean(eyebrow ?? title ?? description);

  return (
    <section
      id={id}
      className={classNames(
        styles.section,
        styles[tone],
        align === "center" && styles.center,
      )}
    >
      <Container width={width}>
        {hasHeader && (
          <header className={styles.header}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </header>
        )}
        <div className={styles.content}>{children}</div>
      </Container>
    </section>
  );
}

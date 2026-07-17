import { Avatar } from "@/components/Avatar";
import type { Founder } from "@/types/content";
import styles from "./FounderCard.module.css";

interface FounderCardProps {
  founder: Founder;
}

export function FounderCard({ founder }: FounderCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Avatar name={founder.name} photoUrl={founder.photoUrl} />
        <div>
          <h3 className={styles.name}>{founder.name}</h3>
          <p className={styles.role}>{founder.role}</p>
        </div>
      </div>

      <p className={styles.bio}>{founder.bio}</p>

      {founder.linkedInUrl && (
        <a
          href={founder.linkedInUrl}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
          <span aria-hidden="true"> →</span>
          <span className="visually-hidden">: {founder.name}</span>
        </a>
      )}
    </article>
  );
}

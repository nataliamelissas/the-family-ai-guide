import { Button } from "@/components/Button";
import { formatLongDate, toDateBadge } from "@/lib/date";
import type { EventItem } from "@/types/content";
import styles from "./EventCard.module.css";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const badge = toDateBadge(event.startsAt);

  return (
    <article className={styles.card}>
      <div className={styles.badge} aria-hidden="true">
        <span className={styles.badgeMonth}>{badge.month}</span>
        <span className={styles.badgeDay}>{badge.day}</span>
      </div>

      <div className={styles.body}>
        <time className={styles.date} dateTime={event.startsAt}>
          {formatLongDate(event.startsAt)}
        </time>

        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>

        {event.location && <p className={styles.location}>{event.location}</p>}

        {event.registrationUrl && (
          <Button
            href={event.registrationUrl}
            variant="secondary"
            className={styles.action}
          >
            Register
          </Button>
        )}
      </div>
    </article>
  );
}

import { EventLocation } from "@/components/EventLocation";
import { UPCOMING_EVENT } from "@/content/events";
import { formatMonthDay } from "@/lib/date";
import styles from "./EventBanner.module.css";

/**
 * A thin announcement strip under the header, on every page. Renders only
 * while there is an upcoming event that is actually taking RSVPs.
 */
export function EventBanner() {
  const event = UPCOMING_EVENT;
  if (!event?.registrationUrl) {
    return null;
  }

  return (
    <aside className={styles.banner} aria-label="Upcoming event">
      <p className={styles.message}>
        <span className={styles.date}>{formatMonthDay(event.startsAt)}</span>
        <span className={styles.blurb}>
          {event.title}
          {event.location && (
            <>
              {" · "}
              <EventLocation
                event={event}
                link={false}
                className={styles.location}
              />
            </>
          )}
        </span>
        <a
          className={styles.action}
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          RSVP<span aria-hidden="true"> →</span>
        </a>
      </p>
    </aside>
  );
}

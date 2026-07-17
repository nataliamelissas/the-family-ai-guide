import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { EventLocation } from "@/components/EventLocation";
import { UPCOMING_EVENT } from "@/content/events";
import { formatLongDate } from "@/lib/date";
import styles from "./RsvpDialog.module.css";

/** Keyed by event id so a future event gets a fresh invitation. */
const DISMISSED_KEY_PREFIX = "tfag:rsvp-dismissed:";

/** Long enough that the page settles first, short enough to still be seen. */
const OPEN_DELAY_MS = 1200;

function dismissedKey(eventId: string): string {
  return `${DISMISSED_KEY_PREFIX}${eventId}`;
}

/**
 * Storage throws in private-mode Safari and when cookies are blocked. A reader
 * we can't remember should see the invitation, never a crashed page.
 */
function wasDismissed(eventId: string): boolean {
  try {
    return window.localStorage.getItem(dismissedKey(eventId)) !== null;
  } catch {
    return false;
  }
}

function rememberDismissal(eventId: string): void {
  try {
    window.localStorage.setItem(
      dismissedKey(eventId),
      new Date().toISOString(),
    );
  } catch {
    // Dismissal won't persist; closing the dialog still works.
  }
}

/**
 * A soft invitation to RSVP, shown once per visitor per event. Uses a native
 * <dialog> so focus trapping, Esc-to-close, and background inerting come from
 * the platform rather than a library.
 */
export function RsvpDialog() {
  const event = UPCOMING_EVENT;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const eventId = event?.id ?? null;
  const canPrompt = Boolean(eventId && event?.registrationUrl);

  useEffect(() => {
    if (!eventId || !canPrompt || wasDismissed(eventId)) {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [eventId, canPrompt]);

  useEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  if (!event?.registrationUrl) {
    return null;
  }

  function close() {
    if (eventId) {
      rememberDismissal(eventId);
    }
    dialogRef.current?.close();
    setIsOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="rsvp-dialog-title"
      onCancel={(cancelEvent) => {
        cancelEvent.preventDefault();
        close();
      }}
    >
      <div className={styles.body}>
        <p className={styles.eyebrow}>You're invited</p>
        <h2 id="rsvp-dialog-title" className={styles.title}>
          {event.title}
        </h2>

        <p className={styles.details}>
          {formatLongDate(event.startsAt)}
          {event.location && (
            <>
              <br />
              <EventLocation event={event} className={styles.location} />
            </>
          )}
        </p>

        <p className={styles.description}>{event.description}</p>

        <div className={styles.actions}>
          <Button
            href={event.registrationUrl}
            onClick={close}
            className={styles.rsvp}
          >
            RSVP for the panel
          </Button>
          <button type="button" className={styles.dismiss} onClick={close}>
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}

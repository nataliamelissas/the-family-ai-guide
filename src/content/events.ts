import { findUpcomingEvent } from "@/lib/events";
import type { EventItem } from "@/types/content";

export const EVENTS: ReadonlyArray<EventItem> = [
  {
    id: "panel-ai-education-health-privacy-2026",
    title: "Panel: AI at the Intersection of Education, Health & Privacy",
    description:
      "Join us for a conversation about what AI means for kids across the places it touches them most: the classroom, their wellbeing, and their privacy.",
    startsAt: "2026-09-11",
    location: "TaliTech, Bountiful, Utah",
    locationUrl: "https://maps.app.goo.gl/qckcR65XtBum3TcH7",
    registrationUrl: "https://form.jotform.com/261970356818164",
  },
];

/**
 * The event the site actively promotes. The top banner and the RSVP dialog
 * both read from this, so the registration link lives in exactly one place and
 * a passed event stops being advertised everywhere at once.
 */
export const UPCOMING_EVENT = findUpcomingEvent(EVENTS, new Date());

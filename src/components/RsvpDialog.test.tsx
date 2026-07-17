import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RsvpDialog } from "@/components/RsvpDialog";
import { UPCOMING_EVENT } from "@/content/events";

/** Comfortably past the dialog's open delay. */
const AFTER_DELAY_MS = 2000;

/** Renders as if a visitor landed on a page and waited out the open delay. */
function visit() {
  render(
    <MemoryRouter>
      <RsvpDialog />
    </MemoryRouter>,
  );

  act(() => {
    vi.advanceTimersByTime(AFTER_DELAY_MS);
  });
}

function revisit() {
  cleanup();
  visit();
}

function dialog() {
  return screen.getByRole("dialog", { hidden: true });
}

describe("RsvpDialog", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invites a first-time visitor to RSVP at the event's registration link", () => {
    visit();

    expect(dialog()).toBeVisible();
    expect(screen.getByRole("link", { name: /RSVP/ })).toHaveAttribute(
      "href",
      UPCOMING_EVENT?.registrationUrl,
    );
  });

  it("stays closed on a later visit once dismissed", () => {
    visit();

    fireEvent.click(screen.getByRole("button", { name: "Maybe later" }));
    expect(dialog()).not.toBeVisible();

    revisit();

    expect(dialog()).not.toBeVisible();
  });

  it("stays closed on a later visit once the visitor follows the RSVP link", () => {
    visit();

    fireEvent.click(screen.getByRole("link", { name: /RSVP/ }));
    revisit();

    expect(dialog()).not.toBeVisible();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { EventCard } from "@/components/EventCard";
import type { EventItem } from "@/types/content";

const EVENT: EventItem = {
  id: "panel-2026",
  title: "Panel: AI at the Intersection of Education, Health & Privacy",
  description: "A conversation about what AI means for our kids.",
  startsAt: "2026-09-11",
  location: null,
  registrationUrl: null,
};

function renderEvent(event: EventItem) {
  return render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>,
  );
}

describe("EventCard", () => {
  it("renders the title, description, and full date", () => {
    renderEvent(EVENT);

    expect(screen.getByText(EVENT.title)).toBeInTheDocument();
    expect(screen.getByText(EVENT.description)).toBeInTheDocument();
    expect(screen.getByText("Friday, September 11, 2026")).toBeInTheDocument();
  });

  it("renders the date badge on the correct calendar day", () => {
    renderEvent(EVENT);

    expect(screen.getByText("Sep")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("omits location and registration when they are not set", () => {
    renderEvent(EVENT);

    expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
  });

  it("renders location and registration when they are set", () => {
    renderEvent({
      ...EVENT,
      location: "Davis County, Utah",
      registrationUrl: "https://example.com/register",
    });

    expect(screen.getByText("Davis County, Utah")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "https://example.com/register",
    );
  });
});

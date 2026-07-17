import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "@/App";
import { SITE } from "@/config/site";

const HOME_HASH = "#/";
const MAIN_NAV_LABEL = "Main";

/** "Home" and "About" appear in both the header and footer navs. */
function mainNav() {
  return within(screen.getByRole("navigation", { name: MAIN_NAV_LABEL }));
}

describe("App routing", () => {
  beforeEach(() => {
    window.location.hash = HOME_HASH;
  });

  it("renders the homepage by default", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: SITE.tagline }),
    ).toBeInTheDocument();
  });

  it("navigates to the About page and back", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(mainNav().getByRole("link", { name: "About" }));
    expect(
      screen.getByRole("heading", { name: "Who we are" }),
    ).toBeInTheDocument();

    await user.click(mainNav().getByRole("link", { name: "Home" }));
    expect(
      screen.getByRole("heading", { level: 1, name: SITE.tagline }),
    ).toBeInTheDocument();
  });

  it("shows the not-found page for an unknown route", () => {
    window.location.hash = "#/does-not-exist";
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "We couldn't find that page" }),
    ).toBeInTheDocument();
  });
});

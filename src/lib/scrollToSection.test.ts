import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollToSection } from "@/lib/scrollToSection";

const SECTION_ID = "subscribe";

afterEach(() => {
  document.body.innerHTML = "";
  vi.clearAllMocks();
});

describe("scrollToSection", () => {
  it("smooth-scrolls to the section with the given id", () => {
    const section = document.createElement("section");
    section.id = SECTION_ID;
    document.body.append(section);

    scrollToSection(SECTION_ID);

    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("does nothing when the section is absent", () => {
    expect(() => scrollToSection("missing-section")).not.toThrow();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});

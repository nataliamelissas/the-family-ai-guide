/**
 * Scrolls to a section by id. Used instead of "#id" anchors because
 * HashRouter reserves the URL hash for routing.
 */
export function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

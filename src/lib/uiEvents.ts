// Tiny window-event bridge for UI state that crosses unrelated component trees
// (e.g. Navbar's full-screen menu vs. the floating BackToTop button), avoiding a
// provider just for one boolean.

const MENU_STATE_EVENT = "ultras:menu-state";

export const emitMenuState = (open: boolean) => {
  window.dispatchEvent(new CustomEvent<boolean>(MENU_STATE_EVENT, { detail: open }));
};

/** Subscribe to menu open/close. Returns an unsubscribe fn for useEffect cleanup. */
export const onMenuState = (callback: (open: boolean) => void) => {
  const handler = (e: Event) => callback((e as CustomEvent<boolean>).detail);
  window.addEventListener(MENU_STATE_EVENT, handler);
  return () => window.removeEventListener(MENU_STATE_EVENT, handler);
};

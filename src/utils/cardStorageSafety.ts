export function restoreAllWindowsToFeed(): void {
  try {
    localStorage.removeItem('quit-smoking:hidden-cards');
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

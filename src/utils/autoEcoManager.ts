export function checkAndApplyAutoEco(): void {
  // Checks battery/performance preferences if applicable
  try {
    const isEco = localStorage.getItem('quit-smoking:eco-mode') === 'true';
    if (isEco) {
      document.documentElement.classList.add('eco-mode');
    } else {
      document.documentElement.classList.remove('eco-mode');
    }
  } catch {}
}

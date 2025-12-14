// Stub haptics lib for marketing site
export function triggerHaptic(_type: string = 'light') {
  // No-op for marketing site
}

export const haptic = {
  light: () => triggerHaptic('light'),
  medium: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  trigger: (type: string = 'light') => triggerHaptic(type),
}

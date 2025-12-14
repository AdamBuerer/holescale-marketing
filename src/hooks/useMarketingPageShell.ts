// Stub for marketing page shell hook
export interface PageShellOptions {
  width?: 'narrow' | 'normal' | 'wide' | 'full'
  disableBottomPadding?: boolean
  className?: string
}

export function useMarketingPageShell(_options?: Partial<PageShellOptions>) {
  return {
    pageShellProps: {
      width: 'wide' as const,
      disableBottomPadding: true,
      className: 'space-y-10',
    }
  }
}

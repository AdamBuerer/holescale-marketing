import React from 'react'

export interface PageShellProps {
  children: React.ReactNode
  showNavigation?: boolean
  showFooter?: boolean
}

export function PageShell({ children }: PageShellProps) {
  return <>{children}</>
}

export default PageShell

// ** React Import
import { useEffect, useRef } from 'react'

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'

const Layout = props => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props

  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)

  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'vertical' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({ ...settings, navCollapsed: true, layout: settings.lastLayout })
        isCollapsed.current = false
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  // On mobile, always treat the nav as expanded — the drawer is full-width.
  // This prevents the icon-only collapsed state from rendering on mobile
  // even for the first frame before the useEffect fires.
  const effectiveSettings = hidden
    ? { ...settings, navCollapsed: false }
    : settings

  if (effectiveSettings.layout === 'horizontal') {
    return <HorizontalLayout {...props} settings={effectiveSettings}>{children}</HorizontalLayout>
  }

  return <VerticalLayout {...props} settings={effectiveSettings}>{children}</VerticalLayout>
}

export default Layout

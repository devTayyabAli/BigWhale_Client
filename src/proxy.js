import { NextResponse } from 'next/server'
import { isMaintenanceOn, MAINTENANCE_PATH } from './configs/maintenance'

/**
 * Next.js 16 proxy (formerly middleware).
 * When maintenance mode is on, every request is rewritten to the
 * maintenance page, so no other page can be opened by anyone.
 */
export function proxy(request) {
  if (!isMaintenanceOn()) return NextResponse.next()

  const { pathname } = request.nextUrl
  if (pathname === MAINTENANCE_PATH || pathname === '/maintenance') return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = MAINTENANCE_PATH
  url.search = ''

  const response = NextResponse.rewrite(url)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Retry-After', '3600')

  return response
}

export const config = {
  // Everything except Next.js build assets and public files (images, icons, fonts).
  matcher: ['/((?!_next/static|_next/image|images/|assets/|favicon|apple-touch-icon|locales/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf)$).*)']
}

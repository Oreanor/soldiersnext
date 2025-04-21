import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (url.pathname.startsWith('/admin')) {
    if (!basicAuth) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    const authValue = basicAuth.split(' ')[1]
    const [, pwd] = atob(authValue).split(':')

    const validPassword = process.env.ADMIN_PASSWORD
    if (!validPassword || pwd !== validPassword) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 
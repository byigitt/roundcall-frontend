import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth pages - redirect to dashboard if authenticated
const authPages = ['/signin', '/signup', '/reset-password']
// Protected pages - redirect to signin if not authenticated
const protectedPages = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Check if trying to access auth pages while authenticated
  if (authPages.some(page => pathname.startsWith(page))) {
    if (token && refreshToken) {
      return NextResponse.redirect(new URL('/dashboard/', request.url))
    }
    return NextResponse.next()
  }

  // Check if trying to access protected pages while not authenticated
  if (protectedPages.some(page => pathname.startsWith(page))) {
    if (!token && !refreshToken) {
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('token')
      response.cookies.delete('refreshToken')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/reset-password',
    '/dashboard/:path*'
  ]
} 
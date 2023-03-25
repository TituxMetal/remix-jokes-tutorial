import type { Request } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import * as argon from 'argon2'

import { prisma } from '~/lib'

type LoginForm = {
  username: string
  password: string
}

export const login = async ({ username, password }: LoginForm) => {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return null
  }

  const passwordMatches = await argon.verify(user.hash, password)

  if (!passwordMatches) {
    return null
  }

  return { id: user.id, username }
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in env variables.')
}

const TEN_DAYS = 60 * 60 * 24 * 10

const storage = createCookieSessionStorage({
  cookie: {
    name: 'rmx_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: TEN_DAYS
  }
})

export const register = async ({ username, password }: LoginForm) => {
  const passwordHash = await argon.hash(password)
  const user = await prisma.user.create({
    data: { username, hash: passwordHash }
  })

  return { id: user.id, username: user.username }
}

const getUserSession = async (request: Request) =>
  storage.getSession(request.headers.get('Cookie'))

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    return null
  }

  return userId
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])

    throw redirect(`/login?${searchParams}`)
  }

  return userId
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)

  return redirect('/login', {
    headers: { 'Set-Cookie': await storage.destroySession(session) }
  })
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request)

  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    })

    return user
  } catch (error) {
    throw logout(request)
  }
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()

  session.set('userId', userId)

  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await storage.commitSession(session) }
  })
}

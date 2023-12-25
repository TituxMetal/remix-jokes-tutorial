import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from '@remix-run/react'
import type { ReactNode } from 'react'

import globalLargeStylesUrl from '~/styles/global-large.css'
import globalMediumStylesUrl from '~/styles/global-medium.css'
import globalStylesUrl from '~/styles/global.css'
import tailwind from '~/styles/tailwind.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: tailwind
    },
    {
      rel: 'stylesheet',
      href: globalStylesUrl
    },
    {
      rel: 'stylesheet',
      href: globalMediumStylesUrl,
      media: 'print, (min-width: 640px)'
    },
    {
      rel: 'stylesheet',
      href: globalLargeStylesUrl,
      media: 'screen and (min-width: 1024px)'
    }
  ]
}

export const meta: MetaFunction = () => {
  const description = `Learn Remix and laugh at the same time!`

  return [
    { name: 'charset', content: 'utf-8' },
    { name: 'description', content: description },
    { name: 'keywords', content: 'Remix,jokes' },
    {
      name: 'twitter:image',
      content: 'https://remix-jokes-tutorial-omega.vercel.app//social.png'
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: '@lgdweb' },
    {
      name: 'twitter:site',
      content: 'https://remix-jokes-tutorial-omega.vercel.app'
    },
    { name: 'twitter:title', content: 'Remix Jokes' },
    { name: 'twitter:description', content: description },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' }
  ]
}

const Document = ({
  children,
  title = `Remix: So great, it's funny!`
}: {
  children: ReactNode
  title?: string
}) => {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  )
}

const App = () => {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <div className='error-container'>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>Somethings went wrong!</p>
        </div>
      </Document>
    )
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  return (
    <Document title='Uh-oh!'>
      <div className='error-container'>
        <h1>App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  )
}

export default App

import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
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

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1'
})

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
        <LiveReload />
      </body>
    </html>
  )
}

const App = () => {
  return (
    <Document>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </Document>
  )
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <Document title='Uh-oh!'>
      <div className='error-container'>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}

export default App

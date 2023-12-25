import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

import stylesUrl from '~/styles/index.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const meta: MetaFunction = () => [
  { title: `Remix: so great, it's fun!` },
  { name: 'description', content: `Learn Remix and laugh at the same time!` }
]

const IndexRoute = () => {
  return (
    <div className='container'>
      <div className='content'>
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link prefetch='intent' to='jokes'>
                Read Jokes
              </Link>
            </li>
            <li>
              <Link target='_blank' reloadDocument to='/jokes.rss'>
                Rss Feed
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default IndexRoute

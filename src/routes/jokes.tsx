import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'

import { prisma } from '~/lib'
import stylesUrl from '~/styles/jokes.css'
import { getUser } from '~/utils'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader = async ({ request }: LoaderArgs) => {
  const jokes = await prisma.joke.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true }
  })
  const user = await getUser(request)

  return json({ jokeListItems: jokes, user })
}

const JokesRoute = () => {
  const { jokeListItems, user } = useLoaderData<typeof loader>()

  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link
              prefetch='intent'
              to='/'
              title='Remix Jokes'
              aria-label='Remix Jokes'
            >
              <span className='logo'>🤪</span>
              <span className='logo-medium'>J🤪KES</span>
            </Link>
          </h1>
          {user ? (
            <div className='user-info'>
              <span>{`Hi ${user.username}`}</span>
              <Form action='/logout' method='post'>
                <button type='submit' className='button'>
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link prefetch='intent' to='/login' className='button'>
              Login
            </Link>
          )}
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <Link prefetch='intent' to='.'>
              Get a random joke
            </Link>
            <p className='py-2'>Here are a few more jokes to check out:</p>
            <ul className='px-2'>
              {jokeListItems.map(joke => (
                <li key={joke.id}>
                  <Link prefetch='intent' to={joke.id}>
                    {joke.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className='py-2'>
              <Link target='_blank' reloadDocument to='/jokes.rss'>
                Rss Feed
              </Link>
            </p>
            <Link prefetch='intent' to='new' className='button'>
              Add your own
            </Link>
          </div>
          <div className='jokes-outlet'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default JokesRoute

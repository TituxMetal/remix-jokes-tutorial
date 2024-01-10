import { json } from '@remix-run/node'
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react'

import { prisma } from '~/lib'

export const loader = async () => {
  const count = await prisma.joke.count()
  const randomRowNumber = Math.floor(Math.random() * count)
  const [randomJoke] = await prisma.joke.findMany({
    take: 1,
    skip: randomRowNumber
  })

  if (!randomJoke) {
    throw new Response('No random joke found!', { status: 404 })
  }

  return json({ randomJoke })
}

const JokesIndexRoute = () => {
  const { randomJoke } = useLoaderData<typeof loader>()

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{randomJoke.content}</p>
      <Link prefetch='intent' to={randomJoke.id}>
        "{randomJoke.name}" Permalink
      </Link>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className='error-container'>
        <p>There are no jokes to display.</p>
        <Link to='new'>Create your own.</Link>
      </div>
    )
  }

  return <div className='error-container'>I did a whoopsies!</div>
}

export default JokesIndexRoute

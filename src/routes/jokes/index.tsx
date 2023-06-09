import { Response, json } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'

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

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div className='error-container'>There are no jokes to display.</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export const ErrorBoundary = () => {
  return <div className='error-container'>I did a whoopsies!</div>
}

export default JokesIndexRoute

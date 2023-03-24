import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { prisma } from '~/lib'

export const loader = async () => {
  const count = await prisma.joke.count()
  const randomRowNumber = Math.floor(Math.random() * count)
  const [randomJoke] = await prisma.joke.findMany({
    take: 1,
    skip: randomRowNumber
  })

  return json({ randomJoke })
}

const JokesIndexRoute = () => {
  const { randomJoke } = useLoaderData<typeof loader>()

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{randomJoke.content}</p>
      <Link to={randomJoke.id}>"{randomJoke.name}" Permalink</Link>
    </div>
  )
}

export default JokesIndexRoute

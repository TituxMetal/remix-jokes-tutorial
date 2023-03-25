import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useParams } from '@remix-run/react'

import { prisma } from '~/lib'

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await prisma.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) {
    throw new Error('Joke not found')
  }

  return json({ joke })
}

const JokeRoute = () => {
  const { joke } = useLoaderData<typeof loader>()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to='.'>{joke.name} Permalink</Link>
    </div>
  )
}

export const ErrorBoundary = () => {
  const { jokeId } = useParams()

  return (
    <div className='error-container'>
      {`There was an error loading joke by the id ${jokeId}. Sorry!`}
    </div>
  )
}

export default JokeRoute

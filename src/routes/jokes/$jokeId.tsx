import type { LoaderArgs } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react'

import { prisma } from '~/lib'

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await prisma.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) {
    throw new Response('What a Joke! Not found.', { status: 404 })
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

export const CatchBoundary = () => {
  const caught = useCatch()
  const params = useParams()

  if (caught.status === 404) {
    return (
      <div className='error-container'>
        Huh? What the heck is "{params.jokeId}"
      </div>
    )
  }

  throw new Error(`Unhandled error: ${caught.status}`)
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

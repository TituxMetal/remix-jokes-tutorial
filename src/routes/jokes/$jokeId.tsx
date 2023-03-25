import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react'

import { prisma } from '~/lib'
import { getUserId, requireUserId } from '~/utils'

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData()

  if (form.get('intent') !== 'delete') {
    throw new Response(`The intent ${form.get('intent')} is not supported.`, {
      status: 400
    })
  }

  const userId = await requireUserId(request)
  const joke = await prisma.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) {
    throw new Response(`Can't delete what does not exist!`, { status: 404 })
  }

  if (joke.jokesterId !== userId) {
    throw new Response(`Pssh, nice try. That's not your joke!`, { status: 403 })
  }

  await prisma.joke.delete({ where: { id: params.jokeId } })

  redirect('/jokes')
}

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request)
  const joke = await prisma.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) {
    throw new Response('What a Joke! Not found.', { status: 404 })
  }

  return json({ joke, isOwner: userId === joke.jokesterId })
}

const JokeRoute = () => {
  const { joke, isOwner } = useLoaderData<typeof loader>()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to='.'>{joke.name} Permalink</Link>
      {isOwner && (
        <form method='post'>
          <button type='submit' className='button' name='intent' value='delete'>
            Delete
          </button>
        </form>
      )}
    </div>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()
  const params = useParams()

  switch (caught.status) {
    case 400: {
      return (
        <div className='error-container'>
          What you're trying to do is not allowed!
        </div>
      )
    }
    case 403: {
      return (
        <div className='error-container'>
          Sorry, but "{params.jokeId}" is not your joke.
        </div>
      )
    }
    case 404: {
      return (
        <div className='error-container'>
          Huh? What the heck is "{params.jokeId}"
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
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

import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/node'
import { isRouteErrorResponse, useLoaderData, useParams, useRouteError } from '@remix-run/react'

import { JokeDisplay } from '~/component'
import { prisma } from '~/lib'
import { getUserId, requireUserId } from '~/utils'

export const action = async ({ params, request }: ActionFunctionArgs) => {
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

  return redirect('/jokes')
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const joke = await prisma.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) {
    throw new Response('What a Joke! Not found.', { status: 404 })
  }

  return json({ joke, isOwner: userId === joke.jokesterId })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ name: 'description', content: 'No joke found' }, { title: 'No joke' }]
  }

  return [
    {
      name: 'description',
      content: `Enjoy the "${data.joke.name}" joke and much more`
    },
    { title: `"${data.joke.name}" joke` }
  ]
}

const JokeRoute = () => {
  const { joke, isOwner } = useLoaderData<typeof loader>()

  return <JokeDisplay isOwner={isOwner} joke={joke} />
}

export const ErrorBoundary = () => {
  const { jokeId } = useParams()
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 400: {
        return <div className='error-container'>What you're trying to do is not allowed!</div>
      }
      case 403: {
        return <div className='error-container'>Sorry, but "{jokeId}" is not your joke.</div>
      }
      case 404: {
        return <div className='error-container'>Huh? What the heck is "{jokeId}"</div>
      }
      default: {
        throw new Error(`Unhandled error: ${error.status}`)
      }
    }
  }

  return (
    <div className='error-container'>
      {`There was an error loading joke by the id ${jokeId}. Sorry!`}
    </div>
  )
}

export default JokeRoute

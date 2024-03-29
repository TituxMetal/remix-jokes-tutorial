import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useNavigation,
  useRouteError
} from '@remix-run/react'

import { JokeDisplay } from '~/component'
import { prisma } from '~/lib'
import { badRequest, getUserId, requireUserId } from '~/utils'

const validateJokeContent = (content: string) => {
  if (content.length < 10) {
    return `That joke is too short`
  }
}

const validatJokeName = (name: string) => {
  if (name.length < 3) {
    return `That joke's name is too short`
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const form = await request.formData()
  const name = form.get('name')
  const content = form.get('content')

  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`
    })
  }

  const fieldErrors = {
    name: validatJokeName(name),
    content: validateJokeContent(content)
  }

  const fields = { name, content }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null
    })
  }

  const joke = await prisma.joke.create({
    data: { ...fields, jokesterId: userId }
  })

  return redirect(`/jokes/${joke.id}`)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)

  if (!userId) {
    throw new Response('Unauthorized!', { status: 401 })
  }

  return json({})
}

const NewJokeRoute = () => {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  if (navigation.formData) {
    const name = navigation.formData.get('name')
    const content = navigation.formData.get('content')

    if (
      typeof name === 'string' &&
      typeof content === 'string' &&
      !validateJokeContent(content) &&
      !validatJokeName(name)
    ) {
      return <JokeDisplay joke={{ name, content }} isOwner={true} canDelete={false} />
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method='post'>
        <div>
          <label>
            Name:{' '}
            <input
              type='text'
              defaultValue={actionData?.fields?.name}
              name='name'
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={actionData?.fieldErrors?.name ? 'name-error' : undefined}
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className='form-validation-error' role='alert' id='name-error'>
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              defaultValue={actionData?.fields?.content}
              name='content'
              aria-invalid={Boolean(actionData?.fieldErrors?.content) || undefined}
              aria-errormessage={actionData?.fieldErrors?.content ? 'content-error' : undefined}
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p className='form-validation-error' role='alert' id='content-error'>
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className='form-validation-error' role='alert'>
              {actionData.formError}
            </p>
          ) : null}
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </Form>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className='error-container'>
        <p>You must be logged in to create a joke.</p>
        <Link to='/login'>Login</Link>
      </div>
    )
  }

  return <div className='error-container'>Something unexpected went wrong. Sorry about that!</div>
}

export default NewJokeRoute

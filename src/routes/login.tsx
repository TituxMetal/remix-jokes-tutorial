import type { ActionArgs, LinksFunction } from '@remix-run/node'
import { Link, useActionData, useSearchParams } from '@remix-run/react'

import { prisma } from '~/lib'
import stylesUrl from '~/styles/login.css'
import { badRequest, createUserSession, login } from '~/utils'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl }
]

const validateUsername = (username: string) => {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long`
  }
}

const validatePassword = (password: string) => {
  if (typeof password !== 'string' || password.length < 6) {
    return `Password must be at least 6 characters long`
  }
}

const validateUrl = (url: string) => {
  const urls = ['/jokes', '/']

  if (urls.includes(url)) {
    return url
  }

  return '/jokes'
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const loginType = form.get('loginType')
  const username = form.get('username')
  const password = form.get('password')
  const redirectTo = validateUrl(form.get('redirectTo') || '/jokes')

  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { loginType, username, password }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null })
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password })

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Bad credentials`
        })
      }

      return createUserSession(user.id, redirectTo)
    }
    case 'register': {
      const userExists = await prisma.user.findFirst({ where: { username } })
      console.log('userExists', userExists)

      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Bad credentials.`
        })
      }

      return badRequest({
        fieldErrors: null,
        fields,
        formError: 'Not implemented'
      })
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: 'Login type invalid.'
      })
    }
  }
}

const LoginRoute = () => {
  const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()

  return (
    <div className='container'>
      <section className='content' data-light=''>
        <h1>Login</h1>
        <form method='post'>
          <input
            type='hidden'
            name='redirectTo'
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <fieldset>
            <legend className='sr-only'>Login or Register?</legend>
            <label>
              <input
                type='radio'
                name='loginType'
                value='login'
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input
                type='radio'
                name='loginType'
                value='register'
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor='username-input'>Username</label>
            <input
              type='text'
              id='username-input'
              name='username'
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className='form-validation-error'
                role='alert'
                id='username-error'
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor='password-input'>Password</label>
            <input
              type='password'
              id='password-input'
              name='password'
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className='form-validation-error'
                role='alert'
                id='password-error'
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id='form-error-message'>
            {actionData?.formError ? (
              <p className='form-validation-error' role='alert'>
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type='submit' className='button'>
            Submit
          </button>
        </form>
      </section>
      <div className='links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/jokes'>Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LoginRoute

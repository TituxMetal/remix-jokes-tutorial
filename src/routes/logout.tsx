import { type ActionArgs, redirect } from '@remix-run/node'

import { logout } from '~/utils'

export const action = async ({ request }: ActionArgs) => {
  return logout(request)
}

export const loader = async () => {
  return redirect('/')
}

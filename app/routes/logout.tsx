import { redirect, type ActionFunctionArgs } from '@remix-run/node'

import { logout } from '~/utils'

export const action = async ({ request }: ActionFunctionArgs) => {
  return logout(request)
}

export const loader = async () => {
  return redirect('/')
}

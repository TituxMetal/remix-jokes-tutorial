import { Outlet } from '@remix-run/react'

import Heading from '~/component/Heading'

const JokesRoute = () => {
  return (
    <div>
      <Heading>Jokes</Heading>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default JokesRoute

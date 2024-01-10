import { type Joke } from '@prisma/client'
import { Form, Link } from '@remix-run/react'
import { type FC } from 'react'

interface JokeDisplayProps {
  isOwner: boolean
  joke: Pick<Joke, 'content' | 'name'>
  canDelete?: boolean
}

const JokeDisplay: FC<JokeDisplayProps> = ({ isOwner, joke, canDelete = true }) => {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link prefetch='intent' to='.'>
        {joke.name} Permalink
      </Link>
      {isOwner && (
        <Form method='post'>
          <button
            type='submit'
            disabled={!canDelete}
            className='button'
            name='intent'
            value='delete'
          >
            Delete
          </button>
        </Form>
      )}
    </div>
  )
}

export default JokeDisplay

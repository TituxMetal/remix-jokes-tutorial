import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const getJokes = () => {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: 'Road worker',
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`
    },
    {
      name: 'Frisbee',
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`
    },
    {
      name: 'Trees',
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`
    },
    {
      name: 'Skeletons',
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`
    },
    {
      name: 'Hippos',
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`
    },
    {
      name: 'Dinner',
      content: `What did one plate say to the other plate? Dinner is on me!`
    },
    {
      name: 'Elevator',
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`
    }
  ]
}

const resetJokesDb = async () =>
  db.joke
    .deleteMany()
    .then(({ count }) => console.log(`succefully deleted jokes: ${count}`))

const resetUserDb = async () =>
  db.user
    .deleteMany()
    .then(({ count }) => console.log(`succefully deleted users: ${count}`))

const seed = async () => {
  await Promise.all([resetJokesDb(), resetUserDb()])

  const kody = await db.user.create({
    data: {
      username: 'kody',
      // this is a hashed version of "twixrox"
      hash: '$argon2id$v=19$m=65536,t=3,p=4$pKBqHTyT6X+RwTPtyMwlMA$Gpgr43OM1lSzdTv7zQnH+5yQWn6xOSM/KGYYwV0QcPs'
    }
  })

  console.log(`User created ${kody.username}`)

  await Promise.all(
    getJokes().map(jokeData =>
      db.joke
        .create({ data: { jokesterId: kody.id, ...jokeData } })
        .then(data => console.log(data.name))
    )
  )
}

seed()

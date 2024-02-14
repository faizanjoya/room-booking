import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
          viewCount: 42,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
          viewCount: 128,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
]

const customerData: Prisma.CustomerCreateInput[] = [
  {
    name: 'Nilu',
    email: 'test@.com',
    phone: '1234567890',
  },
  {
    name: 'John',
    email: 'john@example.com',
    phone: '9876543210',
  },
  {
    name: 'Emma',
    email: 'emma@example.com',
    phone: '5555555555',
  },
]

async function main() {
  console.log(`Start seeding ...`)

  try {
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u,
      })
      console.log(`Created user with id: ${user.id}`)
    }
  } catch (error) {
    console.error(error)
    console.error('Error creating users')
  }

  try {
    const createdCustomers = await prisma.customer.createMany({
      data: customerData,
    })
    console.log(`Created ${createdCustomers.count} customers`)
  } catch (error) {
    console.error(error)
    console.error('Error creating customers')
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    console.error('Error seeding the database')
    await prisma.$disconnect()
    process.exit(1)
  })
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const customerData: Prisma.CustomerCreateInput[] = [
  {
    name: 'Nilu',
    email: 'nilu@example.com',
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

const roomData: Prisma.RoomCreateInput[] = [
  {
    title: 'Single bed deluxe',
    description: 'Perfect for solo adventurers.',
    number: 101,
    type: 'SINGLE',
    sleeps: 1,
    cost: 100,
  },
  {
    title: 'Double bed luxury',
    description: 'Leonardo DiCaprio stayed here once. Comes with a nice view of the city and a balcony.',
    number: 102,
    type: 'DOUBLE',
    sleeps: 2,
    cost: 200,
  },
  {
    title: 'Family suite',
    description: 'Comes with a nice view of the city and a kitchenette. Perfect for families with kids.',
    number: 103,
    type: 'FAMILY',
    sleeps: 4,
    cost: 400,
  },

]

async function main() {
  console.log(`Start seeding ...`)

  try {
    const createdCustomers = await prisma.customer.createMany({
      data: customerData,
    })
    console.log(`Created ${createdCustomers.count} customers`)
  } catch (error) {
    console.error(error)
    console.error('Error creating customers')
  }

  try {
    const createdRooms = await prisma.room.createMany({
      data: roomData,
    })
    console.log(`Created ${createdRooms.count} rooms`)
  } catch (error) {
    console.error(error)
    console.error('Error creating rooms')
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    console.error('Error seeding the database')
    await prisma.$disconnect()
    process.exit(1)
  })
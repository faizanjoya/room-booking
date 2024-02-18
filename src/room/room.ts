import 'reflect-metadata'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Booking } from '../booking/booking'

@ObjectType()
export class Room {
  @Field((type) => Int)
  id: number

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date

  @Field()
  title: string

  @Field((type) => String, { nullable: true })
  description?: string | null

  @Field((type) => Int)
  number: number

  @Field((type) => String)
  type: string

  @Field((type) => Int)
  sleeps: number

  @Field((type) => Int)
  cost: number

  @Field((type) => [Booking], { nullable: true })
  bookings?: Booking[] | null
}

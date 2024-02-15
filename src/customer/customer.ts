import 'reflect-metadata'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Booking } from '../booking/booking'

@ObjectType()
export class Customer {
  @Field((type) => Int)
  id: number

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date

  @Field()
  email: string

  @Field()
  name: string

  @Field((type) => String, { nullable: true })
  phone?: string | null

  @Field((type) => [Booking], { nullable: true })
  bookings?: Booking[] | null
}

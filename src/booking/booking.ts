import 'reflect-metadata'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Room } from '../room/room'
import { Customer } from '../customer/customer'

@ObjectType()
export class Booking {
  @Field((type) => Int)
  id: number

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date

  @Field((type) => Date)
  checkIn: Date

  @Field((type) => Date)
  checkOut: Date

  @Field((type) => Boolean, { nullable: true })
  paid?: boolean | null

  @Field((type) => Room, { nullable: true })
  room?: Room | null

  @Field((type) => Customer, { nullable: true })
  customer?: Customer | null
}

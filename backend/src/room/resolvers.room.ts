import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Root,
  InputType,
  Field,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Booking } from '../booking/booking';
import { Room } from './room';
import { PrismaService } from '../prisma.service';
import { RoomType } from '@prisma/client';
import { BOOKING_END_HOUR_UTC, BOOKING_START_HOUR_UTC } from 'src/const';

@InputType()
class RoomCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  number: number;

  @Field()
  type: string;

  @Field()
  sleeps: number;

  @Field()
  cost: number;
}

@Resolver(Room)
export class RoomResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  @ResolveField()
  async bookings(@Root() room: Room, @Context() ctx): Promise<Booking[]> {
    return this.prismaService.room
      .findUnique({
        where: {
          id: room.id,
        },
      })
      .bookings();
  }

  @Mutation((returns) => Room)
  async createRoom(
    @Args('data') data: RoomCreateInput,
    @Context() ctx,
  ): Promise<Room> {

    if (data.number <= 0) {
      throw new Error('Room number must be greater than 0');
    }

    return this.prismaService.room.create({
      data: {
        title: data.title,
        description: data.description,
        number: data.number,
        type: data.type as RoomType,
        sleeps: data.sleeps,
        cost: data.cost,
      },
    });

  }

  @Query((returns) => [Room], { nullable: true })
  async allRooms(@Context() ctx) {
    return this.prismaService.room.findMany();
  }

  @Query((returns) => [Room])
  async availableRooms(
    @Args('checkIn') checkIn: Date,
    @Args('checkOut') checkOut: Date,
    @Context() ctx,
  ) {

    if (checkIn >= checkOut) {
      throw new Error('Check-in Date must be before check-out Date');
    }

    checkIn.setUTCHours(BOOKING_START_HOUR_UTC, 0, 0, 0);
    checkOut.setUTCHours(BOOKING_END_HOUR_UTC, 0, 0, 0);

    try {
      return await this.prismaService.room.findMany({
        where: {
          bookings: {
            every: {
              OR: [
                { checkOut: { lte: checkIn } }, // Booking checkOut is before or on checkIn
                { checkIn: { gte: checkOut } }, // Booking checkIn is after or on checkOut
              ],
            },
          },
        },
      });

    } catch (error) {
      throw new Error(`Error finding available rooms. ${error.message}`);
    }
  }

  @Mutation((returns) => Room, { nullable: true })
  async deleteRoom(
    @Args('id') id: number,
    @Context() ctx,
  ): Promise<Room | null> {
    return this.prismaService.room.delete({
      where: {
        id: id,
      },
    })
  }

}

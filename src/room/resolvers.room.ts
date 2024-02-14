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
// import { BookingCreateInput } from '../booking/resolvers.booking';

@InputType()
class RoomUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  number: number;
}

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

  // @Field((type) => [BookingCreateInput], { nullable: true })
  // bookings: [BookingCreateInput];
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
    // const bookingData = data.bookings?.map((booking) => {
    //   return { /* map your Booking fields here */ };
    // });

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
        // bookings: {
        //   create: bookingData,
        // },
      },
    });

  }

  @Query((returns) => [Room], { nullable: true })
  async allRooms(@Context() ctx) {
    return this.prismaService.room.findMany();
  }

  // Additional queries or mutations can be added as needed
}

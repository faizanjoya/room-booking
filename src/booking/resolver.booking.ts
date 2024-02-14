import 'reflect-metadata';
import { Resolver, Query, Mutation, Args, ResolveField, Root, Context, Int, InputType, Field } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Booking } from './booking';
import { Room } from '../room/room';
import { Customer } from '../customer/customer';
import { PrismaService } from '../prisma.service';

@InputType()
class BookingCreateInput {
    @Field((type) => Date)
    checkIn: Date;

    @Field((type) => Date)
    checkOut: Date;

    @Field((type) => Boolean, { nullable: true })
    paid?: boolean | null;

    @Field((type) => Int)
    roomId: number;

    @Field((type) => Int)
    customerId: number;
}

@Resolver(Booking)
export class BookingResolver {
    constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

    @ResolveField()
    room(@Root() booking: Booking): Promise<Room | null> {
        return this.prismaService.booking
            .findUnique({
                where: {
                    id: booking.id,
                },
            })
            .room();
    }

    @ResolveField()
    customer(@Root() booking: Booking): Promise<Customer | null> {
        return this.prismaService.booking
            .findUnique({
                where: {
                    id: booking.id,
                },
            })
            .customer();
    }

    @Query((returns) => Booking, { nullable: true })
    bookingById(@Args('id') id: number) {
        return this.prismaService.booking.findUnique({
            where: { id },
        });
    }

    @Query((returns) => [Booking], { nullable: true })
    allBookings(@Context() ctx) {
        return this.prismaService.booking.findMany();
    }

    @Mutation((returns) => Booking)
    async createBooking(
        @Args('data') data: BookingCreateInput,
        @Context() ctx,
    ): Promise<Booking> {
        // TODO handle any validation or error cases as needed
        return this.prismaService.booking.create({
            data: {
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                paid: data.paid,
                room: {
                    connect: {
                        id: data.roomId,
                    },
                },
                customer: {
                    connect: {
                        id: data.customerId,
                    },
                },
            },
        });
    }

    @Mutation((returns) => Booking, { nullable: true })
    async deleteBooking(
        @Args('id') id: number,
        @Context() ctx,
    ): Promise<Booking | null> {
        return this.prismaService.booking.delete({
            where: {
                id: id,
            },
        })
    }

}

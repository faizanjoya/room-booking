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

        if (data.checkIn >= data.checkOut) {
            throw new Error('Check-in date must be before check-out date');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (data.checkIn < today) {
            throw new Error('Check-in date must be today or in the future');
        }

        const testData = {
            checkIn: data.checkIn,
            checkOut: data.checkOut,
        }

        console.log("test data 1", testData);


        const bookings = await this.prismaService.booking.findMany({
            where: {
                roomId: data.roomId,
                checkIn: {
                    lte: data.checkOut,
                },
                checkOut: {
                    gte: data.checkIn,
                },
            },
        });

        console.log("bookings", bookings);

        if (bookings.length > 0) {
            throw new Error('Room is already booked for the selected dates');
        }

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

    @Mutation((returns) => Booking, { nullable: true })
    async togglePaidBooking(
        @Args('id') id: number,
        @Args('isPaid') isPaid: boolean,
    ): Promise<Booking | null> {
        const booking = await this.prismaService.booking.findUnique({
            where: { id: id || undefined }
        })

        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.paid === isPaid) {
            return booking;
        }

        return this.prismaService.booking.update({
            where: { id: id || undefined },
            data: { paid: isPaid },
        })
    }

}

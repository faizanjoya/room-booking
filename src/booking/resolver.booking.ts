import 'reflect-metadata';
import { Resolver, Query, Mutation, Args, ResolveField, Root, Context, Int, InputType, Field } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Booking } from './booking';
import { Room } from '../room/room';
import { Customer } from '../customer/customer';
import { PrismaService } from '../prisma.service';
import { BOOKING_END_HOUR, BOOKING_START_HOUR } from './const';

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

        if (data.checkIn >= data.checkOut) {
            throw new Error('Check-in date must be before check-out date');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (data.checkIn < today) {
            throw new Error('Check-in date must be today or in the future');
        }

        const bookingStartAtDateTime = new Date(data.checkIn);
        const bookingEndAtDateTime = new Date(data.checkOut);

        // assumed booking Start and End time hour set in const file
        if (bookingStartAtDateTime.getHours() < BOOKING_START_HOUR) {
            throw new Error(`Booking start time should be at or after ${BOOKING_START_HOUR}:00`);
        }

        if (bookingEndAtDateTime.getHours() > BOOKING_END_HOUR) {
            throw new Error(`Booking end time should be at or ealier than ${BOOKING_START_HOUR}:00`);
        }

        // Assumption minutes, seconds and milliseconds are 0 always
        bookingStartAtDateTime.setHours(BOOKING_START_HOUR, 0, 0, 0)
        bookingEndAtDateTime.setHours(BOOKING_END_HOUR, 0, 0, 0);

        const listExistingBookings = await this.prismaService.booking.findMany({
            where: {
                roomId: data.roomId,
                checkIn: {
                    lte: bookingEndAtDateTime,
                },
                checkOut: {
                    gte: bookingStartAtDateTime,
                },
            },
        });

        if (listExistingBookings.length > 0) {
            throw new Error('Room is already booked for the selected dates');
        }

        try {
            return await this.prismaService.booking.create({
                data: {
                    checkIn: bookingStartAtDateTime,
                    checkOut: bookingEndAtDateTime,
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
        } catch (error) {
            throw new Error(`Error creating booking. ${error.meta.cause}`);
        }
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

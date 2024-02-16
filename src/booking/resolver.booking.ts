import 'reflect-metadata';
import { Resolver, Query, Mutation, Args, ResolveField, Root, Context, Int, InputType, Field } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Booking } from './booking';
import { Room } from '../room/room';
import { Customer } from '../customer/customer';
import { PrismaService } from '../prisma.service';
import { BOOKING_END_HOUR, BOOKING_START_HOUR, NAME_MIN_LENGTH } from '../const';
import { CustomerCreateInput } from 'src/customer/resolvers.customer';
import validator from 'validator';

@InputType()
class BookingCreateInputBase {
    @Field((type) => Date)
    checkIn: Date;

    @Field((type) => Date)
    checkOut: Date;

    @Field((type) => Boolean, { nullable: true })
    paid?: boolean | null;

    @Field((type) => Int)
    roomId: number;
}

@InputType()
class BookingCreateInput extends BookingCreateInputBase {
    @Field((type) => Int)
    customerId: number;
}


@InputType()
class BookingAndCustomerCreateInput extends BookingCreateInputBase {
    @Field()
    customerCreate: CustomerCreateInput;
}


@Resolver(Booking)
export class BookingResolver {
    constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

    @ResolveField()
    async room(@Root() booking: Booking): Promise<Room | null> {
        return await this.prismaService.booking
            .findUnique({
                where: {
                    id: booking.id,
                },
            })
            .room();
    }

    @ResolveField()
    async customer(@Root() booking: Booking): Promise<Customer | null> {
        return await this.prismaService.booking
            .findUnique({
                where: {
                    id: booking.id,
                },
            })
            .customer();
    }

    @Query((returns) => Booking, { nullable: true })
    async bookingById(@Args('id') id: number): Promise<Booking | null> {
        try {
            return await this.prismaService.booking.findUnique({
                where: { id },
            });
        } catch (error) {
            throw new Error(`Error fetching booking. ${error}`);
        }
    }

    @Query((returns) => [Booking], { nullable: true })
    async allBookings(@Context() ctx): Promise<Booking[]> {
        try {
            return await this.prismaService.booking.findMany();
        } catch (error) {
            throw new Error(`Error fetching bookings. ${error}`);
        }
    }

    @Mutation((returns) => Booking)
    async createBooking(
        @Args('data') data: BookingCreateInput,
        @Context() ctx,
    ): Promise<Booking> {

        if (data.checkIn >= data.checkOut) {
            throw new Error('Check-in dateTime must be before check-out dateTime');
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

    @Mutation((returns) => Booking)
    async createBookingAndNewCustomer(
        @Args('data') data: BookingAndCustomerCreateInput,
        @Context() ctx,
    ): Promise<Booking> {
        if (data.checkIn >= data.checkOut) {
            throw new Error('Check-in dateTime must be before check-out dateTime');
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

        if (!validator.isEmail(data.customerCreate.email.trim())) {
            throw new Error(`Invalid email address: ${data.customerCreate.email}`);
        }

        if (data.customerCreate.name.trim().length < NAME_MIN_LENGTH) {
            throw new Error(`Name must be ${NAME_MIN_LENGTH} or more characters`);
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
            const result = await this.prismaService.$transaction(async (prisma) => {
                const createdCustomer = await prisma.customer.create({
                    data: {
                        email: data.customerCreate.email.trim(),
                        name: data.customerCreate.name.trim(),
                        phone: data.customerCreate.phone,

                    },
                });

                const createdBooking = await prisma.booking.create({
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
                                id: createdCustomer.id,
                            },
                        },
                    },
                });

                return { createdBooking, createdCustomer };
            });

            return result.createdBooking;
        } catch (error) {
            throw new Error(`Error creating booking. ${error.message}`);
        }
    }

    @Mutation((returns) => Booking, { nullable: true })
    async deleteBooking(
        @Args('id') id: number,
        @Context() ctx,
    ): Promise<Booking | null> {
        try {
            return await this.prismaService.booking.delete({
                where: {
                    id: id,
                },
            })
        } catch (error) {
            throw new Error(`Error deleting booking. ${error.meta.cause}`);
        }
    }

    @Mutation((returns) => Booking, { nullable: true })
    async togglePaidBooking(
        @Args('id') id: number,
        @Args('isPaid') isPaid: boolean,
        @Context() ctx,
    ): Promise<Booking | null> {
        try {
            const booking = await this.prismaService.booking.findUnique({
                where: { id: id || undefined }
            })

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.paid === isPaid) {
                return booking;
            }

            return await this.prismaService.booking.update({
                where: { id: id || undefined },
                data: { paid: isPaid },
            })
        } catch (error) {
            throw new Error(`Error updating booking. ${error}`);
        }
    }

}

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
import { Customer } from './customer';
import { PrismaService } from '../prisma.service';

@InputType()
class CustomerUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;
}

@InputType()
class CustomerCreateInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field((type) => String, { nullable: true })
  phone: string;
}

@Resolver(Customer)
export class CustomerResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  @ResolveField()
  async bookings(@Root() customer: Customer, @Context() ctx): Promise<Booking[]> {
    return await this.prismaService.customer
      .findUnique({
        where: {
          id: customer.id,
        },
      })
      .bookings();
  }

  @Mutation((returns) => Customer)
  async createCustomer(
    @Args('data') data: CustomerCreateInput,
    @Context() ctx,
  ): Promise<Customer> {
    return await this.prismaService.customer.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
      },
    });
  }

  @Query((returns) => [Customer], { nullable: true })
  async allCustomers(@Context() ctx): Promise<Customer[]> {
    return await this.prismaService.customer.findMany();
  }

  @Query((returns) => Customer, { nullable: true })
  async customerByIdOrEmail(
    @Args('customerUniqueInput') customerUniqueInput: CustomerUniqueInput,
  ): Promise<Customer> {
    return await this.prismaService.customer
      .findUnique({
        where: {
          id: customerUniqueInput.id || undefined,
          email: customerUniqueInput.email || undefined,
        },
      })
  }

  @Query((returns) => [Booking], { nullable: true })
  async unpaidBookingByCustomer(
    @Args('customerUniqueInput') customerUniqueInput: CustomerUniqueInput,
  ): Promise<Booking[]> {
    return await this.prismaService.customer
      .findUnique({
        where: {
          id: customerUniqueInput.id || undefined,
          email: customerUniqueInput.email || undefined,
        },
      })
      .bookings({
        where: {
          paid: false,
        },
      })
  }
}

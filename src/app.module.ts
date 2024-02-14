import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { PrismaService } from './prisma.service'
import { PostResolver } from './posts/resolvers.post'
import { UserResolver } from './user/resolvers.user'
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CustomerResolver } from './customer/resolvers.customer'
import { RoomResolver } from './room/resolvers.room'
import { BookingResolver } from './booking/resolver.booking'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [PrismaService, UserResolver, PostResolver, CustomerResolver, RoomResolver, BookingResolver],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';
import { BlogGateway } from './blog/blog.gateway';
import { BlogResolver } from './blog/blog.resolver';
import { BlogService } from './blog/blog.service';
import { PersistenceService } from './persistence/persistence.service';
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PersistenceService,
    UserResolver,
    UserService,
    BlogGateway,
    BlogResolver,
    BlogService,
  ],
})
export class AppModule { }

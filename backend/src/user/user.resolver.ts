import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthResponse } from './model/auth-response.model';
import { CreateAccountInput } from './dto/create-account.input';
import { LoginInput } from './dto/login.input';
import { User } from './model/user.model';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => String)
    hello(): string {
        return 'Hello from User API!';
    }

    @Query(() => [User])
    users(): User[] {
        return this.userService.getUsers();
    }

    @Mutation(() => AuthResponse)
    createAccount(
        @Args('input') input: CreateAccountInput,
    ): AuthResponse {
        return this.userService.createAccount(input);
    }

    @Mutation(() => AuthResponse)
    login(@Args('input') input: LoginInput): AuthResponse {
        return this.userService.login(input);
    }
}

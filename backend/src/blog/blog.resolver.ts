import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Blog } from './model/blog.model';
import { CreateBlogInput } from './dto/create-blog.input';
import { UserService } from '../user/user.service';
import { BlogGateway } from './blog.gateway';

@Resolver()
export class BlogResolver {
    constructor(
        private readonly blogService: BlogService,
        private readonly userService: UserService,
        private readonly blogGateway: BlogGateway,
    ) { }

    @Query(() => [Blog])
    blogs(): Blog[] {
        return this.blogService.getBlogs();
    }

    @Mutation(() => Blog)
    createBlog(@Args('input') input: CreateBlogInput): Blog {
        const blog = this.blogService.createBlog(input, this.userService);

        this.blogGateway.broadcastNewBlog(blog);

        return blog;
    }
}

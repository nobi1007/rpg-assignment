import { Injectable } from '@nestjs/common';
import { CreateBlogInput } from './dto/create-blog.input';
import { Blog } from './model/blog.model';
import { UserService } from '../user/user.service';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class BlogService {
    private blogs: Map<string, Blog> = new Map();
    private idCounter = 1;

    constructor(private readonly persistenceService: PersistenceService) {
        this.loadBlogs();
    }

    private loadBlogs() {
        const savedData = this.persistenceService.loadBlogs();
        if (savedData) {
            this.blogs = new Map(Object.entries(savedData.blogs));
            this.idCounter = savedData.idCounter || 1;
            console.log(`Loaded ${this.blogs.size} blogs from persistence`);
        }
    }

    private saveBlogs() {
        const data = {
            blogs: Object.fromEntries(this.blogs),
            idCounter: this.idCounter,
        };
        this.persistenceService.saveBlogs(data);
    }

    createBlog(input: CreateBlogInput, userService: UserService): Blog {
        const { title, content, authorId } = input;

        const users = userService.getUsers();
        const author = users.find((u) => u.id === authorId);

        if (!author) {
            throw new Error('Author not found');
        }

        const blogId = `blog_${this.idCounter++}`;
        const newBlog: Blog = {
            id: blogId,
            title,
            content,
            authorId,
            authorName: author.name,
            authorEmail: author.email,
            createdAt: new Date().toISOString(),
        };

        this.blogs.set(blogId, newBlog);
        this.saveBlogs(); // Persist to file

        return newBlog;
    }

    getBlogs(): Blog[] {
        return Array.from(this.blogs.values()).sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
}

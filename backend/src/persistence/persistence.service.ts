import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PersistenceService {
    private readonly dataDir = path.join(process.cwd(), 'data');
    private readonly usersFile = path.join(this.dataDir, 'users.json');
    private readonly blogsFile = path.join(this.dataDir, 'blogs.json');

    constructor() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    loadData<T>(filename: string): T | null {
        const filepath = path.join(this.dataDir, filename);
        try {
            if (fs.existsSync(filepath)) {
                const data = fs.readFileSync(filepath, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`Error loading data from ${filename}:`, error);
        }
        return null;
    }

    saveData<T>(filename: string, data: T): void {
        const filepath = path.join(this.dataDir, filename);
        try {
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error saving data to ${filename}:`, error);
        }
    }

    loadUsers(): any {
        return this.loadData('users.json');
    }

    saveUsers(users: any): void {
        this.saveData('users.json', users);
    }

    loadBlogs(): any {
        return this.loadData('blogs.json');
    }

    saveBlogs(blogs: any): void {
        this.saveData('blogs.json', blogs);
    }
}

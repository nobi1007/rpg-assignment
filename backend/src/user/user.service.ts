import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.input';
import { LoginInput } from './dto/login.input';
import { User } from './model/user.model';
import { AuthResponse } from './model/auth-response.model';
import { PersistenceService } from '../persistence/persistence.service';

interface StoredUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class UserService {
    private users: Map<string, StoredUser> = new Map();
    private idCounter = 1;

    constructor(private readonly persistenceService: PersistenceService) {
        this.loadUsers();
    }

    private loadUsers() {
        const savedData = this.persistenceService.loadUsers();
        if (savedData) {
            this.users = new Map(Object.entries(savedData.users));
            this.idCounter = savedData.idCounter || 1;
            console.log(`Loaded ${this.users.size} users from persistence`);
        }
    }

    private saveUsers() {
        const data = {
            users: Object.fromEntries(this.users),
            idCounter: this.idCounter,
        };
        this.persistenceService.saveUsers(data);
    }

    createAccount(input: CreateAccountInput): AuthResponse {
        const { name, email, password } = input;

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return {
                success: false,
                message: 'All fields are required',
            };
        }

        if (!email.includes('@')) {
            return {
                success: false,
                message: 'Please enter a valid email address',
            };
        }

        const existingUser = Array.from(this.users.values()).find(
            (u) => u.email === email,
        );

        if (existingUser) {
            return {
                success: false,
                message: 'An account with this email already exists',
            };
        }

        const userId = `user_${this.idCounter++}`;
        const newUser: StoredUser = {
            id: userId,
            name,
            email,
            password,
        }

        this.users.set(userId, newUser);
        this.saveUsers();


        const user: User = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };

        return {
            success: true,
            message: 'Account created successfully',
            user,
        };
    }

    login(input: LoginInput): AuthResponse {
        const { email, password } = input;


        if (!email?.trim() || !password?.trim()) {
            return {
                success: false,
                message: 'Email and password are required',
            };
        }


        const storedUser = Array.from(this.users.values()).find(
            (u) => u.email === email,
        );

        if (!storedUser) {
            return {
                success: false,
                message: 'Invalid email or password',
            };
        }


        if (storedUser.password !== password) {
            return {
                success: false,
                message: 'Invalid email or password',
            };
        }


        const user: User = {
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
        };

        return {
            success: true,
            message: 'Login successful',
            user,
        };
    }

    getUsers(): User[] {
        return Array.from(this.users.values()).map((storedUser) => ({
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
        }));
    }
}

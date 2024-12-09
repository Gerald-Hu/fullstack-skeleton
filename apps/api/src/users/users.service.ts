import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { db } from '../drizzle/client';
import { users } from '../drizzle/schema';
import type { User, NewUser } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async findOne(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async create(email: string, password: string, name?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: NewUser = {
      email,
      password: hashedPassword,
      name,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

}

import { db } from "./storage";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertUser } from "@shared/schema";

const INITIAL_USERS: InsertUser[] = [
  {
    username: "admin",
    password: "admin2233",
    fullName: "Administrator",
    role: "admin",
  },
  {
    username: "operator",
    password: "callcenter123",
    fullName: "Operator",
    role: "operator",
  },
  {
    username: "master",
    password: "MS123",
    fullName: "Master",
    role: "master",
  },
];

export async function seedUsers() {
  try {
    for (const user of INITIAL_USERS) {
      const existing = await db.select().from(users).where(eq(users.username, user.username)).limit(1);
      
      if (existing.length === 0) {
        await db.insert(users).values(user);
        console.log(`Created user: ${user.username}`);
      } else {
        console.log(`User already exists: ${user.username}`);
      }
    }
    console.log("User seeding completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

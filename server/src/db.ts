import bcrypt from "bcrypt";

type User = {
   id: string;
   username: string;
   passwordHash: string;
};

export const users: User[] = [];

// Helper to create a user
export async function createUser(username: string, password: string) {
   const existing = users.find((u) => u.username === username);
   if (existing) throw new Error("User already exists");
   const passwordHash = await bcrypt.hash(password, 10);
   const user = { id: crypto.randomUUID(), username, passwordHash };
   users.push(user);
   return user;
}

// Helper to validate login
export async function validateUser(username: string, password: string) {
   const user = users.find((u) => u.username === username);
   if (!user) return null;
   const match = await bcrypt.compare(password, user.passwordHash);
   return match ? user : null;
}

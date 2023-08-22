import { PrismaClient, User } from "@prisma/client";
import Cache from "timed-cache";


const prisma = new PrismaClient();

/**
 * Returns the prisma user object from the database based on email
 * @param email the email of the session
 * @returns 
 */
export async function getUser(email: string): Promise<User | null>  {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    return user
}

const __getUserCache: Cache<User> = new Cache({ defaultTtl: 5 * 60 * 1000 }); // 5 minutes

/**
 * Get's the user's information... caches it for
 * 5 minutes.  USE ONLY WHEN APPROPRIATE
 * @param email 
 */
export async function getCacheUser(email: string): Promise<User | null> {
    const user = __getUserCache.get(email);
    if (user === undefined) {
        const newUser = await getUser(email);
        if (newUser === null) {
            return null;
        }
        __getUserCache.put(email, newUser);
        return newUser;
    }
    return user;
}

/**
 * Result is cached for 5 minutes
 * @param user
 * @param permission 
 */
export async function hasPermission<K extends keyof User>(user: User, permission: K): Promise<User[K] | null> {
    if (user === null) {
        return null;
    }
    return user[permission];
}
import { UserSession } from "./types";

const users = new Map<string, UserSession>()

export const isUsernameTaken = (username: string) => {
    return Array.from(users.values()).some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
    )
}

export const addUser = (user: UserSession) => {

    users.set(user.socketId, user)

    console.log(`[USER] Added: ${user.username} | Total: ${users.size}`);

}

export const removeUser = (socketId: string) => {
    const user = users.get(socketId);

    users.delete(socketId)

    console.log(`[USER] Removed: ${user?.username ?? "unknown"} | Total: ${users.size}`);

}

export const getUser = (socketId: string) => {
    return users.get(socketId)
}

export const getAllUsers = () => {
    return Array.from(users.values())
}

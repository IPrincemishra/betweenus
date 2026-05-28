import { UserSession } from "./types";

const users = new Map<string, UserSession>()

export const isUsernameTaken = (username: string) => {
    return Array.from(users.values()).some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
    )
}

export const addUser = (user: UserSession) => {

    users.set(user.socketId, user)

    console.log("User added");
    console.log(users);


}

export const removeUser = (socketId: string) => {
    users.delete(socketId)

    console.log("User Removed");
    console.log(users);


}

export const getUser = (socketId: string) => {
    return users.get(socketId)
}

export const getAllUsers = () => {
    return Array.from(users.values())
}

import { Socket } from "socket.io";
import { addUser, isUsernameTaken, removeUser } from "../users/userStore";

export const registerSocketHandlers = (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("set_username", (username: string) => {

        const trimmedUsername = username.trim()

        if (!trimmedUsername) {
            socket.emit("username_error", "Username is required")
            socket.disconnect()
            return
        }

        if (isUsernameTaken(trimmedUsername)) {
            socket.emit("username_error", "Username already taken")
            socket.disconnect()
            return
        }

        addUser({
            socketId: socket.id,
            username,
            joinedAt: Date.now()
        })

        socket.emit("username_success", trimmedUsername)

        console.log(`${trimmedUsername} joined`);

    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        removeUser(socket.id)
    });
};
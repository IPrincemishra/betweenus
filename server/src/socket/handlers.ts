import { Socket } from "socket.io";
import { addUser, getUser, isUsernameTaken, removeUser } from "../users/userStore";
import { addUserToRoom, createRoom, getRoom } from "../rooms/roomStore";

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
            username: trimmedUsername,
            joinedAt: Date.now()
        })

        socket.emit("username_success", trimmedUsername)

    })

    socket.on("create_room", (roomId: string) => {
        const existingRoom = getRoom(roomId);

        if (existingRoom) {
            socket.emit(
                "room_error",
                "Room already exists"
            )
            return
        }

        createRoom(roomId)

        const joined = addUserToRoom(
            roomId,
            socket.id
        )

        if (!joined) {
            socket.emit(
                "room_error",
                "Unable to join room"
            )
            return
        }

        socket.join(roomId)

        socket.emit("room_created", roomId)

    })

    socket.on("join_room", (roomId: string) => {
        const room = getRoom(roomId)

        if (!room) {
            socket.emit("room_error", "Room not found")
            return
        }

        const joined = addUserToRoom(roomId, socket.id)
        if (!joined) {
            socket.emit("room_error", "Room Full")
            return
        }

        socket.join(roomId)

        socket.emit("room_joined", roomId)

        socket.to(roomId).emit("user_joined")


    })

    socket.on("send_message", ({ roomId, message }) => {
        const user = getUser(socket.id)
        if (!user) return

        socket.to(roomId).emit("receive_message", {
            username: user.username,
            message,
            timestamp: Date.now()
        })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        removeUser(socket.id)
    });
};
import { Socket } from "socket.io";
import { addUser, getUser, isUsernameTaken, removeUser } from "../users/userStore";
import { addUserToRoom, canJoinReservedSlot, createRoom, getRoom, removeUserFromRoom, reserveSlot } from "../rooms/roomStore";
import { generateRoomId } from "../utils/generateRoomId";
import { APP_CONFIG } from "../constants/config";
import { clearSocketLimits, isRateLimited } from "../utils/rateLimiter";

export const registerSocketHandlers = (socket: Socket) => {
    console.log("User connected: ", socket.id);

    socket.on("set_username", (username: string) => {

        const trimmedUsername = username.trim()

        if (!trimmedUsername || trimmedUsername.length > APP_CONFIG.MAX_USERNAME_LENGTH) {
            socket.emit("username_error", `Username must be between 1 and ${APP_CONFIG.MAX_USERNAME_LENGTH}`)
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

    socket.on("create_room", () => {

        const user = getUser(socket.id)

        if (!user) return

        let roomId = generateRoomId()

        while (getRoom(roomId)) {
            roomId = generateRoomId()
        }

        createRoom(roomId, user.username)

        const joined = addUserToRoom(
            roomId,
            socket.id
        )

        if (!joined) {
            socket.emit(
                "room_error",
                "Unable to create room"
            )
            return
        }

        user.roomId = roomId

        socket.join(roomId)

        socket.emit("room_created", {
            roomId,
            inviteLink: `${APP_CONFIG.DEEP_LINK_PREFIX}${roomId}`
        })

    })

    socket.on("join_room", (roomId: string) => {

        const room = getRoom(roomId)

        if (!room) {
            socket.emit("room_error", "Room not found")
            return
        }

        const user = getUser(socket.id)

        if (!user) return

        const allowed = canJoinReservedSlot(roomId, user.username)
        if (!allowed) {
            socket.emit("room_error", "Room unavailable")
            return
        }

        const joined = addUserToRoom(roomId, socket.id)
        if (!joined) {
            socket.emit("room_error", "Room Full")
            return
        }

        user.roomId = roomId

        socket.join(roomId)

        socket.emit("room_joined", roomId)

        socket.to(roomId).emit("user_online")
    })

    socket.on("send_message", ({ roomId, message }) => {
        const user = getUser(socket.id)
        if (!user) return

        const limited = isRateLimited(socket.id, "message", 500)
        if (limited) {
            socket.emit("message_error", "Too Fast")
            return
        }

        const trimmedMessage = message?.trim();

        if (!trimmedMessage || trimmedMessage.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
            socket.emit("message_error", `Message limit: ${APP_CONFIG.MAX_MESSAGE_LENGTH}`)
            return
        }

        socket.to(roomId).emit("receive_message", {
            username: user.username,
            message: trimmedMessage,
            timestamp: Date.now()
        })
    })

    socket.on("typing_start", (roomId: string) => {

        const limited = isRateLimited(socket.id, "typing", 300)
        if (limited) return

        socket.to(roomId).emit(
            "typing_start"
        )
    })

    socket.on("typing_stop", (roomId: string) => {
        socket.to(roomId).emit(
            "typing_stop"
        )
    })

    socket.on("disconnecting", () => {

        const user = getUser(socket.id)

        if (user?.roomId) {
            reserveSlot(user.roomId, user.username)
            removeUserFromRoom(user.roomId, socket.id)

            socket.to(user.roomId).emit("user_offline")
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)

        clearSocketLimits(socket.id)

        console.log("User disconnected:", socket.id);
    });
};
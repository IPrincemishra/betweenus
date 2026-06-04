import { Socket } from "socket.io";
import { addUser, getUser, isUsernameTaken, removeUser } from "../users/userStore";
import { addUserToRoom, canJoinReservedSlot, createRoom, getRoom, removeUserFromRoom, reserveSlot } from "../rooms/roomStore";
import { generateRoomId } from "../utils/generateRoomId";
import { APP_CONFIG } from "../constants/config";
import { clearSocketLimits, isRateLimited } from "../utils/rateLimiter";
import { SOCKET_EVENTS } from "../constants/events";

export const registerSocketHandlers = (socket: Socket) => {
    console.log(`[SOCKET] Connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.SET_USERNAME, (username: string) => {

        const trimmedUsername = username.trim()

        if (!trimmedUsername || trimmedUsername.length > APP_CONFIG.MAX_USERNAME_LENGTH) {
            socket.emit(SOCKET_EVENTS.USERNAME_ERROR, `Username must be between 1 and ${APP_CONFIG.MAX_USERNAME_LENGTH}`)
            socket.disconnect()
            return
        }

        if (isUsernameTaken(trimmedUsername)) {
            socket.emit(SOCKET_EVENTS.USERNAME_ERROR, "Username already taken")
            socket.disconnect()
            return
        }

        addUser({
            socketId: socket.id,
            username: trimmedUsername,
            joinedAt: Date.now()
        })

        socket.emit(SOCKET_EVENTS.USERNAME_SUCCESS, trimmedUsername)

    })

    socket.on(SOCKET_EVENTS.CREATE_ROOM, () => {

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
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, "Unable to create room")
            return
        }

        user.roomId = roomId

        socket.join(roomId)

        socket.emit(SOCKET_EVENTS.ROOM_CREATED, {
            roomId,
            inviteLink: `${APP_CONFIG.DEEP_LINK_PREFIX}${roomId}`
        })

    })

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {

        const room = getRoom(roomId)

        if (!room) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, "Room not found")
            return
        }

        const user = getUser(socket.id)

        if (!user) return

        const allowed = canJoinReservedSlot(roomId, user.username)
        if (!allowed) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, "Room unavailable")
            return
        }

        const joined = addUserToRoom(roomId, socket.id)
        if (!joined) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, "Room Full")
            return
        }

        user.roomId = roomId

        socket.join(roomId)

        socket.emit(SOCKET_EVENTS.ROOM_JOINED, roomId);

        const updatedRoom = getRoom(roomId);

        const count = updatedRoom?.users.length ?? 1;

        socket.emit(
            SOCKET_EVENTS.USER_ONLINE,
            count
        );

        socket.to(roomId).emit(
            SOCKET_EVENTS.USER_ONLINE,
            count
        );
    })

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, ({ roomId, message }) => {
        const user = getUser(socket.id)
        if (!user) return

        const limited = isRateLimited(socket.id, SOCKET_EVENTS.SEND_MESSAGE, 500)
        if (limited) {
            socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, "Too fast")
            return
        }

        const trimmedMessage = message?.trim();

        if (!trimmedMessage || trimmedMessage.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
            socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, `Message limit: ${APP_CONFIG.MAX_MESSAGE_LENGTH}`)
            return
        }

        socket.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
            username: user.username,
            message: trimmedMessage,
            timestamp: Date.now()
        })
    })

    socket.on(SOCKET_EVENTS.TYPING_START, (roomId: string) => {

        const limited = isRateLimited(socket.id, SOCKET_EVENTS.TYPING_START, 300)
        if (limited) return

        socket.to(roomId).emit(SOCKET_EVENTS.TYPING_START)
    })

    socket.on(SOCKET_EVENTS.TYPING_STOP, (roomId: string) => {
        socket.to(roomId).emit(SOCKET_EVENTS.TYPING_STOP)
    })

    socket.on("disconnecting", () => {

        const user = getUser(socket.id)

        if (user?.roomId) {
            reserveSlot(user.roomId, user.username)
            removeUserFromRoom(user.roomId, socket.id)

            const room = getRoom(user.roomId);

            const count = room?.users.length ?? 0;

            socket.emit(
                SOCKET_EVENTS.USER_OFFLINE,
                count
            );

            socket.to(user.roomId).emit(
                SOCKET_EVENTS.USER_OFFLINE,
                count
            );
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)

        clearSocketLimits(socket.id)

        console.log(`[SOCKET] Disconnected: ${socket.id}`);
    });
};
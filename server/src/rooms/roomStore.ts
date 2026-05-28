import { Room } from "./types";

const rooms = new Map<string, Room>()

const ROOM_LIMIT = 2

export const createRoom = (roomId: string) => {
    const room: Room = {
        id: roomId,
        users: [],
        maxUsers: ROOM_LIMIT,
        createdAt: Date.now(),
        lastActivity: Date.now()
    }

    rooms.set(roomId, room)

    return room
}


export const getRoom = (roomId: string) => {
    return rooms.get(roomId)
}

export const addUserToRoom = (
    roomId: string,
    socketId: string
) => {
    const room = rooms.get(roomId)

    if (!room) return false

    if (room.users.length >= room.maxUsers) return false

    room.users.push(socketId)
    room.lastActivity = Date.now()

    return true
}

export const removeUserFromRoom = (
    roomId: string,
    socketId: string
) => {
    const room = rooms.get(roomId)

    if (!room) return

    room.users = room.users.filter(
        (id) => id !== socketId
    )

    room.lastActivity = Date.now()
}

export const deleteRoom = (roomId: string) => {
    rooms.delete(roomId)
}
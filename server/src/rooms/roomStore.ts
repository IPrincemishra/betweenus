import { Room } from "./types";

const rooms = new Map<string, Room>()

const ROOM_LIMIT = 2
const RECONNECT_WINDOW = 10 * 60 * 1000;

export const createRoom = (roomId: string, ownerUsername: string) => {

    const room: Room = {
        id: roomId,
        ownerUsername,
        users: [],
        maxUsers: ROOM_LIMIT,
        reservedSlots: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
    }

    rooms.set(roomId, room)

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

export const reserveSlot = (roomId: string, username: string) => {
    const room = rooms.get(roomId)

    if (!room) return

    room.reservedSlots.push({
        username,
        expiresAt: Date.now() + RECONNECT_WINDOW
    })

    room.lastActivity = Date.now()

}

export const canJoinReservedSlot = (roomId: string, username: string) => {
    const room = rooms.get(roomId)

    if (!room) return false

    const now = Date.now()

    room.reservedSlots = room.reservedSlots.filter(slot => slot.expiresAt > now)

    const reserved = room.reservedSlots.find(
        slot => slot.username.toLowerCase() === username.toLowerCase()
    )

    if (!reserved) {

        const occupiedSeats = room.users.length + room.reservedSlots.length;

        return (
            occupiedSeats < room.maxUsers
        );
    }

    room.reservedSlots = room.reservedSlots.filter(
        slot => slot.username.toLowerCase() !== username.toLowerCase()
    )

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

    if (room.users.length === 0) {
        rooms.delete(roomId)
        console.log(`[ROOM] Deleted: ${roomId}`);
    }
}

export const deleteRoom = (roomId: string) => {
    rooms.delete(roomId)
}

export const getAllRoomIds = () => {
    return Array.from(
        rooms.keys()
    )
}
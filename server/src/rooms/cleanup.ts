import { deleteRoom, getAllRoomIds, getRoom } from "./roomStore";

const CLEANUP_INTERVAL = 60 * 1000
const INACTIVITY_TIMEOUT = 60 * 60 * 1000;


export const startRoomCleanup = () => {
    setInterval(() => {
        const now = Date.now()

        const roomIds = getAllRoomIds()

        roomIds.forEach(
            (roomId) => {
                const room = getRoom(roomId)

                if (!room) return

                room.reservedSlots = room.reservedSlots.filter(
                    slot => slot.expiresAt > now
                )

                const isInactive = (now - room.lastActivity) > INACTIVITY_TIMEOUT;
                const shouldDestroy = (room.users.length === 0 && room.reservedSlots.length === 0) || isInactive;

                if (shouldDestroy) {
                    deleteRoom(roomId)
                    console.log(`[ROOM] Deleted: ${roomId}`);
                }
            }
        )
    }, CLEANUP_INTERVAL);
}
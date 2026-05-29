import crypto from "crypto"

const ROOM_ID_LENGTH = 12;

export const generateRoomId = () => {
    return crypto.randomBytes(ROOM_ID_LENGTH).toString("hex")
}
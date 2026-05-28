export interface UserSession {
    socketId: string;
    username: string
    roomId?: string
    joinedAt: number
}
export interface ReservedSlot {
    username: string;
    expiresAt: number;
}

export interface Room {
    id: string;
    ownerUsername: string;
    users: string[];
    maxUsers: number;
    reservedSlots: ReservedSlot[];
    createdAt: number;
    lastActivity: number;
}
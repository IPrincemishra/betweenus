export interface Room {
    id: string;
    users: string[];
    maxUsers: number;
    createdAt: number;
    lastActivity: number;
}
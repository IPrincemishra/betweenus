import { create } from "zustand";

type SessionStore = {
    username: string;
    roomId: string;
    setUsername: (username: string) => void;
    setRoomId: (roomId: string) => void;
}

export const useSessionStore = create<SessionStore>(
    (set) => ({
        username: "",
        roomId: "",
        setUsername: (username) => {
            set({ username })
        },
        setRoomId: (roomId) => {
            set({ roomId })
        },
    })
)
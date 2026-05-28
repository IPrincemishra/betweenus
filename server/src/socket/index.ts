import { Server } from "socket.io";
import http from "http"
import { registerSocketHandlers } from "./handlers";

export const initializeSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        registerSocketHandlers(socket)
    })

    return io
}
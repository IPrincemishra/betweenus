import app from "./app";
import "dotenv/config"
import http from "http"
import { Server } from "socket.io";

const PORT = process.env.PORT

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("User Disconnected: ", socket.id);

    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

})
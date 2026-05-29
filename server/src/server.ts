import "dotenv/config"
import http from "http"
import app from "./app";

import { initializeSocket } from "./socket";
import { startRoomCleanup } from "./rooms/cleanup";


const PORT = process.env.PORT

const server = http.createServer(app)

initializeSocket(server)

startRoomCleanup()

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
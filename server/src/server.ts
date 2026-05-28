import app from "./app";
import "dotenv/config"
import http from "http"

import { initializeSocket } from "./socket";


const PORT = process.env.PORT

const server = http.createServer(app)

initializeSocket(server)

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

})
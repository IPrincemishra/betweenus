import express from "express";
import cors from "cors"
import { getAllRoomIds, getRoom } from "./rooms/roomStore";
import { getAllUsers } from "./users/userStore";

const app = express()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Backend is running")
})

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now()
    })
})

app.get("/debug", (req, res) => {
    const rooms = getAllRoomIds().map(id => getRoom(id))

    res.json({
        users: getAllUsers(),
        rooms
    })
})

app.get("/rooms/:roomId", (req, res) => {

    const room = getRoom(req.params.roomId);

    if (!room) {
        return res.status(404).json({

            exists: false
        });
    }

    const available = room.users.length < room.maxUsers;

    return res.json({
        exists: true,
        available,
        users: room.users.length
    });
}
);

export default app
import { Server } from "socket.io";

const SocketHandeler = (req, res) => {
    // each time this is called, a new server will be created, which we dont want.
    console.log("Called Api");

    if (res.socket.server.io) {
        console.log("Server already running");
    }
    else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('Server is connected');
            socket?.on('join-room', (roomId, userId) => {
                console.log(`A new user ${userId} joined ${roomId}`);
                socket.join(roomId);
                socket.broadcast.to(roomId).emit('user-connected', userId);
            });
        })
    }

    res.end();
}

export default SocketHandeler;

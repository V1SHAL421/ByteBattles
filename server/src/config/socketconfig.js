import { Server } from "socket.io"

let io;

const socketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log("User is connected to socket server");

        socket.on("add-new-user", (user_id) => {
            console.log(`Add new user function accessed`);
        socket.on("disconnect", () => {
        console.log("User has disconnected from server")})
    })
})}

export const getIo = () => {
    console.log("getIo function accessed");
    if (!io) {
      throw new Error("Socket.io server is down");
    }
    return io;
  };
  
  export default socketServer;
  
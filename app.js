const path = require("path")
var express = require("express")
const { Socket } = require("socket.io")
var app = express()
const PORT = 9000
const server = app.listen(PORT);
console.log(`Server running at ${PORT}`)
const io = require("socket.io")(server)
app.use(express.static(path.join(__dirname, "public")))
let socketsConnected = new Set()
io.on("connection", onConnected)

function onConnected(socket) {
  console.log(socket.id)
  socketsConnected.add(socket.id)
  io.emit("clients-count", socketsConnected.size)
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id)
    socketsConnected.delete(socket.id);
    io.emit("clients-count", socketsConnected.size)
  });
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data)
  });
  socket.on("feedback",(data)=>{
    socket.broadcast.emit('feedback',data)
  })
}

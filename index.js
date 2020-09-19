const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")

var server = require("http").Server(app)
var io = require("socket.io")(server);
server.listen(3003)

var arrUser = ['AAA'];
var listRoom = []
io.on("connection", function (socket) {
    console.log("Co nguoi ket noi: " + socket.id);

    socket.on('CLIENT-SEND-USERNAME', function (data) {
        if (arrUser.indexOf(data) >= 0) {
            socket.emit("SERVER-SEND-FAIL")
        } else {
            arrUser.push(data);
            socket.username = data
            socket.emit("SERVER-SEND-SUCCESS", data)
            io.sockets.emit("SERVER-SEND-LIST-USERS", arrUser), 1
        }
    })

    socket.on("LOGOUT", function () {
        arrUser.splice(
            arrUser.indexOf(socket.username), 1
        )
        socket.broadcast.emit("HAVE-USER-OUT", arrUser)
    })

    socket.on("USER-SEND-MESSAGE", function (data) {
        io.sockets.emit("SERVER-SEND-MESSAGE", { name: socket.username, nd: data })
        //socket send mess room
        io.sockets.in(socket.room).emit("SERVER-SEND-MESSAGE-ROOM", { name: socket.username, nd: data })
        console.log("socket.room", socket.room)
    })

    socket.on("TYPING", function () {
        let str = socket.username + ": đang gõ chữ"
        io.sockets.emit("SOMEONE-TYPING", str)
    })

    socket.on("STOP-TYPING", function () {
        io.sockets.emit("SOMEONE-STOP-TYPING")
    })

    var the_first = 1

    socket.on("JOIN-ROOM", function (data) {
        socket.room = data
        socket.join(data)

        let s = new Set();
        listRoom.forEach(item => s.add(item))
        s.add(data);
        listRoom = Array.from(s)

        console.log("listRoom", listRoom)
        io.sockets.emit("SERVER-SEND-ROOMS", listRoom)
        socket.emit("SERVER-SEND-ROOM-SOCKET", data)
    })
})

app.get("/", function (req, res) {
    res.render("hello")

})
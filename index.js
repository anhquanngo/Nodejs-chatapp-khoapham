const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")

var server = require("http").Server(app)
var io = require("socket.io")(server);
server.listen(3003)

var arrUser = ['AAA'];

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
    })

    socket.on("TYPING", function () {
        let str = socket.username + ": đang gõ chữ"
        io.sockets.emit("SOMEONE-TYPING", str)
    })

    socket.on("STOP-TYPING", function () {
        io.sockets.emit("SOMEONE-STOP-TYPING")
    })

    var listRoom = []
    socket.on("JOIN-ROOM", function (data) {
        socket.room = data
        socket.join(data)

        listRoom.push(data)
        console.log("listRoom", listRoom)
        io.sockets.emit("SERVER-SEND-ROOMS", listRoom)
        socket.emit("SERVER-SEND-ROOM-SOCKET", data)
    })
    app.get("/", function (req, res) {
        res.render("hello")

    })
})

//io.socket.in(socket.Phong).emit
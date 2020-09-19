var socket = io("http://localhost:3003")

socket.on("SERVER-SEND-FAIL", function () {
    alert("Fail user name")
})

socket.on("SERVER-SEND-SUCCESS", function (data) {
    $('#currentUser').html(data)
    $("#loginForm").hide(2000)
    $("#chatForm").show(1000)
})

socket.on("SERVER-SEND-MESSAGE", function (data) {
    $("#listMessages").append("<div class='ms'>" + data.name + " :" + data.nd + "</div>")
})

socket.on("SERVER-SEND-LIST-USERS", function (data) {
    $("#boxContent").html("")
    data.forEach(user => {
        $("#boxContent").append(
            "<p class='user' data-id='" + user + "' id='" + user + "'>" + user + "</p>"
        )
    });
    $("#boxContent>p").on("click", function (node) {
        $("#NameRoom").html("Bạn đang chat với: " + $(this).attr('data-id'))

    })
})

socket.on("HAVE-USER-OUT", function (data) {
    $("#boxContent").html("")
    data.forEach(user => {
        $("#boxContent").append("<p class='user'>" + user + "</p>")
    });
})

socket.on("SOMEONE-TYPING", function (data) {
    $("#notify").html("<img width='50px' src='./image/tenor.gif'/>")
})
socket.on("SOMEONE-STOP-TYPING", function (data) {
    $("#notify").html("")
})

socket.on("SERVER-SEND-ROOMS", function (data) {
    $("#boxRoom").html("")
    data.forEach(room => {
        $("#boxRoom").append("<div class='room'>" + room + "</div>")
    })
})

socket.on("SERVER-SEND-ROOM-SOCKET", function (data) {
    $("#NameRoom").html("")
    $("#NameRoom").append("Bạn đang ở room: " + data)
})

socket.on("SERVER-SEND-MESSAGE-ROOM", function (data) {
    $("#listMessages").append("<div class='ms'>" + data.name + " :" + data.nd + "</div>")
})

$(document).ready(function () {
    $("#loginForm").show()
    $("#chatForm").hide()

    $("#btnRegister").click(function () {
        socket.emit("CLIENT-SEND-USERNAME", $("#txtUsername").val())
    })

    $("#btnLogout").click(function () {
        socket.emit("LOGOUT")
        $("#loginForm").show(1000)
        $("#chatForm").hide(2000)
    })
    $("#btnSendMessage").click(function () {
        socket.emit("USER-SEND-MESSAGE", $("#txtMessage").val())
        $("#txtMessage").val("")
    })
    $("#txtMessage").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#btnSendMessage").click()
        }
    })

    $("#txtMessage").focusin(function () {
        socket.emit("TYPING")
    })

    $("#txtMessage").focusout(function () {
        socket.emit("STOP-TYPING")
    })

    $("#btnJoinRoom").click(function () {
        socket.emit("JOIN-ROOM", $("#joinRoom").val());
    })


})
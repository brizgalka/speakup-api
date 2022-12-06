let socket = undefined;
let connected = false;

if(localStorage["WsUUID"] == undefined) localStorage["WsUUID"] = ""
const HTML_unconnected = document.querySelector("#app");

function connect_socket() {
    socket = new WebSocket("ws://localhost:6061",localStorage["WsUUID"]);
    socket.onopen = function(e) {
        changeConnectedStatus(true)
    };
    socket.onmessage = function(event) {
        changeConnectedStatus(true)
        const message = JSON.parse(event.data)
        if(message["setWsUUID"] != undefined) {
            localStorage["WsUUID"] = message["setWsUUID"]
        }
    };
    socket.onclose = function(event) {
        changeConnectedStatus(false)
        console.log("DAWWDADW")
        connect_socket()
    };
    socket.onerror = function(error) {
        changeConnectedStatus(false)
        console.log(`[error]`);
        console.log(error)
    };
}

function changeConnectedStatus(to) {
    connected = to
    if(connected) {
        console.log(connected)
    } else {
        console.log(connected)
    }
}

function heartbeat() {
    if (!socket) return;
    if (socket.readyState !== 1) return;
    connected = true
    socket.send(JSON.stringify({
            "message": "heartbeat",
            "uuid": localStorage["WsUUID"]
        }
    ));
}

setInterval(heartbeat, 750);

window.addEventListener("load", (event) => {
    connect_socket()
})
let socket = undefined;
let connected = false;

let HTML_unconnected = document.querySelector(".unconnected");
let REG_FORM = document.querySelector(".reg");

function changeConnectedStatus(to) {
    connected = to
    if(connected) {
        HTML_unconnected.style.display = "none"
        REG_FORM.style.display = "block"
    } else {
        HTML_unconnected.style.display = "block"
        REG_FORM.style.display = "none"
    }
}

changeConnectedStatus(false)

if(localStorage["WsUUID"] == undefined) localStorage["WsUUID"] = "no"

function connect_socket() {
    socket = new WebSocket("ws://localhost:6061",String(localStorage["WsUUID"]));
    socket.onopen = function(e) {
        changeConnectedStatus(true)
    };
    socket.onmessage = function(event) {
        changeConnectedStatus(true)
        const message = JSON.parse(event.data)
        console.log(message)
        if(message["setWsUUID"] != undefined) {
            localStorage["WsUUID"] = message["setWsUUID"]
        }
        if(message["verify"] != undefined) {
            if(message["verify"] == "ok") {
                console.log("Successful")
            }
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

function heartbeat() {
    if (!socket) return;
    if (socket.readyState !== 1) return;
    connected = true
    socket.send(JSON.stringify({
            "message": "heartbeat",
            "uuid": String(localStorage["WsUUID"])
        }
    ));
}

const interval = setInterval(heartbeat, 500);

window.addEventListener("load", (event) => {
    connect_socket()
})
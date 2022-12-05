window.addEventListener("load", (event) => {
    let socket = new WebSocket("ws://localhost:6061");
    socket.onopen = function(e) {
        const message = {
            "message": "hello",
            "status": "verification"
        }
        socket.send(JSON.stringify(message));
    };
    socket.onmessage = function(event) {
        console.log(`[message] Данные получены с сервера: ${event.data}`);
    };
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
            // например, сервер убил процесс или сеть недоступна
            // обычно в этом случае event.code 1006
            console.log('[close] Соединение прервано');
        }
    };
    socket.onerror = function(error) {
        console.log(`[error]`);
    };
})
window.addEventListener("load", () => {
    const button = document.querySelector("#send")
    const reg = document.querySelector(".reg")
    const waiting = document.querySelector(".waiting")
    const verify_code = document.querySelector("#verify-code")
    waiting.style.display = "none"
    button.addEventListener("click", e => {
        let xhr = new XMLHttpRequest();
        const username = document.querySelector("#username").value
        const email = document.querySelector("#email").value
        const password = document.querySelector("#password").value

        let json = JSON.stringify({
            "uuid": String(localStorage["WsUUID"]),
            "password": password,
            "email": email,
            "username": username
        });

        xhr.open('POST', 'http://localhost:6060/auth/registration')

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.send(json);

        xhr.onload = function () {
            console.log(xhr)
            if (xhr.status == 200) {
                const response = JSON.parse(xhr.response)
                reg.remove()
                waiting.style.display = "block"
                verify_code.innerHTML = response["verifyToken"]
            }
        };
        xhr.onerror = function () {
            alert("Запрос не удался");
        };
    })
})
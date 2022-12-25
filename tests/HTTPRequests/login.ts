import http from "http";

http.request({
    host: 'http://localhost:6060',
    path: '/api/auth/register',
},res => console.log(res)).end();
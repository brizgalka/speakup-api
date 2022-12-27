# SPEAKUP-API
## Src - исходный код
## Test - тесты
## Dist - билд(ts -> node js)
## Prisma - база данных prisma
## Storage - все статичные файлы
### Storage/static - серверные статичные файлы
### Storage/users - пользовательские статичные файлы
---
# HTTP API Routes:
http://<HOST>:6060/api/
## auth:
## auth/register
## auth/login
## auth/checkToken
## auth/forgot-password
## auth/new-password
## auth/validate-hashId
## auth/validate-verifyToken
## auth/change-password
## users:
## user/sendMessage
## user/deleteMessage
## user/createChat
## user/getUserData
## user/getMessages
## user/getDialogs
## user/getDialogInfo
## static:
## static/getUserLogo
## utils:
## util/generatePassword
# WS API
---
ws://<HOST>:6061/

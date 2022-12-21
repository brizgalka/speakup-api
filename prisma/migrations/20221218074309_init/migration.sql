-- AlterTable
CREATE SEQUENCE "chat_chat_id_seq";
ALTER TABLE "Chat" ALTER COLUMN "chat_id" SET DEFAULT nextval('chat_chat_id_seq');
ALTER SEQUENCE "chat_chat_id_seq" OWNED BY "Chat"."chat_id";

-- AlterTable
CREATE SEQUENCE "message_chatid_seq";
CREATE SEQUENCE "message_userid_seq";
ALTER TABLE "Message" ALTER COLUMN "chatId" SET DEFAULT nextval('message_chatid_seq'),
ALTER COLUMN "userId" SET DEFAULT nextval('message_userid_seq');
ALTER SEQUENCE "message_chatid_seq" OWNED BY "Message"."chatId";
ALTER SEQUENCE "message_userid_seq" OWNED BY "Message"."userId";

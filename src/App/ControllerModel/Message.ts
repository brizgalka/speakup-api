import Attachment from "./Attachment";
import User from "./User";

export default interface Message {
    sender: User,
    getter: User,
    text: string | null,
    attachment: Attachment[] | null,
}
import Attachment from "./Attachment";
import User from "./User";

export default interface Message {
    sender: User,
    getter: User,
    text: String | null,
    attachment: Attachment[] | null,
}
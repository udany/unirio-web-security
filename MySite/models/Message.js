import BaseModel from "./BaseModel";
import md5 from 'md5';

class Message extends BaseModel {
}

Message.config({
    table: 'message',
    fields: [
        'id',
        'userId',
        'time',
        'text'
    ]
});

export default Message;
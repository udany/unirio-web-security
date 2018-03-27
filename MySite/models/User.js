import BaseModel from "./BaseModel";
import md5 from 'md5';

class User extends BaseModel {
    constructor(data){
        super(data);
    }

    setPassword(pwd) {
        this.password = this.constructor.HashPassword(pwd);
        return this;
    }

    static HashPassword(pwd) {
        return md5(pwd);
    }
}

User.config({
    table: 'user',
    fields: [
        'id',
        'name',
        'email',
        'password'
    ]
});

export default User;
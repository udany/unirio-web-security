import BaseModel from "./BaseModel";
import md5 from 'md5';

class User extends BaseModel {
    constructor(data){
        super(data);
    }

    setPassword(pwd) {
        this.password = md5(pwd);
        return this;
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
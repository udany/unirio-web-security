import BaseModel from "./BaseModel";

class User extends BaseModel {
    constructor(data){
        super(data);
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
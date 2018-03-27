import express from 'express'
import axios from 'axios'
import chalk from 'chalk'
import fileSystem from 'fs-extra'

async function loadUsers(){
    try {
        try {
            let data = await fileSystem.readFile("users.json");
            console.log("Funcionou o load");
            users = JSON.parse(data);
        } catch (e){

        }
    }catch(error){
        console.log(error);
    }
}

async function saveUsers(){
    try {
        await fileSystem.writeFile("users.json", JSON.stringify(users));
        console.log("Funcionou");
    }catch(error) {
        console.log(error);
    }

    console.log(users);
}

let router = express.Router();

let users = [];
loadUsers();

//add (edit) users
router.get('/save/', function (req, res, next) {
    let {name, gender = '', hairColor=''} = req.query;
    if (name) {
        let updatedUser = users.find(x => x.name === name);
        if (updatedUser){
            updatedUser.gender = gender.toLowerCase();
            updatedUser.hairColor = hairColor;
        }else{
            users.push({
                name, gender, hairColor
            });
        }
        saveUsers();
        res.send({status: "success"});
    } else {
        res.send({status: "failed"});
    }
});


router.get('/remove/', function (req, res, next){
    let {name} = req.query;
    if (name) {
        let removedUser = users.find(x => x.name === name);
        if(removedUser){
            users.remove(removedUser);
            saveUsers();
            res.send({status: "User removed"});
        }
        else{
            res.send({status: "No user found"});
        }
    }
});

router.get('/', function (req, res, next) {
    let {gender = ''} = req.query;

    let filteredUsers = users.filter(x => !gender || x.gender === gender);
    /*let filteredUsers = users.filter(function(x){
        return !gender || x.gender === gender
    });*/

    res.send(filteredUsers);
});

router.get('/test', async function (req, res, next)  {
    let {data} = await axios.get('https://ghibliapi.herokuapp.com/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49');

    res.send(data.title);
});

module.exports.path = '/user';
module.exports.router = router;

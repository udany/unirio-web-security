import express from 'express'
import axios from 'axios'
import db from '../db';
import User from "../models/User";

let router = express.Router();

router.get('/test', async function (req, res, next) {
    let {session} = req;

    let {data} = await axios.get('https://ghibliapi.herokuapp.com/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49');

    res.send(data.title);
});

router.post('/login', async function (req, res, next) {
    let {session, body} = req;

    if (body.email){
        session.uid = 1;

        let u = await User.select(db, {email: body.email}, true);

        let password = User.HashPassword(body.password);

        if (password === u.password) {
            session.uid = u.id;

            res.send({success: true, u});
            return;
        }
    }

    res.send({success: false});
});

router.get('/status', async function (req, res, next) {
    let {session} = req;

    if (session.uid) {
        let u = await User.getById(db, session.uid);

        res.send({logged: true, user: u});
    } else {
        res.send({logged: false});
    }
});

module.exports.path = '/auth';
module.exports.router = router;
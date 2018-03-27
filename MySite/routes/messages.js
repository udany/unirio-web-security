import express from 'express'
import axios from 'axios'
import db from '../db';
import User from "../models/User";
import Message from "../models/Message";

let router = express.Router();

router.post('/post', async function (req, res, next) {
    let {session, body} = req;

    if (body.email){
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

router.get('/list', async function (req, res, next) {
    let messages = await Message.select(db, {});
    res.send(messages);
});

module.exports.path = '/message';
module.exports.router = router;
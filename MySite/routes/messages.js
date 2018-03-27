import express from 'express'
import axios from 'axios'
import db from '../db';
import User from "../models/User";
import Message from "../models/Message";

let router = express.Router();

router.post('/post', async function (req, res, next) {
    let {session, body} = req;

    if (session.uid){
        let msg = new Message({text: body.text, userId: session.uid, time: Date.now()})
        await msg.save(db);

        res.send({success: true, msg});

        return;
    }

    res.send({success: false});
});

router.get('/list', async function (req, res, next) {
    let messages = await Message.select(db, {});
    let users = await User.select(db, {});

    messages.forEach(async function (m) {
        m.user = users.find(x => x.id === m.userId);
    });

    res.send(messages);
});

router.post('/test', async function (req, res, next) {
    let {session, body} = req;
});

module.exports.path = '/message';
module.exports.router = router;
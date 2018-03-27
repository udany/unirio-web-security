import express from 'express'
import axios from 'axios'
import db from '../db';
import User from "../models/User";

let router = express.Router();

router.post('/login', async function (req, res, next) {
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

router.post('/register', async function (req, res, next) {
    let {session, body} = req;

    let u = new User({
        email: body.email,
        name: body.name
    });
    u.setPassword(body.password);

    await u.save(db);

    u = await User.select(db, {email: body.email}, true);

    session.uid = u.id;

    res.send({success: true, u});
});

router.post('/editInfo', async function (req, res, next) {
    let {session, body} = req;

    if (session.uid){
        let u = await User.getById(db, session.uid);

        u.email = body.email;
        u.name = body.name;

        if (body.password) u.setPassword(body.password);

        await u.save(db);

        res.send({success: true, u});

        return;
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
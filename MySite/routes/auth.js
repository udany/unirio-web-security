import express from 'express'
import axios from 'axios'
import db from '../db';
import User from "../models/User";

let router = express.Router();

router.get('/test', async function (req, res, next)  {
    let {session} = req;

    let {data} = await axios.get('https://ghibliapi.herokuapp.com/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49');

    res.send(data.title);
});

router.get('/set', async function (req, res, next)  {
    let {session} = req;
    session.uid = Math.randomInt(50);
    console.log(session.uid);

    let u = new User({id: 2, name: 'Daniel Coelho', email: 'daniel.coelho@uniriotec.br'});
    await u.save(db);

    res.send("OK = "+session.uid);
});

router.get('/get', async function (req, res, next)  {
    let {session} = req;

    let u = await User.getById(db, 1);

    res.send(u);
});

module.exports.path = '/auth';
module.exports.router = router;
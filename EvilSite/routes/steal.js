import express from 'express'
import axios from 'axios'
import chalk from 'chalk'
import fileSystem from 'fs-extra'

let router = express.Router();

router.get('/', async function (req, res, next)  {
    console.log(req.query.d);


    res.send('Done');
});

module.exports.path = '/steal';
module.exports.router = router;

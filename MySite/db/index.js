import chalk from 'chalk'

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(chalk.redBright(err.message));
    }
    console.log(chalk.blueBright('Connected to the chinook database.'));
});

export default db;
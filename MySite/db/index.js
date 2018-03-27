import chalk from 'chalk'

const sqlite3 = require('sqlite3').verbose();

console.log(chalk.yellow('Connecting to database...'));

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(chalk.redBright(err.message));
    }
    console.log(chalk.green('Connected to database.'));
});

export default db;
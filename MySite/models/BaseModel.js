class BaseModel {
    constructor(data){
        if (data) {
            this.fill(data);
        }
    }

    fill(data) {
        for (let field of this.constructor.fields) {
            if (data.hasOwnProperty(field)){
                this[field] = data[field];
            }
        }
    }

    save(db) {
        return this.constructor.save(db, this);
    }

    static config({table, fields, id = 'id'}) {
        this.fields = fields;
        this.id = id;
        this.table = table;
    }

    static getById(db, id, raw) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM ${this.table} WHERE ${this.id} = ${id}`;

            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err.message);
                }

                resolve(raw ? row : new this(row));
            });
        });
    }

    static save(db, obj) {
        return new Promise((resolve, reject) => {
            const update = obj[this.id];

            if (update) {
                db.run(`INSERT INTO ${this.table} VALUES (?)`);
            } else {
                let values = [];

                for (let field of this.fields){
                    let val = obj[field];
                    if (typeof val === 'string') val = `"${val}"`;

                    values.push(val);
                }

                db.run(`INSERT INTO ${this.table} VALUES (${values.join(', ')})`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    }
}

export default BaseModel;
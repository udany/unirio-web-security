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

    toJson() {
        let data = {};
        for (let field of this.constructor.fields) {
            if (this.hasOwnProperty(field)){
                data[field] = this[field];
            }
        }

        return data;
    }

    static config({table, fields, id = 'id'}) {
        this.fields = fields;
        this.id = id;
        this.table = table;
    }

    static getById(db, id, raw = false) {
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

    static select(db, filters, single = false, raw = false) {
        return new Promise((resolve, reject) => {
            let filterClauses = [];

            for (let field in filters){
                if (!filters.hasOwnProperty(field)) continue;

                let val = filters[field];
                if (typeof val === 'string') val = `"${val}"`;
                val = `${field} = ${val}`;

                filterClauses.push(val);
            }

            let sql = `SELECT * FROM ${this.table} WHERE ${filterClauses.join(', ')}`;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err.message);
                }

                rows = raw ? rows : rows.map(r => new this(r));

                resolve(single ? (rows.length ? rows[0] : null) : rows);
            });
        });
    }

    static save(db, obj) {
        return new Promise((resolve, reject) => {
            const update = !!obj[this.id];

            if (update) {
                let id = obj[this.id];

                let values = [];

                for (let field of this.fields){
                    if (field === this.id) continue;
                    if (!obj.hasOwnProperty(field)) continue;

                    let val = obj[field];
                    if (typeof val === 'string') val = `"${val}"`;
                    val = `${field} = ${val}`;

                    values.push(val);
                }

                let sql = `UPDATE ${this.table} SET ${values.join(', ')} WHERE ${this.id} = ${id}`;
                db.run(sql, [], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                let fields = [];
                let values = [];

                for (let field of this.fields){
                    if (field === this.id) continue;
                    if (!obj.hasOwnProperty(field)) continue;

                    let val = obj[field];
                    if (typeof val === 'string') val = `"${val}"`;

                    values.push(val);
                    fields.push(field);
                }

                let sql = `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${values.join(', ')})`;

                db.run(sql, [], (err) => {
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
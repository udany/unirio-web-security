import './Date';

RegExp.Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


/**
 * Generates a random integer
 * @param max
 * @param min
 * @returns {number}
 */
Math.randomInt = function (max, min) {
    if (!min) min = 0;
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Pads a string (e.g.: "9" may become "009" and "10" "010").
 * @param character
 * @param size
 * @param [right]
 * @returns {String}
 */
String.prototype.pad = function (character, size, right) {
    let s = this + '';
    if (!right) {
        while (s.length < size) s = character + s;
    } else {
        while (s.length < size) s = s + character;
    }
    return s;
};

String.prototype.format = function (values, pattern) {
    if (!pattern) {
        pattern = function (key) {
            return '{' + key + '}';
        };
    }

    let final = this.toString();
    for (let i in values) {
        if (values.hasOwnProperty(i)) {
            let match = pattern;
            if (typeof pattern === 'string') {
                match = pattern.replace('?', i);
            } else if (pattern instanceof Function) {
                match = pattern(i);
            }

            final = final.replace(
                new RegExp(RegExp.escape(match), 'g'),
                values[i]
            );
        }
    }

    return final;
};

String.prototype.nl2br = function () {
    return this.replace(/\n/g, '<br>');
};

RegExp.escape = function (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

Number._decimalChar = '.';
Number.setDecimalChar = function (val) {
    this._decimalChar = val;
};
Number.prototype.pad = function (size, decimalSize, decimalChar) {
    if (!decimalChar) decimalChar = Number._decimalChar;

    let negative = this < 0;
    let val = Math.abs(this);

    let str = val.toString();
    str = str.split(".");

    let result = str[0].pad("0", size || 0);

    if (decimalSize && str.length === 1) {
        str[1] = '0';
    }

    if (str.length === 2) {
        result += decimalChar + str[1].pad("0", decimalSize, true);
    }

    if (negative) result = "-" + result;

    return result;
};


Array.prototype.selfConcat = function () {
    for (let i = 0; i < arguments.length; i++) {
        let a = arguments[i];
        if (a instanceof Array) {
            this.push.apply(this, a);
        }
    }
};
Array.prototype.remove = function (...elements) {
    elements.forEach(e => {
        let idx = this.indexOf(e);
        if (idx >= 0) {
            this.splice(idx, 1);
        }
    });

    return this;
};
Array.prototype.flatten = function () {
    return this.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? toFlatten.flatten() : toFlatten);
    }, []);
};

Array.prototype.unique = function () {
    if (arguments.length === 0) {
        return !!this._unique;
    } else {
        this._unique = arguments[0];
    }
};

Array.prototype.super_push = Array.prototype.push;
Array.prototype.push = function (...items) {
    if (this.unique()) {
        let i = 0;
        while (i < items.length) {
            let item = items[i];
            if (this.indexOf(item) >= 0) {
                items.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    this.super_push(...items);

    return this.length;
};
Array.prototype.mapAsync = async function (fn) {
    let promises = [];

    let result = [];

    for (let i = 0; i < this.length; i++) {
        let promise = fn(this[i]);
        let localIterator = i;

        promise.then(x => {
            result[localIterator] = x;
        });

        promises.push(promise);
    }

    await Promise.all(promises);

    return result;
};


export class HasUniqueId {
    constructor() {
    }

    GetUId() {
        if (!this.__uid) {
            this.__uid = Date.now() + '_' + Math.randomInt(9999999).pad(7);
        }
        return this.__uid;
    }
}

/**
 * Emitter class
 * @extends HasUniqueId
 */
export class Emitter extends HasUniqueId {

    constructor() {
        super();
    }

    on(event, fn, key, once) {
        if (!this.__boundEvents) this.__boundEvents = {};
        if (!this.__boundEvents[event]) this.__boundEvents[event] = [];

        this.__boundEvents[event].push({callback: fn, key: key, once: once});

        return this;
    }

    onAny(fn, key, once) {
        this.on(Emitter.AnyEvent, fn, key, once);

        return this;
    }

    off(event, fn) {
        if (!this.__boundEvents || !this.__boundEvents[event]) return this;

        if (fn instanceof Array) {
            for (let i = 0; i < fn.length; i++) {
                this.off(event, fn[i]);
            }
        } else if (fn) {
            let idx;

            if (fn.callback instanceof Function) {
                idx = this.__boundEvents[event].indexOf(fn);
            } else {
                fn = this.__boundEvents[event].filter(function (e) {
                    return e.key === fn
                });
                if (fn.length) {
                    idx = this.__boundEvents[event].indexOf(fn[0]);
                }
            }

            if (idx >= 0) {
                this.__boundEvents[event].splice(idx, 1);
            }
        } else {
            this.__boundEvents[event] = [];
        }

        return this;
    }

    emit(event, args) {
        if (this.__boundEvents && this.__boundEvents[event]) {
            let removeElements = [];

            let eventData = this.__boundEvents[event].concat([]);

            for (let i = 0; i < eventData.length; i++) {
                let data = eventData[i];
                data.callback.apply(this, args);
                if (data.once) removeElements.push(data);
            }

            this.off(event, removeElements);
        }
        if (event !== Emitter.AnyEvent && this.__boundEvents && this.__boundEvents[Emitter.AnyEvent]) {
            this.emit(Emitter.AnyEvent, ([event]).concat(args));
        }

        return this;
    }

    once(event, fn, key) {
        this.on(event, fn, key, true);

        return this;
    }
}

Emitter.AnyEvent = '*';


// Options
export class OptionsReceiver extends Emitter {
    constructor(def) {
        super();

        this.applyOptions(def);
    }

    applyOptions(o, def) {
        if (!o) o = {};
        if (!def) def = {};

        for (let i in o) {
            if (o.hasOwnProperty(i)) {
                def[i] = o[i];
            }
        }
        for (i in def) {
            if (def.hasOwnProperty(i)) {
                this[i] = def[i];
            }
        }

        return this;
    }
}

export default {
    HasUniqueId,
    Emitter,
    OptionsReceiver
};
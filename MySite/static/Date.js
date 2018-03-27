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


Date.prototype.format = function (f) {
    if (!this.strings) {
        this.strings = {};
        for (let k in Date.formatStrings) {
            let o = Date.formatStrings[k];
            let val;
            if (o[0] instanceof Function) {
                val = o[0](this);
            } else {
                val = this[o[0]]();
            }
            if (o.length >= 3) val += o[2];
            if (o.length >= 2) val = val.pad(o[1]);

            this.strings[k] = val;
        }
    }

    for (let k in Date.formatStrings) {
        f = f.replace(k, this.strings[k]);
    }

    return f;
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


Date.prototype.getLocalizedMonth = function (lang) {
    return Date[lang].months[this.getMonth()];
};

Date.prototype.getLocalizedWeekday = function (lang) {
    return Date[lang].weekdays[this.getDay()];
};


Date.formatStrings = {
    d: ['getDate', 2],
    j: ['getDate'],
    /// month starts at 0, third index tells it to add 1 to the value
    m: ['getMonth', 2, 1],
    Y: ['getFullYear', 4],
    H: ['getHours', 2],
    h: [function (d) {
        return d.getHours() - (d.getHours() > 12 ? 12 : 0)
    }, 2],
    i: ['getMinutes', 2],
    s: ['getSeconds', 2],
    A: [function (d) {
        return (d.getHours() > 12 ? "PM" : "AM")
    }, 2]
};
Date.ptbr = {
    weekdays: [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ],
    months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]
};

/**
 *
 * @param dateField
 * @param timeField
 * @returns {Date}
 */
Date.fromInputDate = function (dateField, timeField) {
    let day = 0;
    let month = 0;
    let year = 0;
    let hour = 0;
    let minute = 0;

    if (dateField) {
        dateField = $(dateField).val();
        if (dateField) {
            dateField = dateField.split('-');
            year = parseInt(dateField[0]);
            month = parseInt(dateField[1]) - 1;
            day = parseInt(dateField[2]);
        }
    }

    if (timeField) {
        timeField = $(timeField).val();
        if (timeField) {
            timeField = timeField.split(':');
            hour = parseInt(timeField[0]);
            minute = parseInt(timeField[1]);
        }
    }

    return new Date(year, month, day, hour, minute, 0, 0);
};

Date.prototype.stdTimezoneOffset = function () {
    let fy = this.getFullYear();
    if (!Date.prototype.stdTimezoneOffset.cache.hasOwnProperty(fy)) {

        let maxOffset = new Date(fy, 0, 1).getTimezoneOffset();
        let monthsTestOrder = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1];

        for (let mi = 0; mi < 12; mi++) {
            let offset = new Date(fy, monthsTestOrder[mi], 1).getTimezoneOffset();
            if (offset !== maxOffset) {
                maxOffset = Math.max(maxOffset, offset);
                break;
            }
        }
        Date.prototype.stdTimezoneOffset.cache[fy] = maxOffset;
    }
    return Date.prototype.stdTimezoneOffset.cache[fy];
};

Date.prototype.stdTimezoneOffset.cache = {};

Date.prototype.isDST = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
(function() {
  var XDate, addDatePrototype, dateMethods, dm, exports, lpad, object_clone, rpad, _i, _len,
    __hasProp = Object.prototype.hasOwnProperty,
    __slice = Array.prototype.slice;

  object_clone = function(src) {
    var k, neu, v, _i, _len;
    if (typeof src !== 'object' || src === null) return src;
    neu = new src.constructor();
    if (src instanceof Object) {
      for (k in src) {
        if (!__hasProp.call(src, k)) continue;
        v = src[k];
        neu[k] = object_clone(v);
      }
    } else if (src instanceof Array) {
      neu = [];
      for (_i = 0, _len = src.length; _i < _len; _i++) {
        v = src[_i];
        neu.push(object_clone(v));
      }
    }
    return neu;
  };

  lpad = function(str, padString, length) {
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  };

  rpad = function(str, padString, length) {
    while (str.length < length) {
      str = str + padString;
    }
    return str;
  };

  /*
  */

  XDate = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this._date = new (Date.bind.apply(Date, [this].concat(args)));
    if (this.isLeapYear()) {
      this._months = object_clone(this._months);
      this._months_days[1] = 29;
    }
    return this;
  };

  addDatePrototype = function(dm) {
    return XDate.prototype[dm] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Date.prototype[dm].apply(this._date, args);
    };
  };

  dateMethods = ['getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset', 'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'getYear', 'parse', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'setYear', 'toDateString', 'toGMTString', 'toLocaleDateString', 'toLocaleTimeString', 'toLocaleString', 'toString', 'toTimeString', 'toUTCString', 'UTC', 'valueOf'];

  for (_i = 0, _len = dateMethods.length; _i < _len; _i++) {
    dm = dateMethods[_i];
    addDatePrototype(dm);
  }

  XDate.prototype._months_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  XDate.prototype._months_abbr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  XDate.prototype._months_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  XDate.prototype._days_full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  XDate.prototype._days_abbr = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

  XDate.prototype.getDayX = function(mondayFirst) {
    if (mondayFirst == null) mondayFirst = false;
    if (mondayFirst) {
      return Math.abs((this.getDay() - 1) % 7);
    } else {
      return this.getDay();
    }
  };

  XDate.prototype.getMonthName = function(abbr) {
    if (abbr == null) abbr = false;
    if (abbr) {
      return this._months_abbr[this._date.getMonth()];
    } else {
      return this._months_full[this._date.getMonth()];
    }
  };

  XDate.prototype.getDayName = function(abbr, mondayFirst) {
    if (abbr == null) abbr = false;
    if (mondayFirst == null) mondayFirst = false;
    if (abbr) {
      return this._days_abbr[this.getDayX(mondayFirst)];
    } else {
      return this._days_full[this.getDayX(mondayFirst)];
    }
  };

  XDate.prototype.getDayOfYear = function() {
    var i, m, num;
    num = 0;
    m = this.getMonth();
    for (i = 0; i <= 11; i++) {
      if (i === m) return num + this._date.getDate();
      num += this._months_days[i];
    }
    return NaN;
  };

  XDate.prototype.getWeek = function(mondayFirst) {
    var d, s;
    if (mondayFirst == null) mondayFirst = false;
    d = this.getDayOfYear();
    s = (new XDate('01-01-' + this.getFullYear())).getDayX(mondayFirst);
    return Math.ceil((d + s) / 7);
  };

  XDate.prototype.getCentury = function() {
    return Math.floor(this.getFullYear() / 100);
  };

  XDate.prototype.isLeapYear = function() {
    return this.getYear() % 4 === 0;
  };

  XDate.prototype.getHours12 = function() {
    var h;
    h = this.getHours() % 12;
    if (h === 0) {
      return 12;
    } else {
      return h;
    }
  };

  XDate.prototype.getAMPM = function(lowercase) {
    var h;
    if (lowercase == null) lowercase = false;
    h = this.getHours();
    if (lowercase) {
      if (h < 12) {
        return 'am';
      } else {
        return 'pm';
      }
    } else {
      if (h < 12) {
        return 'AM';
      } else {
        return 'PM';
      }
    }
  };

  XDate.prototype.getTimeSeconds = function() {
    return Math.round(this.getTime() / 1000);
  };

  XDate.prototype.addMilliseconds = function(milliseconds) {
    return this.setTime(this.getTime() + milliseconds);
  };

  XDate.prototype.addSeconds = function(seconds) {
    return this.addMilliseconds(seconds * 1000);
  };

  XDate.prototype.addMinutes = function(minutes) {
    return this.addSeconds(minutes * 60);
  };

  XDate.prototype.addHours = function(hours) {
    return this.addMinutes(hours * 60);
  };

  XDate.prototype.addDays = function(days) {
    return this.addHours(days * 24);
  };

  XDate.prototype.format = function(fmt, recursing) {
    if (recursing == null) recursing = false;
    fmt = fmt.replace('%a', this.getDayName(true));
    fmt = fmt.replace('%A', this.getDayName());
    fmt = fmt.replace('%d', lpad('' + this.getDate(), '0', 2));
    fmt = fmt.replace('%e', this.getDate());
    fmt = fmt.replace('%j', lpad('' + this.getDayOfYear(), '0', 3));
    fmt = fmt.replace('%u', this.getDayX(true));
    fmt = fmt.replace('%w', this.getDayX());
    fmt = fmt.replace('%m', lpad('' + (this.getMonth() + 1), '0', 2));
    fmt = fmt.replace('%b', this.getMonthName(true));
    fmt = fmt.replace('%B', this.getMonthName());
    fmt = fmt.replace('%y', ('' + this.getFullYear()).substr(2));
    fmt = fmt.replace('%Y', this.getFullYear());
    fmt = fmt.replace('%U', this.getWeek());
    fmt = fmt.replace('%W', this.getWeek(true));
    fmt = fmt.replace('%V', this.getWeek());
    fmt = fmt.replace('%C', this.getCentury());
    fmt = fmt.replace('%l', this.getHours12());
    fmt = fmt.replace('%I', lpad('' + (this.getHours12()), '0', 2));
    fmt = fmt.replace('%k', this.getHours());
    fmt = fmt.replace('%H', lpad('' + (this.getHours()), '0', 2));
    fmt = fmt.replace('%p', this.getAMPM());
    fmt = fmt.replace('%P', this.getAMPM(true));
    fmt = fmt.replace('%M', lpad('' + (this.getMinutes()), '0', 2));
    fmt = fmt.replace('%s', this.getTimeSeconds());
    fmt = fmt.replace('%S', lpad('' + (this.getSeconds()), '0', 2));
    if (!recursing) {
      fmt = fmt.replace('%D', this.format('%m/%d/%y', true));
      fmt = fmt.replace('%x', this.format('%m/%d/%y', true));
      fmt = fmt.replace('%F', this.format('%Y-%m-%d', true));
      fmt = fmt.replace('%R', this.format('%H:%M', true));
      fmt = fmt.replace('%T', this.format('%H:%M:%S', true));
      fmt = fmt.replace('%X', this.format('%I:%M:%S %P', true));
    }
    fmt = fmt.replace('%%', '%');
    return fmt;
  };

  module.exports = exports = XDate;

}).call(this);

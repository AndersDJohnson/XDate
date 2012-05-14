object_clone = ( src ) ->
		if typeof src isnt 'object' or src is null
			return src
		neu = new src.constructor()
		if src instanceof Object
			for own k,v of src
				neu[k] = object_clone(v)
		else if src instanceof Array
			neu = []
			for v in src
				neu.push object_clone(v)
		return neu

lpad = (str, padString, length) ->
    while str.length < length
        str = padString + str
    return str
 
rpad = (str, padString, length) ->
    while str.length < length
        str = str + padString
    return str

###
###

XDate = ( args... ) ->
	this._date = new (Date.bind.apply(Date, [this].concat(args) ))
	if this.isLeapYear()
		this._months = object_clone( this._months )
		this._months_days[1] = 29
	return this

addDatePrototype = ( dm ) ->
	XDate.prototype[dm] = ( args... ) ->
		return Date.prototype[dm].apply(this._date, args)

dateMethods = ['getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset', 'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'getYear', 'parse', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'setYear', 'toDateString', 'toGMTString', 'toLocaleDateString', 'toLocaleTimeString', 'toLocaleString', 'toString', 'toTimeString', 'toUTCString', 'UTC', 'valueOf']
for dm in dateMethods
	addDatePrototype(dm)

XDate.prototype._months_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
XDate.prototype._months_abbr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
XDate.prototype._months_days = [31,28,31,30,31,30,31,31,30,31,30,31]

XDate.prototype._days_full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
XDate.prototype._days_abbr = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

XDate.prototype.getDayX = ( mondayFirst = false ) ->
	if mondayFirst
		return Math.abs((this.getDay() - 1) % 7)
	else
		return this.getDay()

XDate.prototype.getMonthName = ( abbr = false ) ->
	return if abbr then this._months_abbr[this._date.getMonth()] else this._months_full[this._date.getMonth()] 

XDate.prototype.getDayName = ( abbr = false, mondayFirst = false ) ->
	return if abbr then this._days_abbr[this.getDayX(mondayFirst)] else this._days_full[this.getDayX(mondayFirst)] 

XDate.prototype.getDayOfYear = () ->
	num = 0
	m = this.getMonth()
	for i in [0..11]
		if i == m
			return num + this._date.getDate()
		num += this._months_days[i]
	return NaN

XDate.prototype.getWeek = ( mondayFirst = false ) ->
	d = this.getDayOfYear()
	s = (new XDate('01-01-'+this.getFullYear())).getDayX( mondayFirst )
	return Math.ceil( (d + s) / 7 )

XDate.prototype.getCentury = () ->
	return Math.floor( this.getFullYear() / 100 )

XDate.prototype.isLeapYear = () ->
	return this.getYear() % 4 == 0

XDate.prototype.getHours12 = () ->
	h = this.getHours() % 12
	return if h == 0 then 12 else h

XDate.prototype.getAMPM = ( lowercase = false ) ->
	h = this.getHours()
	if lowercase
		return if h < 12 then 'am' else 'pm'
	else
		return if h < 12 then 'AM' else 'PM'

XDate.prototype.getTimeSeconds = () ->
	return Math.round( this.getTime() / 1000 )

XDate.prototype.addMilliseconds = ( milliseconds ) ->
	this.setTime this.getTime() + milliseconds

XDate.prototype.addSeconds = ( seconds ) ->
	this.addMilliseconds seconds*1000

XDate.prototype.addMinutes = ( minutes ) ->
	this.addSeconds minutes*60

XDate.prototype.addHours = ( hours ) ->
	this.addMinutes hours*60

XDate.prototype.addDays = ( days ) ->
	this.addHours days*24

# http://www.adminschoice.com/unix-date-format-examples
XDate.prototype.format = ( fmt, recursing = false ) ->
	fmt = fmt.replace '%a', this.getDayName(true)
	fmt = fmt.replace '%A', this.getDayName()
	fmt = fmt.replace '%d', lpad(''+this.getDate(), '0', 2)
	fmt = fmt.replace '%e', this.getDate()
	fmt = fmt.replace '%j', lpad(''+this.getDayOfYear(), '0', 3)
	fmt = fmt.replace '%u', this.getDayX(true)
	fmt = fmt.replace '%w', this.getDayX()
	fmt = fmt.replace '%m', lpad(''+(this.getMonth() + 1), '0', 2)
	fmt = fmt.replace '%b', this.getMonthName(true)
	fmt = fmt.replace '%B', this.getMonthName()
	fmt = fmt.replace '%y', (''+this.getFullYear()).substr(2)
	fmt = fmt.replace '%Y', this.getFullYear()
	fmt = fmt.replace '%U', this.getWeek()
	fmt = fmt.replace '%W', this.getWeek(true)
	fmt = fmt.replace '%V', this.getWeek()
	fmt = fmt.replace '%C', this.getCentury()
	fmt = fmt.replace '%l', this.getHours12()
	fmt = fmt.replace '%I', lpad(''+(this.getHours12()), '0', 2)
	fmt = fmt.replace '%k', this.getHours()
	fmt = fmt.replace '%H', lpad(''+(this.getHours()), '0', 2)
	fmt = fmt.replace '%p', this.getAMPM()
	fmt = fmt.replace '%P', this.getAMPM( true )
	fmt = fmt.replace '%M', lpad(''+(this.getMinutes()), '0', 2)
	fmt = fmt.replace '%s', this.getTimeSeconds()
	fmt = fmt.replace '%S', lpad(''+(this.getSeconds()), '0', 2)
	
	if not recursing
		fmt = fmt.replace '%D', this.format('%m/%d/%y', true)
		fmt = fmt.replace '%x', this.format('%m/%d/%y', true) # TODO: locale-sensitive
		fmt = fmt.replace '%F', this.format('%Y-%m-%d', true)
		fmt = fmt.replace '%R', this.format('%H:%M', true)
		fmt = fmt.replace '%T', this.format('%H:%M:%S', true)
		fmt = fmt.replace '%X', this.format('%I:%M:%S %P', true) # TODO: locale-sensitive
	
	fmt = fmt.replace '%%', '%'
	return fmt

module.exports = exports = XDate

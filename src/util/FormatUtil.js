const toCurrency = (val, needCents) => {
	let money;

	if(needCents){
		money = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(val)
	} else {
		money = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0}).format(val)
	}

	return money;
}

const toDay = (dayString) => {
	const dayVal = new Date(dayString);
	return new Intl.DateTimeFormat('en-US').format(dayVal);
}

const daysSince = (dayString) => {
	const dayVal = new Date(dayString);
	const today = new Date;

	let timeDiff = today.getTime() - dayVal.getTime();

	return Math.floor(timeDiff / (1000 * 3600 * 24));
}

const toPercent = (val) => {
	return new Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2}).format(val);
}

const toPrecision = (val, digits) => {
	return new Intl.NumberFormat('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(val);
}

module.exports = {
	toCurrency: toCurrency,
	toDay: toDay,
	daysSince: daysSince,
	toPercent: toPercent,
	toPrecision: toPrecision
}
// Return today's date and time
var currentTime = new Date();

// returns the month (from 0 to 11)
var month = currentTime.getMonth() + 1;
if (month < 10) month = `0${month}`;
// returns the day of the month (from 1 to 31)
var day = currentTime.getDate();

// returns the year (four digits)
var year = currentTime.getFullYear();

export const monthYear = (() => {
	return `${year}-${month}`;
})();

export const Status = {
	idle: "idle",
	pending: "pending",
	resolved: "resolved",
	rejected: "rejected",
};

function getTime() {
	console.log("updating time");
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	var period = "am";
	if(hours > 12) {
		hours = hours - 12;
		period = "pm";
	}
	if(hours < 1) {
		hours = hours + 12;
	}
	var clockElement = document.getElementById("clock");
	
	clockElement.innerHTML = pad(hours) + ":" + pad(minutes) + 
		":" + pad(seconds) + "&nbsp" + period;
		
	setTimeout(getTime, 1000);
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

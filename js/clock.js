function getTime() {
	console.log("updating time");
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var deciseconds = Math.round(date.getMilliseconds() / 100);
	if(deciseconds == 10)
	{
		deciseconds = 0;
	}
	var period = "am";
	
	if(hours > 12) {
		hours = hours - 12;
		period = "pm";
	}
	var clockElement = document.getElementById("clock");
	
	clockElement.innerHTML = pad(hours) + ":" + pad(minutes) + 
		":" + pad(seconds) + "." + deciseconds + "&nbsp" + period;
		
	setTimeout(getTime, 1);
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

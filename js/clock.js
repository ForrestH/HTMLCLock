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

	$("#clock").html(pad(hours) + ":" + pad(minutes) + 
		":" + pad(seconds) + "&nbsp" + period);
		
	setTimeout(getTime, 1000);
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}



$(document).ready(function() {
			$.getJSON (
				"https://api.forecast.io/forecast/6206d2099d97ff183ccbdb62f468520e/35.300399,-120.662362",
				"callback=?",
				function(data, textStatus, jqXHR) {
					$("#forecastLabel").html(data.daily.data[0].summary);
					$("#forecastIcon").attr("src", "img/" + data.daily.data[0].icon + ".png");
					var tempMax = data.daily.data[0].temperatureMax;
					if(tempMax >= 90) {
						$("body").addClass("hot");
					}
					else if(tempMax >= 80) {
						$("body").addClass("warm");
					}
					else if(tempMax >= 70) {
						$("body").addClass("nice");
					}
					else if(tempMax >= 60) {
						$("body").addClass("chilly");
					}
					else {
						$("body").addClass("cold");
					}
					$("#forecastLabel").append("<br>High of " + tempMax + " &degF");
				}
			);
});

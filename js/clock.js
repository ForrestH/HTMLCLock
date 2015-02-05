var numAlarmInsertions = 0;

function deleteAlarm(time, alarmName, id) {
	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				if(results[i].get("time") == time &&
					results[i].get("alarmName") == alarmName) {
						results[i].destroy({
							success: function(object) {
								$("#" + id).remove();
							},
							error: function(object, error) {
								alert("Failed to delete alarm!");
							}
						});
					}
			}
		},
		error: function(error) {
			
		}
	});
}

function getAllAlarms() {
	Parse.initialize("xTFAyS2AAtW2VDZu6aZwEeOobczcG6XIdWdagatG", "cwXbXkErhZJS9c4ygu10NVnnazwdd6HUxlYa9Bc2");

	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				insertAlarm(results[i].get("time"), results[i].get("alarmName"));
			}
		}
	});

}

function showAlarmPopup() {
	$("#mask").removeClass("hide");
	$("#popup").removeClass("hide");
}

function hideAlarmPopup() {
	$("#mask").addClass("hide");
	$("#popup").addClass("hide");
}

function insertAlarm(time, alarmName) {
	numAlarmInsertions++;
	var newAlarm = $("<div id='" + numAlarmInsertions + "'></div>");
	newAlarm.addClass("flexable");
	newAlarm.append("<div class=\'name\'>" + alarmName + "&nbsp</div>");
	newAlarm.append("<div class=\'time\'>" + time + "</div>")
	var newDeleteButton = $("<button style='margin-left:10px'>Delete</button>");
	newDeleteButton.attr("onclick", "deleteAlarm('" + time + "','" + alarmName + "','" + numAlarmInsertions + "')");
	newAlarm.append(newDeleteButton);
	$("#alarms").append(newAlarm);
}

function addAlarm() {
	var hours = $("#hours option:selected").text();
	var mins = $("#mins option:selected").text();
	var ampm = $("#ampm option:selected").text();
	var alarmName = $("#alarmName").val();
	
	var AlarmObject = Parse.Object.extend("Alarm");
	var alarmObject = new AlarmObject();
	var time = hours + ":" + mins + ampm;
	alarmObject.save({
		"time": time, 
		"alarmName": alarmName}, {
		success: function(object) {
			insertAlarm(time, alarmName);
			hideAlarmPopup();
		},
		error: function(object, error) {
			alert("Failed to add alarm!");
		}
	});
}

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
			
			getAllAlarms();
});

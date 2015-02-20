var numAlarmInsertions = 0;

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '{your-app-id}',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

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

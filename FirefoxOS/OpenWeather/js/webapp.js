OpenWeatherMapDailyRequest = function(options) {
	this.url = options.url ? options.url : 'http://api.openweathermap.org/data/2.5/weather';
	this.units = options.units ? options.units : 'metric';
	this.city = options.city ? options.city : null;
	this.lat = options.lat ? options.lat : null;
	this.lon = options.lon ? options.lon : null;
	this.cityId = options.cityId ? options.cityId : null;
	this.response = null;
	
	this.getURL = function(){
		if (this.citiId != null){
			return this.url + "?id=" + this.cityId + "&units=" + this.units;
		}else if (this.city != null){
			return this.url + "?q=" + this.city + "&units=" + this.units;
		}else if( this.lat != null && this.lon != null){
			return this.url + "?lat=" + this.lat + "&lon=" + this.lon + 
				"&units=" + this.units;
		}else{
			throw new Error("Incorrect Request");
		}
	};
	
	this.call = function(){
		apiRequest(this);
	};
};

OpenWeatherMapForecastRequest = function(options) {
	this.url = options.url ? options.url : 'http://api.openweathermap.org/data/2.5/forecast/daily';
	this.units = options.units ? options.units : 'metric';
	this.days = options.days ? options.days : 5;
	this.city = options.city ? options.city : null;
	this.lat = options.lat ? options.lat : null;
	this.lon = options.lon ? options.lon : null;
	this.cityId = options.cityId ? options.cityId : null;
	this.response = null;
	
	this.getURL = function(){
		if (this.citiId != null){
			return this.url + "?id=" + this.cityId + "&units=" + 
			this.units + "&cnt=" + this.days;
		}else if (this.city != null){
			return this.url + "?q=" + this.city + "&units=" + 
				this.units + "&cnt=" + this.days;
		}else if( this.lat != null && this.lon != null){
			return this.url + "?lat=" + this.lat + "&lon=" + this.lon + 
				"&units=" + this.units + "&cnt=" + this.days;
		}else{
			throw new Error("Incorrect Request");
		}
	};
	
	this.call = function(){
		apiRequest(this);
	};
};

function apiRequest(request){
	var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open("GET", request.getURL(), true);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
        	console.log("Got response for " + request.getURL());
        	request.response = JSON.parse(xhr.response);
        }
    };

    xhr.onerror = function () {
    	alert("Failed to reach OpenWeatherMap.org API server");
    };
    
    xhr.send();
}

function renderResponse(request, dailyRequest){
	$('#accordion').html('');
	$('#results-container').html('');
	$('#location-display').val(request.response.city.name);
	$('#location-display').data('city-id', request.response.city.id);
	
	renderDailyResult(dailyRequest);
	
	$.each(request.response.list, function(i, el){
		renderAccordion(i, el, request.units);
	});
}

function renderProgressBar(time){
	// time is a number between 0 and 20
	var percentage = time * 100 / 20;
	var html = '';
	if (time >= 0 && time < 6){
		// normal
		html += '<div class="bar bar-success" style="width: ' + percentage + '%;"></div>';
	}else if (time >= 6 && time < 16){
		// warning
		percentage = percentage - 25;
		html += '<div class="bar bar-success" style="width: 25%;"></div>';
		html += '<div class="bar bar-warning" style="width: ' + percentage + '%;"></div>';
	}else if (time >= 16){
		//danger
		percentage = percentage - 80;
		html += '<div class="bar bar-success" style="width: 25%;"></div>';
		html += '<div class="bar bar-warning" style="width: 55%;"></div>';
		html += '<div class="bar bar-danger" style="width: ' + percentage + '%;"></div>';
	}
	
	$('#progress').html(html).show();
}

function renderDailyResult(request){
	var date = new Date();
	var day = date.getHours() <= 18 && date.getHours() > 6; // if we had sunset time
	var unit = request.units === 'metric' ? '°C' : '°F';
	var weather = request.response.weather[0];
	var iconCode = weather.icon.substring(0,2);
	var icon = day ? iconCode + "d.png" : iconCode + "n.png";
	var html = '<div class="well well-ffos"><img src="http://openweathermap.org/img/w/';
	html += icon;
	html += '" align="left"><div class="temp-container"><span class="temp">';
	html += request.response.main.temp.toFixed() + unit;
	html += '</span><span class="min">';
	html += request.response.main.temp_min.toFixed() + unit;
	html += '</span><span class="max">';
	html += request.response.main.temp_max.toFixed() + unit;
	html += '</span></div></div>';
	$('#results-container').html(html);
}

function renderAccordion(index, obj, units){
	var date = new Date(obj.dt * 1000);
	var day = date.getHours() <= 18 && date.getHours() > 6; // if we had sunset time
	var unit = units === 'metric' ? '°C' : '°F';
	var weather = obj.weather[0];
	var iconCode = weather.icon.substring(0,2);
	var icon = day ? iconCode + "d.png" : iconCode + "n.png";
	var acc = '<div class="accordion-group-ffos"><div class="accordion-heading">';
	acc += '<a class="accordion-toggle" data-toggle="collapse" ';
	acc += 'data-parent="#accordion" href="#collapse-';
	acc += index;
	acc += '"><img src="http://openweathermap.org/img/w/';
	acc += icon;
	acc += '" align="left">';
	acc += '<div><div class="date">';
	acc += date.toUTCString().substring(0,17).trim(); // this will fail for some edge case
	acc += '</div><div class="weather">';
	acc += weather.main + ' <span class="temp">' + obj.temp.day.toFixed() + unit + '</span>';
	acc += '</div></div></a></div><div id="collapse-';
	acc += index;
	acc += '" class="accordion-body collapse"><div class="accordion-inner">';
	acc += '<p>Minimum: <span class="min">' + obj.temp.min.toFixed() + unit + '</span></p>';
	acc += '<p>Maximum: <span class="max">' + obj.temp.max.toFixed() + unit + '</span></p>';
	acc += '<p>Pressure: ' + obj.pressure + 'hpa</p>';
	acc += '<p>Humidity: ' + obj.humidity + '%</p>';
	acc += '<p>Wind: ' + obj.speed + 'm/s, ' + obj.deg + '°</p>';
	acc += '</div></div></div>';
	acc += '';
	$('#accordion').append(acc);
}

function clearSearchOptions(){
	window.lastCall = null;
	$('#location-display').removeData('lat').removeData('lon').removeData('city-id');
}

var debugDailyResponse = {
	name: 'debug',
	dt: 1369147271,
	id: 2643743,
	cod: 200,
	main: {
		temp: 286.48,
		pressure: 1017,
		temp_min: 284.82,
		temp_max: 288.15,
		humidity: 74
	},
    weather: [
        {
        	id: 802,
        	main: "Clouds",
        	description: "scattered clouds",
        	icon: "03d"
        }
    ]
};

var debugForecastResponse = {
	city: {
		id: 524901,
		name: "debug",
	},
	list: [
		{
			dt: 1369126800,
			temp: {
				day: 17.17,
				min: 13.39,
				max: 17.17,
			},
			pressure: 1005.18,
			humidity: 66,
			weather: [
				{
					id: 803,
					main: "Clouds",
					icon: "04d"
				}
			],
			speed: 3.22,
			deg: 112,
		},{
			dt: 1369213200,
			temp: {
				day: 17.17,
				min: 13.39,
				max: 17.17,
			},
			pressure: 1005.18,
			humidity: 66,
			weather: [
				{
					id: 803,
					main: "Clouds",
					icon: "04d"
				}
			],
			speed: 3.22,
			deg: 112,
		},
    ]
};

(function() {
	// set a global var with the last request date
	// with this we can check when to call the API again
	window.lastCall = null; 
	
	var locationDisplay = $('#location-display');
	
	$(locationDisplay).click(function(){
		$(this).val('');
	});
	
	$('#location-button').click(function(){
		$('#location-button').prop('disabled', true);
		navigator.geolocation.getCurrentPosition(function (position) {
			clearSearchOptions();
			var location = position.coords.latitude + ", " + position.coords.longitude;
			locationDisplay.val(location);
			locationDisplay.data('lat', position.coords.latitude);
			locationDisplay.data('lon', position.coords.longitude);
			$('#location-button').prop('disabled', false);
		},function (position) {
			alert("Failed to get your current location.");
			$('#location-button').prop('disabled', false);
        });
	});
	
	locationDisplay.change(function(){
		clearSearchOptions();
	});
	
	$('#search-button').click(function(){
		
		var now = new Date();
		if( window.lastCall != null ){
			var interval = now - window.lastCall;
			if (interval < 600000){ //10 minutes
				console.log("No need to call the API again");
				var timeleft = 10 - (interval / 60000 );
				alert("To reduce load on the OpenWeatherMap.org API you're only allowed to check the weather every 10 minutes. Please wait " + timeleft.toFixed() + " minutes and try again");
				return false;
			}
		}
		
		var dailyRequest = new OpenWeatherMapDailyRequest({});
		var request = new OpenWeatherMapForecastRequest({});
		var location = locationDisplay.val();
		
		if ( location === 'debug' ){
			dailyRequest.response = debugDailyResponse;
			request.response = debugForecastResponse;
			renderResponse(request, dailyRequest);
			return false;
		}
		
		if( $('#imperial-button').hasClass('active') ){
			dailyRequest.units = 'imperial';
			request.units = 'imperial';
		}else{
			dailyRequest.units = 'metric';
			request.units = 'metric';
		}
		
		if ( locationDisplay.data('city-id') != undefined ){
			dailyRequest.cityId = locationDisplay.data('city-id');
			request.cityId = locationDisplay.data('city-id');
		}
		
		if (locationDisplay.data('lat') == null){
			dailyRequest.city = location;
			request.city = location;
		}else{
			dailyRequest.lat = locationDisplay.data('lat');
			dailyRequest.lon = locationDisplay.data('lon');
			request.lat = locationDisplay.data('lat');
			request.lon = locationDisplay.data('lon');
		}
		
		console.log("Getting Forecast data from " + request.getURL());
		
		dailyRequest.call();
		request.call();
		
		var tries = 0;
		var intervalID = window.setInterval(function(){
			if (request.response != null && dailyRequest.response != null){
				console.log("Got the responses");
				try{
					renderResponse(request, dailyRequest);
				}catch(err){
					alert("Woops. Something failed. Try again later.");
					console.log(err);
				}finally{
					window.clearInterval(intervalID);
					window.lastCall = new Date();
					$('#progress').hide();
				}
			}else if ( tries === 20){
				$('#progress').hide();
				alert("Failed to reach OpenWeatherMap.org API server after 20 seconds");
				window.clearInterval(intervalID);
			}else{
				console.log("Checking for response try " + tries);
				tries++;
				renderProgressBar(tries);
			}
		}, 1000);
	});
	
})();

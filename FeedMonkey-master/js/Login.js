function Login(app) {
	this.app = app;
	if(!this.is_logged_in()) {
		this.log_in();
		if(!this.onLine()) alert("You need to be on line to log in to your server.");
	}
	else this.app.after_login(localStorage.backend);
};

Login.prototype.onLine = function() {
	return navigator.onLine;
};

Login.prototype.is_logged_in = function() {
	return localStorage.backend && localStorage.server_url && localStorage.session_id;
};

Login.prototype.log_in = function() {
	this.app.changeToPage("#login");
	$("#login form").backend.forEach(function(o, i) {
		o.addEventListener("change", function(e) {
			if(e.target.checked) {
				if(e.target.value == "OwnCloud") {
					$("#url").placeholder = "http://example.com/owncloud/";
				} else if(e.target.value == "Pond") {
					$("#url").placeholder = "http://example.com/pond/";
				} else {
					$("#url").placeholder = "http://example.com/tt-rss/";
				}
			}
		});
	});
	$("#login form").addEventListener('submit', this.authenticate.bind(this));
};

Login.prototype.authenticate = function(e) {
	// do not reload page
	e.preventDefault();
 	e.stopPropagation();

 	var backend = "TinyTinyRSS";
 	if($("#login form").backend[1].checked) backend = "OwnCloud";
 	else if($("#login form").backend[2].checked) backend = "Pond";

	var server_url = $("#url").value;
	var user = $("#un").value;
	var password = $("#pw").value;

	if(!this.onLine()) {
		alert("You need to be on line to log in to your server.");
		return false;
	}

	var errs = [];
	if(!server_url || server_url.indexOf("http") != 0) errs.push("add a server url that starts with http");
	if((user && !password) || (!user && password)) errs.push("add both username and password or neither");

	if(errs.length > 0) {
		alert("Please " + errs.join(",\n") + ".");
		return false;
	} 

	var _this = this;

	if(backend == "OwnCloud") {
		OwnCloud.login(server_url, user, password, function(data) {
			if(data.version) {
				var auth = btoa(user + ':' + password);
				localStorage.server_url = server_url;
                                localStorage.username = user;
				localStorage.session_id = auth;
				localStorage.backend = "OwnCloud";
				_this.app.after_login(localStorage.backend);

				$("#url").value = "";
				$("#un").value = "";
				$("#pw").value = "";
			} else {
				alert("Something went wrong, please check every input field and try again.");
			}
		});
	} else if(backend == "Pond") {

		Pond.login(server_url, user, password, function(data) {
			if(data.session_token) {
				localStorage.server_url = server_url;
                                localStorage.username = user;
				localStorage.session_id = data.session_token;
				localStorage.backend = "Pond";
				_this.app.after_login(localStorage.backend);

				$("#url").value = "";
				$("#un").value = "";
				$("#pw").value = "";
			}
		});

	} else {
		TinyTinyRSS.login(server_url, user, password, function(data) {
			if(data.error) {
				if(data.error == "API_DISABLED") {
					alert("You need to enable API access in your TTRSS preferences.\n\nTo do so go to your server log in and then in Preferences -> General -> Enable API access. Check the box and save. Then try again to log in.")
				} else if(data.error == "LOGIN_ERROR") {
					alert("Login error\n\nIt seems you provided a wrong username or password.")
				} else {
					alert(data.error);
				}

			} else {
				localStorage.server_url = server_url;
                                localStorage.username = user;
				localStorage.session_id = data.session_id;
				localStorage.backend = "TinyTinyRSS";
				_this.app.after_login(localStorage.backend);
				
				$("#url").value = "";
				$("#un").value = "";
				$("#pw").value = "";
			}
		});
	}

	return false;
};

Login.prototype.fillLoginFormFromLocalStorage = function() {
        var serverUrl = localStorage.server_url;
        if (serverUrl) {
            $("#url").value = serverUrl;
        }
        var userName = localStorage.username;
        if (userName) {
            $("#un").value = userName;
        }
        var backendName = localStorage.backend;
        if (backendName === "TinyTinyRSS") {
            $("#login form").backend[0].checked = true;
        }
        else if (backendName === "OwnCloud") {
            $("#login form").backend[1].checked = true;
        }
        else if (backendName === "Pond") {
            $("#login form").backend[2].checked = true;
        }
}

Login.prototype.log_out = function() {
        this.fillLoginFormFromLocalStorage();
	localStorage.removeItem("server_url");
	localStorage.removeItem("session_id");
	localStorage.removeItem("unread_articles");
	this.log_in();
}
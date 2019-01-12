var request;

function Main(){
	this.LoadRegistrationPage = function(e){
		request = new HTTPRequest();
		document.getElementById("registration-form").onsubmit = function(){
			request.SignOn("script/register.php");
			return false;
		}
	}

	this.LoadLoginPage = function(e){
		request = new HTTPRequest();		
		document.getElementById("login-form").onsubmit = function(){
			request.SignOn("script/login.php");
			return false;
		}
	}

	this.LoadProfilePage = function(e){
		request = new HTTPRequest();		
		document.getElementById("profile-form").onsubmit = function(){
			request.UpdateProfile("script/profile_update.php");
			return false;
		}
	}

	this.JSONHandler = function(e, f){
		try{
			JSON.parse(e);
			e = JSON.parse(e);
		}
		catch(exp){
			request.Switch(request.text_, request.loader);
			return console.log(e);
		}
		f(e);
	}

	this.validateEmail = function(email){
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		    return (true);
		return (false);
	}
}

function HTTPRequest(){
	this.loader = $("#submit-loader");
	this.text_ = $("#submit-text");
	this.clickable = true;

	this.SignOn = function(url){
		if (!this.clickable) return false;
		new Alert().Reset();

		var email = $("#email").val();
		var password = $("#password").val();

		if (!(new Main().validateEmail(email)))
			return new Alert().Error("Invalid email address!");

		if (password.length < 6)
			return new Alert().Error("Minimum password length of 6!");

		this.Switch(this.loader, this.text_);

		$.ajax({
		    type: "POST",
		    'url': url,
		    data: {
		    		"email": email,
		    		"password": password,
		    	  },
		    success: function(data) {
		    	request.Success(data);
			},
			error: function(){
				request.Error();
		   	}
		});
		return false;
	}

	this.UpdateProfile = function(url){
		if (!this.clickable) return false;
		new Alert().Reset();

		var surname = $("#surname").val();
		var name = $("#first-name").val();
		var otherNames = $("#other-names").val();
		var country = $("#country").val();
		var state = $("#state").val();
		var phone = $("#phone").val();

		if (surname == "") return new Alert().Error("Enter surname!");
		if (name == "") return new Alert().Error("Enter first name!");
		if (phone == "") return new Alert().Error("Enter phone number!");
		if (state == 0) return new Alert().Error("Select State!");

		this.Switch(this.loader, this.text_);

		$.ajax({
		    type: "POST",
		    'url': url,
		    data: {
		    		"surname": surname,
		    		"name": name,
		    		"other-names": otherNames,
		    		"country": country,
		    		"state": state,
		    		"phone": phone,
		    	  },
		    success: function(data) {
			    request.Success(data);
			},
			error: function(){
				request.Error();
		   	}
		});
		return false;
	}

	this.Success = function(data){
		new Main().JSONHandler(data, function(data){
    		if (data.key > 0) new Alert().Success(data.response);
    		else new Alert().Error(data.response);

    		if (data.key == 10 || data.key == 11 || data.key == 14){
    			window.location.replace("dashboard.php");
    		}
    		else{
    			request.Switch(request.text_, request.loader);
    		}
    	});
	}

	this.Error = function(){
		new Alert().Error("Connection error!");
		request.Switch(request.text_, request.loader);
	}

	this.SwitchLoader = function(e1, e2){
		e2.addClass("d-none");
		e1.removeClass("d-none");
	}

	this.SwitchClickable = function(){
		this.clickable = !this.clickable;
		return this.clickable;
	}

	this.Switch = function(e1, e2){
		this.SwitchLoader(e1, e2);
		this.SwitchClickable();
	}

	this.Reset = function(){
		$("#password").val("");
	}
}

function Alert(){
	var alertBox = $("#alert-box");
	
	this.Reset = function(){
		alertBox.removeClass("d-none");
		alertBox.hide(0);
	}

	this.Success = function(msg){
		alertBox.removeClass("alert-danger");
		alertBox.addClass("alert-success");
		alertBox.text(msg);
		alertBox.show(10);
		document.body.scrollTop = 0; // For Safari
  		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		return true;
	}

	this.Error = function(msg){
		alertBox.removeClass("alert-success");
		alertBox.addClass("alert-danger");
		alertBox.text(msg);
		alertBox.show(10);
		document.body.scrollTop = 0; // For Safari
  		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		return false;
	}
}
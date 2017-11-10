function changeSlide(){
  navigator.requestWakeLock('screen');
  var deviceSpecs
  if(navigator.userAgent.indexOf("LG-D300")>=0){
    deviceSpecs = '#lgSpecs';
  } else if(navigator.userAgent.indexOf("ALCATEL ONE TOUCH 4012")>=0)  {
    deviceSpecs = '#alcatelSpecs';
  } else if(navigator.userAgent.indexOf("ZTEOPEN")>=0) {
	deviceSpecs = '#zteSpecs';
  } else {
    deviceSpecs = '#unsupported';
  }

  showFox(deviceSpecs);
  setInterval(function(){internalChange(deviceSpecs);}, 50000);
}

function internalChange(deviceSpecs){
  showFox(deviceSpecs);
  setTimeout(function(){showSpecs(deviceSpecs);}, 15000);
}

function showFox(deviceSpecs){
  var foxy = $("#foxy");
  var specs = $("#specs");  
  var deviceSpecs = $(deviceSpecs);
  foxy.css("left", "50px");
  specs.css("left", "-500px");
  deviceSpecs.css("display", "none");
}

function showSpecs(deviceSpecs){
  var foxy = $("#foxy");
  var specs = $("#specs");  
  var deviceSpecs = $(deviceSpecs);  

  foxy.css("left", "-500px");
  specs.css("left", "0px");
  deviceSpecs.css("display", "block");
}

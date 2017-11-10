/*
 Copyright 2012 Andres Leonardo Martinez Ortiz

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
"use strict";
/*
 * Bv4H5 class
 */
var Bv4H5 = {

    btnSendSMS : document.getElementById("btnSendSMS"),
    btnGetGeoInfo: document.getElementById("btnGetGeoInfo"),
    appURL: "http://localhost:8888",

    sendSMS:function () {
        alert("SMS sent");
    },

    getGeoInfo:function () {

        console.log("Calling getGeoInfo")

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Calling showPosition")

                $('#geo_info').html = "Latitude: " + position.coords.latitude + " / "+"Longitude: " + position.coords.longitude;

            }, function(positionerror){
                console.error("Error calling getCurrentPosition:" + positionerror.message);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            console.log("Geolocation is not supported by this browser.");
        }
    },

    install: function (){
        var request = window.navigator.mozApps.install(this.appURL+'/manifest.webapp');

        request.onsuccess = function () {
            console.log("Bv4H5 installed!");
        };

        request.onerror = function () {
            alert("You got some errors installing Bv4H5 " + request.error.name);
            console.error("You got some errors installing Bv4H5:" + request.error.name);
        };
    },

    uninstall: function (){
        var request = window.navigator.mozApps.getInstalled();

        request.onerror = function() {
            alert("Error calling getInstalled: " + request.error.name);
            console.log("Error calling getInstalled: " + request.error.name);
        };

        request.onsuccess = function() {
            var appsRecord = request.result;
            for (var i=0; i < appsRecord.length; i++){
                if (appsRecord[i].origin==Bv4H5.appURL){
                    appsRecord[i].uninstall();
                    console.log("Application Bv4H5 uninstalled!");
                    break;
                }
            }
        };
    },

    init:function (){
        this.btnSendSMS.onclick = this.sendSMS;
        this.btnGetGeoInfo.onclick = this.getGeoInfo;

        // Installation
        if (window.navigator.mozApps){

            var request = window.navigator.mozApps.getSelf();
            var install_info = document.getElementById("install_info");

            request.onsuccess = function() {
                if (request.result) {
                    $('#install_info').html = "<button onclick='Bv4H5.uninstall()'>Click to Uninstall</button>";
                } else {
                    $('#install_info').html = "<button onclick='Bv4H5.install()'>Click to Install</button>";
                }
            }

            request.onerror = function() {
                alert("Error checking installation status: " + this.error.message);
                console.log("Error checking installation status: " + this.error.message);
            }
        }
        // Battery
        var battery = document.getElementById("battery_info");
        battery.innerHTML = "Battery level: "+(navigator.battery.level*100).toString()+"%";
        $('#test').html("Getting test...");


    }
};

/*
 * Events handler initialization
 */

//window.addEventListener('load', function bv4h5Load(evt) {
//    window.removeEventListener('load', bv4h5Load);//??
//    Bv4H5.init();
//});
$(document).ready(Bv4H5.init());

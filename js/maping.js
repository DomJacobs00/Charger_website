document.addEventListener('DOMContentLoaded', getLocation);
document.addEventListener('DOMContentLoaded', fetchChargerData);
let lat;
let lon;


function getLocation(callback) {
    positionCallback = callback;
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else
    {
        document.getElementById('location').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
     lat = position.coords.latitude;
     lon = position.coords.longitude;

    updateLocation(lat, lon);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('location').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location').innerHTML = "An unknown error occurred.";
            break;
    }
}

function updateLocation(lat, lng) {
    map.setView([lat, lng], 13);
}
function fetchChargerData()
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'fetchChargerData.php');

    xhr.onreadystatechange = function()
    {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE)
        {
            if(xhr.status === OK)
            {
                let results = JSON.parse(xhr.responseText);
                //console.log(obj.coordinates);//json data is accessed in JavaScript

                results.forEach(function(obj){

                    var marker = L.marker([obj.latitude, obj.longtitude]).addTo(map).bindPopup('<p>Adress:' + obj.address + '<br />PostCode: ' + obj.postCode + '<br />Price: £' + obj.cost + 'kw/h<br /><a href="#" onclick="contact('+obj.ownerID+'); return false;">Contact Owner</a></p>');

                })



            }
            else
            {
                console.log("Request failed.", xhr.status);
            }
        }

    };
    xhr.send(null);
}
function contact(ownerID)
{
    //alert("contact me action triggered");
    window.location.href="contact.php?ownerID=" + ownerID;
}







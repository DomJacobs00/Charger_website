document.addEventListener('DOMContentLoaded', getLocation);
document.addEventListener('DOMContentLoaded', fetchChargerData);
let lat;
let lon;
let jsonData;

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
    //document.getElementById('location').innerHTML = `Latitude: ${lat}<br>Longitude: ${lon}`;
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
                console.log(xhr.responseText);//json data is accessed in JavaScript


            }
            else
            {
                console.log("Request failed.", xhr.status);
            }
        }

    };
    xhr.send(null);
}

//try
//{
//    const jsondataObject = JSON.parse(jsonData);
//    jsondataObject.forEach(element =>
//    {
//        console.log(element.id);
//    });
//
//}
//catch (error)
//{
//    console.error('problem: ', error);
//}






// waits for the DOM to load and then calls the getLocation and fetchChargerData functions
document.addEventListener('DOMContentLoaded', getLocation);
document.addEventListener('DOMContentLoaded', fetchChargerData);
// variables to store latitude and longtitude of the user
let lat;
let lon;
/**
 * Addition of a custom icon
 */
var icon = L.Icon.extend({
   options: {
       shadowUrl: '../leaflet/images/marker-shadow.png',
       iconSize: [45,80],
       shadowSize: [50,64],
       iconAnchor: [22, 94],
       shadowAnchor: [4, 62],
       popupAnchor: [-3, -76]
   }
});
var customIcon = new icon({iconUrl:'../images/marker.png'});
/**
 *
 * Function that collects user's location using Geolocation API
 */
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

/**
 *
 * function is called when the user's location is successfully retreived
 */
function showPosition(position) {
     lat = position.coords.latitude; // stores the latitude of the user
     lon = position.coords.longitude; // stores the longtitude of the user

    updateLocation(lat, lon); // passes the lon and lat to updateLocation function
}

/**
 *
 * Error handling function
 */
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

/**
 * Changes the maps view coordinates to the aquired users coordinates
 * @param lat
 * @param lng
 */
function updateLocation(lat, lng) {
    map.setView([lat, lng], 13);
}

/**
 * aquires the data required in JSON format to be used in the map markers or any other way.
 * Using AJAX techniques the charger data is fetched from the database and converted in JSON format.
 * Additionally, all the data is displayed using markers
 */
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

                    var marker = L.marker([obj.latitude, obj.longtitude], {icon:customIcon}).addTo(map).bindPopup('<p>Adress:' + obj.address + '<br />PostCode: ' + obj.postCode + '<br />Price: £' + obj.cost + 'kw/h<br /><a href="#" onclick="contact('+obj.ownerID+'); return false;">Contact Owner</a></p>');

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

/**
 * Function that only activates when user clicks 'Contact Owner' button which passes the ownerID and
 * redirects user to a contact page.
 * @param ownerID
 */
function contact(ownerID)
{

    window.location.href="contact.php?ownerID=" + ownerID;
}

/**
 * Addition of a current location button which utilizes DomUtil to display an image that
 * when clicked uses the latitude and longtitude collected to update the view location.
 */
var buttonLocation = L.control({
    position: 'bottomleft'
});
buttonLocation.onAdd = function (map) {
    // Create a new button element
    var button = L.DomUtil.create('img', 'my-image-class');

    // Set the text of the button
    button.src = '../images/icons8-my-location-32.png';

    // Add a click event listener to the button
    L.DomEvent.addListener(button, 'click', function () {
        // Handle the button click event
        updateLocationWithCheck();
    });

    // Return the button element
    return button;
};
buttonLocation.addTo(map);

/**
 * Checks that the latitude and longtitude is obtained and updates the location
 */
function updateLocationWithCheck()
{
    if(typeof lat !== 'undefined' && lon !== 'undefined')
    {
        updateLocation(lat, lon);
    }
    else
    {
        alert('latitude and longtitude is not accessible now. Refresh your page or allow the website to use location.');
    }
}

/**
 * Input field that is used for searching chargers.
 */
var searchField = L.control();
searchField.onAdd = function(map){
    var container = L.DomUtil.create('div', 'input-group mb-3');
    var input = L.DomUtil.create('input', 'form-control');
    input.type = 'text';
    input.placeholder = 'Search';
    // addition of suggestion box
    var suggestionBox = L.DomUtil.create('div', 'suggestion-box');
    container.appendChild(suggestionBox);
    L.DomEvent.addListener(input, 'keyup', function(){
        var keywords = input.value;
        //locator(keywords);
        if(keywords == 0)
        {
            suggestionBox.style.display = 'none';
        }
        else
        {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function()
            {
                if(this.readyState ==4 && this.status == 200)
                {

                    var data = JSON.parse(this.responseText);
                    suggestionBox.innerHTML = "";
                    for(var i=0; i < data.length; i++)
                    {
                        var suggestion = document.createElement('div');
                        suggestion.classList.add('suggestion');
                        suggestion.innerHTML = data[i].address +", "+ data[i].postCode;
                        suggestion.setAttribute('lat', data[i].latitude);
                        suggestion.setAttribute('lon', data[i].longtitude);
                        suggestionBox.appendChild(suggestion);
                    }
                }
                suggestionBox.style.display = 'block';
            };
            xmlhttp.open("GET", "../lookup.php?keyword="+keywords, true);
            xmlhttp.send();
        }

    });
    suggestionBox.addEventListener('click', function(e)
    {
        // getting the coordinates of the charging point
        var lattemp = e.target.getAttribute('lat');
        var lontemp = e.target.getAttribute('lon');
        // change the location
        updateLocation(lattemp, lontemp);
        suggestionBox.style.display = 'none';
    })
    container.appendChild(input);
    return container;
}
searchField.addTo(map);







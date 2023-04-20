// waits for the DOM to load and then calls the getLocation and placeChargersOnMap functions
document.addEventListener('DOMContentLoaded', getLocation);
document.addEventListener('DOMContentLoaded', placeChargersOnMap);


/**
 * variables to store latitude and longtitude of the user
 */
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
 * Function is called when the user's location is successfully retrieved.
 */
function showPosition(position) {
     lat = position.coords.latitude; // stores the latitude of the user
     lon = position.coords.longitude; // stores the longtitude of the user

    updateLocation(lat, lon); // passes the lon and lat to updateLocation function
}

/**
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
    return new Promise((resolve, reject) =>
    {
        xhr.onreadystatechange = function()
        {
            const DONE = 4;
            const OK = 200;
            if(xhr.readyState === DONE)
            {
                if(xhr.status=== OK)
                {
                    let results = JSON.parse(xhr.responseText);
                    resolve(results);
                }
                else
                {
                    reject(new Error('Request Failed'));
                }
            }
        };
        xhr.send(null);
    });
}
function chargerLookup(keywords)
{
    const DONE = 4;
    const OK = 200;
    return new Promise((resolve, reject) =>{
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.status == OK)
            {
                if(this.readyState == DONE)
                {
                    resolve(JSON.parse(this.responseText));
                }
            }
        };
        xmlhttp.open('GET', '../lookup.php?keyword='+keywords, true);
        xmlhttp.send();
    });
}
function placeChargersOnMap()
{

    fetchChargerData().then(results => {
        let jsonData = results;
        jsonData.forEach(function(obj){

            var marker = L.marker([obj.latitude, obj.longtitude], {icon:customIcon}).addTo(map).bindPopup('<p>Address: ' + obj.address + '<br />PostCode: ' + obj.postCode + '<br />Price: £' + obj.cost + 'kw/h<br /><a href="#" onclick="window.location.href=\'contact.php?ownerID=' + obj.ownerID + '\'">Contact Owner</a></p>');

        });
    }).catch(error => {

    });

}

/**
 * Function that only activates when user selects charger which passes the ownerID and
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
    L.DomEvent.addListener(input, "keyup", function (){
        var keywords = input.value;
        if(keywords == 0)
        {
            suggestionBox.style.display = "none";
        }
        else
        {
            chargerLookup(keywords).then(data=> {
                suggestionBox.innerHTML = "";
                for (var i = 0; i < data.length; i++)
                {
                    const pointlat = data[i].latitude;
                    const pointlon = data[i].longtitude;
                    const userlat = lat;
                    const userlon = lon;
                    const distance = distanceCalculator(userlat, userlon, pointlat, pointlon);
                    var suggestion = document.createElement("div");
                    suggestion.classList.add("suggestion");
                    suggestion.innerHTML = data[i].address +", "+ data[i].postCode+', '+distance+" miles";
                    suggestion.setAttribute('lat', data[i].latitude);
                    suggestion.setAttribute('lon', data[i].longtitude);
                    suggestionBox.appendChild(suggestion);
                }
                suggestionBox.style.display = "block";
            })
                .catch(error => {
                    console.error("issue with getting data.");
                });
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
/**
 * Addition of a popup button for window to the map
 */
var popupButton = L.control({
    position: 'topleft'
});
popupButton.onAdd = function (map)
{
    var buttonForPopup = L.DomUtil.create('button', 'popupbutton btn btn-light');
    buttonForPopup.textContent = '>';
    var popup = document.getElementById("popup");
    var mapElement = document.getElementsByClassName("map-container");
    L.DomEvent.addListener(buttonForPopup, 'click', function (){
        try{
            if(popup.style.display === "none")
            {
                popup.style.display = "block";
                mapElement.style.flex = "3";


            }
            else
            {
                popup.style.display = "none";
                mapElement.style.flex = "auto";


            }
        }
        catch (error)
        {
        }

    });
    /**
     * For a reason unkown to me and the internet this does not work together with
     * the popup window, hence an aditional method to handle how the button looks is
     * created
     */
    L.DomEvent.on(buttonForPopup, 'click', function (){
        if(popup.style.display !== "none")
        {
            buttonForPopup.textContent = '<';
        }
        else
        {
           buttonForPopup.textContent = '>';
        }

    });
    L.DomEvent.disableClickPropagation(buttonForPopup);
    map.getContainer().appendChild(buttonForPopup);
    return buttonForPopup;

}
map.addControl(popupButton);
/**
 * Functions that calculates the distances between the charge point and the user's location
 * first function is used to change degrees to radian
 * second function calculates the distance using Haversine formula
 * This is not entirelly acurate, as it does not interpret that the Earths shape is not a perfect sphere.
 * Additionally, this does not count in the roads, and the distances it would take by driving.
 */
function degreeToRadian(degree)
{
    return degree * (Math.PI / 180);
}
function distanceCalculator(lat1, lon1, lat2, lon2)
{

    const R = 3958.8; // Earth's radius in miles (approx)
    const latitude1 = degreeToRadian(lat1);
    const longtitude1 = degreeToRadian(lon1);
    const latitude2 = degreeToRadian(lat2);
    const longtitude2 = degreeToRadian(lon2);

    const dLat = latitude2 - latitude1;
    const dLon = longtitude2 - longtitude1;

    const a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.cos(latitude1) * Math.cos(latitude2) *
        Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
}

/**
 * Popup window's searchBar handling
 */
/*
Handling the dropDown menu
 */
function handleDropDownMenu()
{
    const dropDownMenuButton = document.getElementById('dropdownMenuButton');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const searchOption = document.getElementById('searchOption');
    dropDownMenuButton.addEventListener('click', () => {
        searchOption.classList.toggle('show');
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            dropDownMenuButton.textContent = event.target.textContent;
            searchOption.classList.remove('show');
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-toggle')) {
            searchOption.classList.remove('show');
        }
    });
}
handleDropDownMenu();

/**
 *
 * @param query
 * @param option
 * @returns {Promise<void>}
 * function that performs the search if query has input
 */
async function performSearch(query, option)
{
    if(!query)
    {
        renderResults([]); //clear the results if the query is empty
        return;
    }
    try{
        const data = await fetchChargerData();

        const filteredData = filterChargerData(data, query, option);
        renderResults(filteredData);
    }
    catch (error)
    {
        console.error("Error fetching charger data.")
    }
}

/**
 * Function that handles the search input and option selection
 */
function inputAndOptionHandler()
{
    const searchField = document.getElementById('searchField');
    const searchOption = document.getElementById('searchOption');
    const searchOptionButton = document.getElementById('dropdownMenuButton');

    let currentOption = searchOption.children[0].dataset.value;
    searchField.addEventListener('input', event =>
    {
       const query = event.target.value;
       performSearch(query, currentOption) //error handling
           .then(() =>
           {
               console.log('Search successfull');
           })
           .catch(error =>
           {
                console.error('Error during search');
           });
    });
    searchOption.addEventListener('click', event =>
    {
        if(event.target.classList.contains('dropdown-item'))
        {
            currentOption = event.target.dataset.value;
            searchOptionButton.textContent = event.target.textContent;
            const query = searchField.value;
            performSearch(query, currentOption)
                .then(() =>
                {
                    console.log('Search successfull');
                })
                .catch(error =>
                {
                    console.error('Error during search');
                });
        }
    });
}
inputAndOptionHandler();

/**
 *
 * @param data
 * @param query
 * @param option
 * @returns array of data
 * Function that filters the data with option and the query inputted.
 * Additionally, sorts the data, depending on what option was selected.
 * Finally, it returns an array to be further worked on by other functions.
 */
function filterChargerData(data, query, option)
{
    query = query.toLowerCase();
    const filteredData =  data.filter(item =>
    item[option] && item[option].toString().toLowerCase().includes(query)
    );
    // Sorting the filtered data
    filteredData.sort((a,b) =>
    {
        const aValue = a[option];
        const bValue = b[option];

        //for numerical values
        if(typeof aValue === 'number' && typeof bValue === 'number')
        {
            return aValue-bValue;
        }
        // for string values
        return aValue.toString().localeCompare(bValue.toString());
    });
    return filteredData;
}

/**
 *
 * @param data
 * renders the data into temporary div containers, with information that is only needed.
 */
function renderResults(data)
{
    const resultsContainer = document.getElementById('searchResultsContainer');
    resultsContainer.innerHTML = "";
    data.forEach(item =>
    {
        const distance= distanceCalculator(lat, lon, item.latitude, item.longtitude)
        const resultElement = document.createElement('div');
        resultElement.classList.add('result-item');
        resultElement.innerHTML = item.address +", "+ item.postCode +', £'+ item.cost+', '+distance+' miles';
        resultElement.addEventListener('click', function()
        {
            contact(item.ownerID);
        });
        resultsContainer.appendChild(resultElement);
    });
}










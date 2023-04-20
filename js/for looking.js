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
resultElement.innerHTML = item.address +", "+ item.postCode+', '+item.distance+" miles";
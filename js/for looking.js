function fetchOwnerDetails(ownerID)
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
        xmlhttp.open('GET', '../fetchUserData.php?keyword='+ownerID, true);
        xmlhttp.send();
    });
}
function contact(ownerID)
{
    // firstly getting the popup information is useful
    fetchOwnerDetails(ownerID).then(data=>
    {
        var ownerProfilePicture = document.getElementById('contact-profile-picture');
        ownerProfilePicture.src = data[0].profilePicture;
        var ownerName = document.getElementById('ownerName');
        ownerName.textContent = data[0].name;
        var ownerEmail = document.getElementById('ownerEmail');
        ownerEmail.textContent = data[0].username;
    })
    //handling of popups in both situations: when the popup for list search is open and when not

    var contactPopup = document.getElementById('contact-message');
    var popup = document.getElementById('popup');
    var mapElement = document.getElementsByClassName("map-container");
    if(contactPopup.style.display === "none")
    {
        contactPopup.style.display = "block";
        mapElement.style.flex = "3";
    }
    else if(contactPopup.style.display === "none" && popup.style.display ==="block")
    {
        contactPopup.style.display = "block";
        mapElement.style.flex = "2";
    }
    else
    {
        contactPopup.style.display = "none";
        mapElement.style.flex = "auto";

    }
    //handling the button click
    var sendButton = document.getElementById('send-message-button-popup');
    L.DomEvent.addListener(sendButton, 'click', function(event)
    {
        event.preventDefault();

        var ownerEmailGet = document.getElementById('ownerEmail');
        var messageInput = document.getElementById('message');
        var dateTimeInput = document.getElementById('dateTime');
        var messageValue = messageInput.value;
        var dateTimeValue = dateTimeInput.value;
        var ownerEmail =  ownerEmailGet.value;
        window.alert("Success! Message sent!");
        contactPopup.style.display = "none";
        mapElement.style.flex = "auto";
    });
}
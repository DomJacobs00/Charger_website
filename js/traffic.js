async function loadRegistration()
{
    try
    {
        const response = await fetch("registration.php");
        const data = await response.text();
        document.getElementById('content').innerHTML = data;
    }
    catch (error)
    {
        console.error('Error fetching content', error);
    }
}
<?php
session_start();

require_once ('Models/UsersDataSet.php');
require_once ('Models/ChargerDataSet.php');

/**
 * Using a limiter to limit unsuccessful login attempts
 */
$max = 3; // after 3 unsuccesful attempts timeout is activated
$timeout = 120; // time in seconds that user will not be able to login

/**
 * with the aquired username (email) and password
 * password is being hashed and used together with username to locate the user
 * in the database if exists
 * Upon succesful attemp to get the user a new session is started that stores users
 *  ID
 *  Username
 *  Real name
 *  Profile picture
 *  and redirected to myAccount.php for further use.
 */
if(!isset($_SESSION['login_attempts']))
{
    $_SESSION['login_attempts'] = 0;
    $_SESSION['first_attempt_time'] = time();
}
if($_SESSION['login_attempts'] >= $max)
{
    $time_passed = time() - $_SESSION['first_attempt_time'];
    if($time_passed < $timeout) // message while timeout is in action
    {
        die('Too many attempts. Please wait and try again later.');
    }
    else // when the timeout is finished
    {
        $_SESSION['login_attempts'] = 0;
        $_SESSION['first_attempt_time'] = time();
    }
}
if(isset($_POST["loginbutton"]))
{
    $view = new stdClass();
    $username = $_POST["username"];
    $password = $_POST["password"];
    $checkPassword = hash('sha1', $password);
    $login_details = new UsersDataSet();
    $view->login_details = $login_details->locateUser($username, $checkPassword);
    if(!empty($view->login_details)) // successfull scenario
    {
        $_SESSION["id"] = $view->login_details[0]->getUserId();
        $_SESSION["login"] = $username;
        $_SESSION["realName"] = $view->login_details[0]->getRealName();
        $_SESSION["profilePicture"] = $view->login_details[0]->getProfilePicture();
        $login_status = true; // session has kept active
        //header("location: myAccount.php"); // relocation
        echo '<script> window.location.href="map.php"</script>';
    }
    else
    {
        $login_status = false; // session stoped
        //header("location: index.php?wrongDetails");//error handling
        echo '<script> window.location.href="index.php?wrongDetails"</script>';
        $_SESSION['login_attempts']++;
        exit();
    }
}
/**
 * redirects to registration page
 */
if(isset($_POST["registerbutton"]))
{
    //header("location: registration.php");
    echo '<script> window.location.href="registration.php"</script>';
}
/**
 * stops the session anywhere and requires to log in again for futher use
 */
if(isset($_POST["logoutbutton"]))
{
    echo "logout user";
    unset($_SESSION["login"]);
    session_destroy();
    $login_status = false;
   //header("location: index.php");
    echo '<script> window.location.href="index.php"</script>';
}



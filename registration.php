<?php
require_once("logincontroller.php");
require_once ('Models/UsersDataSet.php');
$view = new stdClass();
$view->pageTitle = 'Registration';
$view->login_status = false;
if (isset($_POST["register_button"]))
{
    $username = $_POST["email"];
    $real_name = $_POST["name"];
    $password = $_POST["password"];
    // check if all details are entered
    if(empty($username))
    {
        header("location:registration.php?noUsername ");
    }
    elseif(empty($real_name))
    {
        header("location:registration.php?noRealName ");
    }
    elseif(empty($password))
    {
        header("location:registration.php?noPassword ");
    }
    elseif(empty($username) and empty($real_name) and empty($password))
    {
        header("location:registration.php?noInput ");
    }
    else
    {
        //Check if the email exists on the database
        $usernames = new UsersDataSet();
        $view->usernames = $usernames->checkIfUserExsists($username);
        if($view->usernames > 0)
        {
            echo 'Account with this username already exsists';
            $username = null;
            $real_name = null;
            $password = null;
        }
        // if no duplicate found creating a new entry of user in the database
        else
        {
            $usersDataSet = new UsersDataSet();
            $new_password = hash('sha1', $password);
            $view->usersDataSet = $usersDataSet->addUser( $username, $real_name, $new_password);
            header("location: index.php"); // replace this to window.location = "index.php"; with JavaScript
        }
    }
}
require_once('Views/registration.phtml');

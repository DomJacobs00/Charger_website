<?php
require_once("logincontroller.php");
require_once ('Models/UsersDataSet.php');
require_once ('Models/ChargerDataSet.php');
$view = new stdClass();
$view->pageTitle = 'My Account';
// Getting the user information for the 'Your details' section
$profilePic = $_SESSION["profilePicture"];
$realName = $_SESSION["realName"];
$email = $_SESSION["login"];
// check if a user has a charger or not
$userId = $_SESSION["id"];
$chargerCheck = new ChargerDataSet();
$view->chargerCheck = $chargerCheck->getChargerbyOwner($userId);
if(empty($view->chargerCheck))
{
    $chargerName = 'You have no chargers';
}
else
{
    $chargerName = '';
    $chargerId = $view->chargerCheck[0]->getId();
    $adress1 = $view->chargerCheck[0]->getAdress1();
    $adress2 = $view->chargerCheck[0]->getAdress2();
    $postCode = $view->chargerCheck[0]->getPostcode();
    $lat = $view->chargerCheck[0]->getLatitude();
    $longt = $view->chargerCheck[0]->getLongtitude();
    $cost = $view->chargerCheck[0]->getCost();
}
// editing the details of the charger
if (isset($_POST["update_detail"]))
{
    $option = $_POST['options'];
    $input = $_POST['update_input'];
    if(empty($input))
    {
        header("location: myAccount.php?invalidInput");
        exit();
    }
    if($option == 1)
    {
        $updateDetails = new ChargerDataSet();
        $updateDetails->updateChargerAdress1($chargerId, $input);
        header("location: myAccount.php");
        exit();
    }
    elseif ($option == 2)
    {
        $updateDetails = new ChargerDataSet();
        $updateDetails->updateChargerAdress2($chargerId, $input);
        header("location: myAccount.php");
        exit();
    }
    elseif ($option == 3)
    {
        $updateDetails = new ChargerDataSet();
        $updateDetails->updateChargerPostCode($chargerId, $input);
        header("location: myAccount.php");
        exit();
    }
    elseif($option == 4)
    {
        if(is_numeric($input))
        {
            $updateDetails = new ChargerDataSet();
            $updateDetails->updateChargerLatitude($chargerId, $input);
            header("location: myAccount.php");
            exit();
        }
        else
        {
            header("location: myAccount.php?invalidInput");
        }
    }
    elseif($option == 5)
    {
        if(is_numeric($input))
        {
            $updateDetails = new ChargerDataSet();
            $updateDetails->updateChargerLongtitude($chargerId, $input);
            header("location: myAccount.php");
            exit();
        }
        else
        {
            header("location: myAccount.php?invalidInput");
        }
    }
    elseif($option == 6)
    {
        if(is_numeric($input))
        {
            $updateDetails = new ChargerDataSet();
            $updateDetails->updateChargerCost($chargerId, $input);
            header("location: myAccount.php");
            exit();
        }
        else
        {
            header("location: myAccount.php?invalidInput");
        }
    }


}

// removing charger from the database
if (isset($_POST["charger_remove"]))
{
    $chargePointRemove = new ChargerDataSet();
    $view->chargePointRemove = $chargePointRemove->removeCharger($chargerId);
}
// adding a new charger to the database
if (isset($_POST["add_charger_button"]))
{
    //obtaining the entries from the website
    $adressLine1 = $_POST["adressline1"];
    $adressLine2 = $_POST["adressline2"];
    $postCode  = $_POST["postcode"];
    $latitude = $_POST["latitude"];
    $longtitude = $_POST["longtitude"];
    $cost  = $_POST["pricein"];
    $user = $_SESSION['login'];
    echo $adressLine1. $adressLine2. $postCode. $latitude. $longtitude. $cost;
    //check if the charge point with those details excists, if so break
    $chargePointCheck = new ChargerDataSet();
    $view->chargePointCheck = $chargePointCheck->checkIfChargerExsists($adressLine1);
    if($view->chargePointCheck > 0)
    {
        $adressLine1 == null;
        $adressLine2 == null;
        $postCode== null;
        $latitude== null;
        $longtitude == null;
        $cost == null;
        header("location: myAccount.php?duplicateFound");
        exit();
    }
    if($adressLine1 == null or $adressLine2 == null or $postCode== null or $latitude== null or $longtitude == null or $cost == null)
    {
        header("location: myAccount.php?noInput");
        exit();
    }
    //add the charger to the database if no duplicates found
    else
    {
        $foreign_key = $_SESSION["id"];
        $chargePointAddition = new ChargerDataSet();
        $view->chargePointAddition = $chargePointAddition->addChargePoint( $adressLine1, $adressLine2, $postCode, $latitude , $longtitude, $cost, $foreign_key);
        header("location: myAccount.php");
    }
}
require_once ('Views/myAccount.phtml');



















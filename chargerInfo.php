<?php
require_once ('Models/ChargerDataSet.php');
$view = new stdClass();
$view ->pageTitle = 'Charger Points';
$view->login_status = false;
require_once("logincontroller.php");
$chargerDataSet = new ChargerDataSet();
$view->chargerDataSet = $chargerDataSet->fetchAllChargerPoints();
/**
 * Whenever Find button is pressed keyword and an option chosen is taken and
 * $keyword as well as $option are created
 * before sending the variable to the ChargerDataSet's getChargerDetails method
 * for price (option 3) being numeric, if it is not small error is given to the user to change it
 */
if (isset($_POST['look_for_charger']))
{
    $keyword = $_POST['keyword'];
    $option = $_POST['options'];
    if($option == 3 and !is_numeric($keyword))
    {
        header("location: chargerinfo.php?notNumeric");
        exit();
    }
    else
    {
        $chargerDataSet = new ChargerDataSet();
        $view->chargerDataSet = $chargerDataSet->getChargerDetails($option, $keyword);
    }
}
/**
 * Upon locating the appropriate charge point ability to contact with a button is created
 * The button changes the page to contact.php and passes trhough an owner ID for locating the
 * owner and the charger.
 */
if(isset($_POST['contact']))
{
    $o_ID = $_POST['contact'];
    header("location: contact.php?ownerID=$o_ID");
}
require_once ('Views/chargerInfo.phtml');

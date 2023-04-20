<?php
$view = new stdClass();
$view->pageTitle = 'Find A Charger';
$view->login_status = false;
require_once("logincontroller.php");
$chargerDataSet = new ChargerDataSet();
$view->chargerDataSet = $chargerDataSet->fetchAllChargerPoints();
$profile_picture = $_SESSION["profilePicture"];
$real_name = $_SESSION["realName"];
require('Views/map.phtml');



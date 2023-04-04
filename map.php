<?php
$view = new stdClass();
$view->pageTitle = 'Map';
$view->login_status = false;
require_once("logincontroller.php");
$chargerDataSet = new ChargerDataSet();
$view->chargerDataSet = $chargerDataSet->fetchAllChargerPoints();
require('Views/map.phtml');



<?php
$view = new stdClass();
$view->pageTitle = 'Map';
$view->login_status = false;
require_once("logincontroller.php");
require_once ('Models/ChargerDataSet.php');
$chargerDataSet = new ChargerDataSet();
$view->chargerDataSet = $chargerDataSet->chargerToJson();

require('Views/map.phtml');

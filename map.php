<?php
$view = new stdClass();
$view ->pageTitle = 'Map';
$view->login_status = false;
require_once("logincontroller.php");



require_once ('Views/map.phtml');

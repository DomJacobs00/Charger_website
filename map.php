<?php
$view = new stdClass();
$view->pageTitle = 'Map';
$view->login_status = false;
require_once("logincontroller.php");
require('Views/map.phtml');

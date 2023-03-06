<?php
$view = new stdClass();
$view->pageTitle = 'Homepage';
$view->login_status = false;
require_once("logincontroller.php");
require('Views/index.phtml');

<?php
header('Content-Type: text/plain');
require_once("logincontroller.php");
$chargerDataSet = new ChargerDataSet();
$jsonData = $chargerDataSet->chargerToJson();
echo $jsonData;
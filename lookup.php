<?php
header('Content-Type: text/plain');
require_once("logincontroller.php");
$chargerDataSet = new ChargerDataSet();
$keyword = $_REQUEST["keyword"];
$return = "";
$jsonData = $chargerDataSet->chargerLookup($keyword);
if($keyword !== "")
echo json_encode( $jsonData);
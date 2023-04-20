<?php
header('Content-Type: text/plain');
require_once ("logincontroller.php");
$userDataSet = new UsersDataSet();
$id = $_REQUEST["keyword"];
$return = "";
$jsonData = $userDataSet->fetchUser($id);
if($id !== "")
echo json_encode( $jsonData);

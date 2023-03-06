<?php
$view = new stdClass();
$view ->pageTitle = 'Contact';
$view->login_status = false;
$owner_id = $_GET['ownerID'];
require_once("logincontroller.php");
require_once ('Models/UsersDataSet.php');
$users = new UsersDataSet();
$view->users = $users->fetchUser($owner_id);
$userName = $view->users[0]->getRealName();
/**
 * upon pressing the button user potentially will  send a message to the
 * owner of the charger with message and date.
 * Empty messages are prevented with error handling using noInput and confirming the message being sent with
 * sent
 */
if(isset($_POST['send_message']))
{
    $message = $_POST['message'];
    $dateNtime = $_POST['chargeDate'];
    if(empty($message)) {
        header("location: contact.php?ownerID=$owner_id&noInput");
        exit();
    }
    else
    {
        header("location: contact.php?ownerID=$owner_id&sent");
    }
}
require_once ('Views/contact.phtml');

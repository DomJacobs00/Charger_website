<?php

require_once ('Models/Database.php');
require_once ('Models/UserData.php');
require_once ('Models/ChargePointData.php');
class UsersDataSet
{
    protected $_dbHandle, $_dbInstance;

    public function __construct()
    {
        $this->_dbInstance = Database::getInstance();
        $this->_dbHandle = $this->_dbInstance->getdbConnection();
    }
    public function fetchAllUsers()
    {
        $sqlQuery = 'SELECT * FROM users';

        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute();

        $dataSet = [];
        while ($row = $statement->fetch())
        {
            $dataSet[] = new UserData($row);
        }
        return $dataSet;
    }
    /**
     * @param $username
     * @param $password
     * @return array
     * Function used for logging in
     * User inputs a username and a password
     * The password using logincontroller.php is hashed and checked with an SQL statement for matches which
     * are returned in an arraay.
     */
    public function locateUser($username, $password)
    {
        $sqlQuery = "SELECT * FROM users WHERE username = ? AND password = ?" ;
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($username, $password));
        $dataSet = [];
        while ($row = $statement->fetch())
        {
            $dataSet[] = new UserData($row);
        }
        return $dataSet;
    }
    /**
     * @param $_id
     * @return array
     * returns user and its data that is matching with the user ID supplied
     */
    public function fetchUser($_id)
    {
        $sqlQuery = 'SELECT * FROM users WHERE id = ?';
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_id));
        $dataSet = [];
        while ($row = $statement->fetch())
        {
            $dataSet[] = new UserData($row);
        }
        return $dataSet;
    }
    /**
     * @param $email
     * @return int
     * This function checks if the email is already in the database. If it is registration.php cannot create a new
     * user with that specific email.
     */
    public function checkIfUserExsists($email)
    {
        $sqlQuery = "SELECT * FROM users WHERE username = ?" ;
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($email));
        $dataSet = [];
        while ($row = $statement->fetch())
        {
            $dataSet[] = new UserData($row);
        }
        return sizeof($dataSet);
    }
    public function addUser( $_username , $_realName, $_password)
    {
        $profilePicture = 'https://dummyimage.com/104x104.png/ffffff/5fa2dd';
        $sqlQuery = "INSERT INTO users ( username, real_name, password, profile_photo) VALUES (?,?,?,?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_username,$_realName,$_password,$profilePicture));
    }
    public function changeUserName($_id,$_username)
    {
        $sqlQuery ="UPDATE users SET username = ? WHERE ('id' = ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_username,$_id ));
    }
    public function changeRealName($_id,$_realName)
    {
        $sqlQuery ="UPDATE users SET real_name = ? WHERE ('id' = ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_realName,$_id));
    }
    public function changePassword($_id,$_password)
    {
        $sqlQuery ="UPDATE users SET password = ? WHERE ('id' = ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_password,$_id));
    }
    public function changeProfilePicture($_id,$_profilePicture)
    {
        $id = $_id;
        $profilePicture = $_profilePicture;
        $sqlQuery ="UPDATE users SET profile_photo = '$profilePicture' WHERE ('id' = '$id')";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute();
    }



}
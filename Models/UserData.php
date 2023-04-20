<?php

class UserData implements JsonSerializable
{
    protected $_id, $_username , $_realName, $_password, $_profilePicture;

    public function __construct($dbRow)
    {
        $this->_id = $dbRow['id'];
        $this->_username = $dbRow['username'];
        $this->_realName = $dbRow['real_name'];
        $this->_password = $dbRow['password'];
        $this->_profilePicture = $dbRow['profile_photo'];
    }

    public function getUserId()
    {
        return $this->_id;
    }

    public function getUsername()
    {
        return $this->_username;
    }

    public function getRealName()
    {
        return $this->_realName;
    }

    public function getPassword()
    {
        return $this->_password;
    }

    public function getProfilePicture()
    {
        return $this->_profilePicture;
    }
    public function jsonSerialize() : array
    {
        return ['userID'=>$this->_id,
                'username'=>$this->_username,
                'name'=>$this->_realName,
                'profilePicture'=>$this->_profilePicture,];
    }
}
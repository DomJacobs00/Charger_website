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
    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->_id;
    }
    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->_username;
    }
    /**
     * @return mixed
     */
    public function getRealName()
    {
        return $this->_realName;
    }
    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->_password;
    }
    /**
     * @return mixed
     */
    public function getProfilePicture()
    {
        return $this->_profilePicture;
    }
    public function jsonSerialize() : array
    {
        return ['userID'=>$this->_id,'username'=>$this->_username,'name'=>$this->_realName,'profilePicture'=>$this->_profilePicture,];// TODO: Implement jsonSerialize() method.
    }
}
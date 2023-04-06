<?php

class ChargePointData implements JsonSerializable
{
    protected $_id, $_adress1, $_adress2, $_postcode, $_latitude, $_longtitude, $_cost, $_ownerId;

    public function __construct($dbRow)
    {
        $this->_id = $dbRow["id"] ;
        $this->_adress1 = $dbRow["adress1"];
        $this->_adress2 = $dbRow["adress2"];
        $this->_postcode = $dbRow["postcode"];
        $this->_latitude = $dbRow["lat"];
        $this->_longtitude = $dbRow["longt"];
        $this->_cost = $dbRow["cost"];
        $this->_ownerId = $dbRow["owner"];
    }
    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->_id;
    }
    /**
     * @return mixed
     */
    public function getAdress1()
    {
        return $this->_adress1;
    }
    /**
     * @return mixed
     */
    public function getAdress2()
    {
        return $this->_adress2;
    }
    /**
     * @return mixed
     */
    public function getPostcode()
    {
        return $this->_postcode;
    }
    /**
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->_latitude;
    }
    /**
     * @return mixed
     */
    public function getLongtitude()
    {
        return $this->_longtitude;
    }
    /**
     * @return mixed
     */
    public function getCost()
    {
        return $this->_cost;
    }
    /**
     * @return mixed
     */
    public function getOwnerId()
    {
        return $this->_ownerId;
    }

    public function jsonSerialize() : array
    {
        return ['id'=>$this->_id, 'address'=>$this->_adress1.', '.$this->_adress2, 'postCode'=>$this->_postcode,'latitude'=>$this->_latitude,'longtitude'=>$this->_longtitude,'cost'=>$this->_cost,'ownerID'=>$this->_ownerId,];// TODO: Implement jsonSerialize() method.
    }
}
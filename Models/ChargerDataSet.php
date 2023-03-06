<?php
require_once ('Models/Database.php');
require_once ('Models/ChargePointData.php');
class ChargerDataSet
{
    protected $_dbHandle, $_dbInstance;
    public function __construct()
    {
        $this->_dbInstance = Database::getInstance();
        $this->_dbHandle = $this->_dbInstance->getdbConnection();
    }
    /**
     * @param $adress
     * @return int
     * Uses the adress1 of the database to match with the input to find a match
     * If no match found returns as 0
     */
    public function checkIfChargerExsists($adress)
    {
        $sqlQuery = "SELECT * FROM charge_point WHERE adress1 = ?" ;
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($adress));
        $dataSet = [];

        while ($row = $statement->fetch())
        {
            $dataSet[] = new ChargePointData($row);
        }
        return sizeof($dataSet);
    }
    /**
     * @param $o_id
     * @return array
     * returns the number of charge points that the user with given id has
     */
    public function getChargerbyOwner($o_id)
    {
        $sqlQuery = "SELECT * FROM charge_point WHERE owner = ?";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($o_id));
        $dataSet = [];
        while ($row = $statement->fetch())
        {
            $dataSet[] = new ChargePointData($row);
        }
        return $dataSet;

    }
    public function fetchAllChargerPoints()
    {
        $sqlQuery = 'SELECT * FROM charge_point';

        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute();

        $chargeDataSet = [];
        while ($row = $statement->fetch())
        {
            $chargeDataSet[] = new ChargePointData($row);
        }
        return $chargeDataSet;
    }
    public function addChargePoint($_adress1, $_adress2, $_postcode, $_latitude, $_longtitude, $_cost, $_ownerId)
    {
        $sqlQuery = "INSERT INTO charge_point (adress1, adress2, postcode, lat, longt, cost, owner) VALUES (?,?,?,?,?,?,?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_adress1, $_adress2, $_postcode, $_latitude, $_longtitude, $_cost, $_ownerId));
    }
    public function updateChargerAdress1($_chargerId,$_adress1)
    {

        $sqlQuery = "UPDATE charge_point SET adress1 = ? WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_adress1,$_chargerId));

    }
    public function updateChargerAdress2($_chargerId,$_adress2)
    {
        $sqlQuery = "UPDATE charge_point SET adress2 = ? WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_adress2,$_chargerId));

    }
    public function updateChargerPostCode($_chargerId,$_postCode)
    {
        $sqlQuery = "UPDATE charge_point SET postCode = ? WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_postCode,$_chargerId));
    }
    public function updateChargerLatitude($_chargerId,$_lat)
    {
        $sqlQuery = "UPDATE charge_point SET lat = ?  WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_lat,$_chargerId));
    }
    public function updateChargerLongtitude($_chargerId,$_long)
    {
        $sqlQuery = "UPDATE charge_point SET longt = ? WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_long,$_chargerId));

    }
    public function updateChargerCost($_chargerId,$_cost)
    {
        $sqlQuery = "UPDATE charge_point SET cost = ? WHERE (id= ?)";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute(array($_cost,$_chargerId));

    }
    /**
     * mainly used for retreiving information from the charger database to the Find a Charger page.
     * SearchBy =
     * 1. search by adress
     * 2. search by postcode
     * 3. search by price
     */
    public function getChargerDetails($_searchBy, $_keyword)
    {
        $searchBy = $_searchBy;
        $keyword = $_keyword;
        if($searchBy == 'Search By')
        {
            $sqlQuery = 'SELECT * FROM charge_point ORDER BY adress1';
        }
        if($searchBy == 1)
        {
            $sqlQuery = "SELECT * FROM charge_point WHERE UPPER(adress1) LIKE UPPER('%$keyword%') ORDER BY adress1";


        }
        elseif($searchBy ==2)
        {
            $sqlQuery = "SELECT * FROM charge_point WHERE UPPER(postcode) LIKE UPPER('$keyword%') ORDER BY postcode";


        }
        elseif($searchBy ==3)
        {
            $sqlQuery = "SELECT * FROM charge_point WHERE cost = '$keyword' ORDER BY cost";
        }

        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute();

        $chargeDataSet = [];
        while ($row = $statement->fetch())
        {
            $chargeDataSet[] = new ChargePointData($row);
        }
        return $chargeDataSet;

    }
    /**
     * @param $id
     * @return void
     * Removes Charger from the database using it's id as an indicator
     */
    public function removeCharger($id)
    {
        $sqlQuery = "DELETE FROM charge_point WHERE id = '$id'";
        $statement = $this->_dbHandle->prepare($sqlQuery);
        $statement->execute();
    }
}
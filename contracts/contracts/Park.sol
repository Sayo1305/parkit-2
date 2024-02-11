// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ParkingContract {
    struct ParkingDetails {
        uint256 parkingId;
        string name;
        string place;
        string pincode;
        string imageHash; // Updated to string
        address creatorWallet;
        address buyerWallet;
        uint256 revenue; // New field to track revenue
        uint256 amount;
        string day;
        string time;
        bool available;
        bool completed;
    }

    mapping(address => uint256) public parkingIdByWallet;
    mapping(uint256 => ParkingDetails) public parkingSpaces;
    uint256 public counter;

    function storePark(
        string memory name,
        string memory place,
        string memory pincode,
        string memory imageHash, // Updated to string
        uint256 amount,
        string memory day,
        string memory time
    ) public {
        require(msg.sender.balance >= amount, "Insufficient balance");

        ParkingDetails storage details = parkingSpaces[counter];
        details.parkingId = counter;
        details.name = name;
        details.place = place;
        details.pincode = pincode;
        details.imageHash = imageHash; // Updated to string
        details.creatorWallet = msg.sender;
        details.amount = amount;
        details.day = day;
        details.time = time;
        details.available = true;
        details.completed = false;
        details.revenue = 0;

        parkingIdByWallet[msg.sender] = counter;

        counter++;
    }

    function getParkDetails(uint256 parkingId) public view returns (ParkingDetails memory)
    {
        ParkingDetails storage details = parkingSpaces[parkingId];
        return details;
    }


    function getAllParkDetails() public view returns (ParkingDetails[] memory) {
        ParkingDetails[] memory allDetails = new ParkingDetails[](counter);
        for (uint256 i = 0; i < counter; i++) {
            allDetails[i] = parkingSpaces[i];
        }
        return allDetails;
    }

    function fillPark(uint256 parkingId, address buyer) public {
        require(
            parkingSpaces[parkingId].available,
            "Parking space is not available"
        );
        parkingSpaces[parkingId].available = false;
        parkingSpaces[parkingId].buyerWallet = buyer;
    }

    function finishPark(uint256 parkingId, uint256 amount) public  payable{
        require(
            !parkingSpaces[parkingId].completed,
            "Parking rental already completed"
        );
        require(
            msg.sender == parkingSpaces[parkingId].buyerWallet,
            "Only the buyer can finish the parking"
        );
        require(
            parkingSpaces[parkingId].buyerWallet != address(0),
            "No buyer assigned for the parking"
        );
        payable(parkingSpaces[parkingId].creatorWallet).transfer(amount);
        parkingSpaces[parkingId].revenue += amount;
        parkingSpaces[parkingId].completed = true;
    }


    function generateNewParking(uint256 parkingId) public {
        require(
            msg.sender == parkingSpaces[parkingId].creatorWallet,
            "Only the creator can generate a new parking listing"
        );
        parkingSpaces[parkingId].available = true;
        parkingSpaces[parkingId].completed = false;
        parkingSpaces[parkingId].buyerWallet = address(0); // Reset buyerWallet to default
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}

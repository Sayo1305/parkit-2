import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import sampleImage from "../images/R1.jpg";
import { ethers } from "ethers";
import { Tooltip, notification } from "antd";
import { CarOutlined, ClockCircleFilled } from "@ant-design/icons";

const Card = ({ data }) => {
  const [imageurl, setImageUrl] = useState([]);

  const bgColors = [
    "#EE8434",
    "#C95D63",
    "#AE8799",
    "#717EC3",
    "#496DDB",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://gateway.pinata.cloud/ipfs/${data?.imageHash}`
        );
        const datra2 = await res.json();
        setImageUrl(datra2?.base64Array);
      } catch (err) {
        console.log(err);
      }
    };
    fetchImage();
  }, [data]);

  return (
    <div
      className="h-[350px]  w-[300px] relative flex flex-col gap-2 cursor-pointer shadow-md border-2 border-black  rounded-lg "
      style={{
        backgroundColor:
          bgColors[Math.floor(Math.random() * bgColors.length)],
      }}
      onClick={() => {
        localStorage.setItem("owner_wallet_id", data?.creatorWallet);
        navigate(`/Placedetail/${data?.parkingId}`);
      }}
    >
 {
          data?.available === true ? 
          <div className="absolute top-0 text-sm -right-2 rounded-r-md bg-green-400 px-2 ">
            Available
         </div> : 
         <div className="absolute top-0 text-sm -right-2 rounded-r-md bg-blue-400 px-2 ">
         Booked
      </div> 
        }
      <div>
        <img
          className="w-[300px] h-[200px]  rounded-lg object-cover"
          src={`data:image/jpeg;base64,${imageurl[0]?.data}`}
          alt="image"
        />
      </div>
      <div className="p-3 flex flex-col gap-5">
        <div className="text-center w-full text-sm font-medium">
          {" "}
          {data?.name} | {data?.place}{" "}
        </div>
        <div>
          <ClockCircleFilled /> Time: {data?.time} | {data?.day}
        </div>
        <div className="flex justify-between">
          <Tooltip title={data?.creatorWallet}>
            <img
              src={`https://api.dicebear.com/7.x/bottts/png?seed=${data?.creatorWallet}`}
              className="w-[30px] object-cover rounded-full border-black border-2"
              alt="profile"
            />
          </Tooltip>
          <div className="bg-[#93B7BE]  text-sm font-medium border border-black px-3 py-1 text-center rounded-md cursor-pointer">
            Park It @{ethers.formatEther(data?.amount)} Ether / hr
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBooking = () => {
  const { GetContract, Walletaddress } = useContext(Appcontext);
  const [myParking, setMyParking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = await GetContract();
        if(contract){
            const data = await contract.getAllParkDetails();
            // Filter parking spaces owned by the logged-in user
            const myParkingData = data?.filter(
              (parking) => parking?.buyerWallet?.toLowerCase() === Walletaddress?.toLowerCase()
            );
            setMyParking(myParkingData);
        }else{
            notification.error({message  : "error getting parking details"});
        }

      } catch (err) {
        console.error(err);
      }
    };

    if (Walletaddress !== "") {
      fetchData();
    }
  }, [Walletaddress]);

  return (
    <div>
      <div className="px-16 py-2 text-3xl font-semibold">Parking booked by You <CarOutlined/></div>
      <div className="mx-auto   w-11/12 h-[1px] bg-slate-400"></div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center w-5/6 mx-auto my-0 !gap-5 p-4 flex-wrap">
        {myParking.length !== 0 ? (
          myParking.map((parking, index) => <Card data={parking} key={index} />)
        ) : (
          <div className="w-full text-center p-3 text-2xl font-bold">
            No Parking Available
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;

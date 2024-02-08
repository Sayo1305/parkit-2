import { Button, Tooltip, notification } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { ClockCircleFilled } from "@ant-design/icons";
import { ethers } from "ethers";

const Placedetails = () => {
   const [dataset, setdataset] = useState([]);
   const [imageurl , setImageUrl] = useState([]);
   const router = useNavigate();
   const { id } = useParams();
   const context = useContext(Appcontext);
   const { GetContract, Walletaddress } = context;
   useEffect(()=>{
    const fetchImage = async ()=>{
      try{
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${dataset?.imageHash}`);
        const datra2 = await res.json();
        setImageUrl(datra2?.base64Array);
      }catch(err){
        console.log(err);
      }
    }
    fetchImage()
  },[dataset]);

  const fillPark = async () => {
    try {
       const contract = await GetContract();
       if (contract) {
          const parkingId = id; // Assuming `id` is the parking ID you want to fill
          // Replace `buyerAddress` with the address of the buyer
          await contract.fillPark(parkingId, Walletaddress);
          notification.success({ message: "Parking filled successfully" });
       } else {
          notification.error({ message: "Couldn't get contract, please try again" });
       }
    } catch (err) {
       console.error(err);
       notification.error({ message: "An error occurred while filling the park" });
    }
 };
   useEffect(() => {
      const fetchDetails = async () => {
         try {
            const contract = await GetContract();
            if (contract) {
               const parkingId = id;
               const data = await contract.getParkDetails(parkingId);
               setdataset(data);
            } else {
               notification.error({ message: "couldn't get data, please try again" });
            }
         } catch (err) {
            console.error(err);
         }
      };
      if (Walletaddress !== "" && typeof id !== "undefined" && id !== "") {
         fetchDetails();
      }
   }, [id, Walletaddress]);
   if(dataset.length === 0){
    return (
      <div className="w-full min-h-[90vh] flex-col gap-5 flex items-center justify-center">
              <div className="border-2 w-20 h-20 animate-spin border-blue-600"></div>
              <div className="text-2xl font-medium text-blue-600">loading..</div>
      </div>
    )
   }
   return (
      <div className="w-full min-h-[90vh]">
         <div className="w-full h-[300px] z-10 object-contain bg-black shadow-md relative">
            <img
               className="w-full h-full object-cover object-center"
               src={`data:image/jpeg;base64,${imageurl[0]?.data}`}
               alt=""
            />
         </div>
         <div className="w-5/6 mx-auto flex items-start shadow-md justify-between border relative p-5  -top-20 rounded-md bg-white z-20 my-0">
            <div className="flex items-start gap-3">
               <Tooltip title={dataset?.creatorWallet}>
                  <img
                     src={`https://api.dicebear.com/7.x/bottts/png?seed=${dataset?.creatorWallet}`}
                     className="w-[100px] object-cover rounded-full border-black border-2"
                     alt="profile"
                  />
               </Tooltip>
               <div>
                <div className="text-2xl mb-2 font-semibold">{dataset?.name}</div>
                <div className="text-sm text-slate-500">{dataset?.place} | {dataset?.pincode}</div>
               </div>
            </div>
            <div>
              <Button>Book Parking @ {ethers.formatEther(dataset?.amount)} Ether/ hour</Button>
            </div>
         </div>
         <div className="w-5/6 mx-auto flex -top-10 items-start justify-between  relative p-5  bg-white z-20 my-0">
          <div>
            <div className="text-xl mb-3">Timmings</div>
            <ClockCircleFilled/> {dataset?.time} | {dataset?.day}
          </div>
         </div>
      </div>
   );
};

export default Placedetails;

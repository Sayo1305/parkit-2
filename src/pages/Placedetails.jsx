/** @format */

import { Button, Tooltip, notification } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { ClockCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { Carousel } from "antd";

const Placedetails = () => {
   const [dataset, setdataset] = useState([]);
   const [imageurl, setImageUrl] = useState([]);
   const router = useNavigate();
   const [loading, setLoading] = useState(false);
   const [loadingFinish , setLoadingFinish]  = useState(false);
   const { id } = useParams();
   const context = useContext(Appcontext);
   const { GetContract, Walletaddress } = context;
   useEffect(() => {
      const fetchImage = async () => {
         try {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${dataset?.imageHash}`);
            const datra2 = await res.json();
            setImageUrl(datra2?.base64Array);
         } catch (err) {
            console.error(err);
         }
      };
      fetchImage();
   }, [dataset]);

   const fillPark = async () => {
      try {
         setLoading(true);
         const contract = await GetContract();
         if (contract) {
            const parkingId = id; // Assuming `id` is the parking ID you want to fill
            // Replace `buyerAddress` with the address of the buyer
            // console.log("contract" , contract);
            await contract.fillPark(parkingId, Walletaddress);
            notification.success({ message: "Parking filled successfully" });
         } else {
            notification.error({ message: "Couldn't get contract, please try again" });
         }
      } catch (err) {
         console.error(err);
         notification.error({ message: "An error occurred while filling the park" });
      } finally {
         setLoading(false);
      }
   };

   const finishPark = async (amount) => {
      try {
         setLoadingFinish(true);
         const contract = await GetContract();
         if (contract) {
            const parkingId = id; // Assuming `id` is the parking ID you want to finish
            // Replace `amount` with the amount to be transferred
            await contract.finishPark(parkingId, amount);
            notification.success({ message: "Parking finished successfully" });
         } else {
            notification.error({ message: "Couldn't get contract, please try again" });
         }
      } catch (err) {
         console.error(err);
         notification.error({ message: "An error occurred while finishing the park" });
      } finally {
         setLoadingFinish(false);
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

   const calculateAmountEarned = (startDate, startTime, hourlyRate) => {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const targetDateTime = new Date();

      // If the target date is before the start date, return 0
      if (targetDateTime < startDateTime) {
         return 0;
      }

      // Calculate the time difference in milliseconds
      const timeDiffMilliseconds = targetDateTime - startDateTime;

      // Convert milliseconds to hours
      const timeDiffHours = timeDiffMilliseconds / (1000 * 60 * 60);

      // Calculate the amount earned
      const amountEarned = timeDiffHours * ethers.formatEther(hourlyRate);

      return amountEarned.toFixed(3); // Assuming Ethereum amount has 3 decimal places
   };

   if (dataset.length === 0) {
      return (
         <div className="w-full min-h-[90vh] flex-col gap-5 flex items-center justify-center">
            <div className="border-2 w-20 h-20 animate-spin border-blue-600"></div>
            <div className="text-2xl font-medium text-blue-600">loading..</div>
         </div>
      );
   }
   return (
      <div className="w-full min-h-[90vh]">
         <div className="w-full h-[300px] z-10 object-contain bg-black shadow-md relative">
            <Carousel
               autoplay
               autoplaySpeed={2000}
               effect="fade"
               className="w-full h-[300px] object-contain relative"
            >
               {imageurl.length !== 0 &&
                  imageurl.map((image) => {
                     return (
                        <img
                           className="w-full h-[300px] object-cover object-center"
                           src={`data:image/jpeg;base64,${image?.data}`}
                           alt=""
                        />
                     );
                  })}
            </Carousel>
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
                  <div className="text-sm text-slate-500">
                     {dataset?.place} | {dataset?.pincode}
                  </div>
               </div>
            </div>
            <div>
               <Button
                  onClick={async () => {
                     // console.log(dataset?.available)
                     if (
                        dataset?.available === false ||
                        dataset?.creatorWallet?.toLowerCase() === Walletaddress?.toLowerCase()
                     ) {
                        return;
                     } else {
                        await fillPark();
                     }
                  }}
               >
                  {dataset?.available === true
                     ? `Book Parking @ ${ethers.formatEther(dataset?.amount)} Ether/ hour`
                     : `Booked Parking`}
                  {loading === true && <LoadingOutlined />}
               </Button>
               {dataset?.available === false && (
                  <div className="flex items-center gap-2">
                     Booked by :{" "}
                     <Tooltip title={dataset?.buyerWallet}>
                        <img
                           src={`https://api.dicebear.com/7.x/bottts/png?seed=${dataset?.buyerWallet}`}
                           className="w-[40px] object-cover rounded-full border-black border-2"
                           alt="profile"
                        />
                     </Tooltip>
                  </div>
               )}
            </div>
         </div>
         <div className="w-5/6 mx-auto flex flex-col -top-10 items-start justify-between  relative p-5  bg-white z-20 my-0">
            <div className=" flex items-center gap-5 mb-3 ">
               {dataset?.available === false &&
                  dataset?.buyerWallet?.toLowerCase() === Walletaddress?.toLowerCase() && (
                     <div>
                        <div className="flex items-center gap-3">
                           <div className="text-xl font-semibold">Total expense: </div>
                           <div onClick={()=>{finishPark(calculateAmountEarned(dataset?.day, dataset?.time, dataset?.amount))}} className="text-xs border-2 cursor-pointer border-green-500 bg-green-50 text-green-500 rounded-md p-2">
                              Complete Parking
                           </div>
                           {calculateAmountEarned(dataset?.day, dataset?.time, dataset?.amount) <=
                              0 && (
                              <div onClick={()=>{finishPark(0)}} className="text-xs border-2 cursor-pointer border-red-500 bg-red-50 text-red-500 rounded-md p-2">
                                 Cancel Parking
                              </div>
                           )}
                        </div>
                        <div className="w-full h-[1px] my-2 bg-slate-300"></div>
                        <div className="w-full mb-5 flex items-center gap-2">
                           amount :{" "}
                           {calculateAmountEarned(dataset?.day, dataset?.time, dataset?.amount)}{" "}
                           ethers
                        </div>
                     </div>
                  )}
            </div>

            <div className="text-xl mb-3 font-semibold">Timmings</div>
            <div className="w-full h-[1px] mb-2 bg-slate-300"></div>
            <div className="w-full mb-5 flex items-center gap-2">
               <ClockCircleFilled /> time: {dataset?.time} | date: {dataset?.day}
            </div>
            <div className="text-xl mb-3 font-semibold">Images</div>
            <div className="w-full h-[1px] mb-2 bg-slate-300"></div>
            <div className="w-full h-[300px] z-10 object-contain bg-slate-300 rounded-md shadow-md relative">
               <Carousel
                  effect="fade"
                  dotPosition="bottom"
                  className="w-full h-[300px] object-contain relative"
               >
                  {imageurl.length !== 0 &&
                     imageurl.map((image) => {
                        return (
                           <img
                              className="w-full h-[300px] object-contain object-center"
                              src={`data:image/jpeg;base64,${image?.data}`}
                              alt=""
                           />
                        );
                     })}
               </Carousel>
            </div>
         </div>
      </div>
   );
};

export default Placedetails;

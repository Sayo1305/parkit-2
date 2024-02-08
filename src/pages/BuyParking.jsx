import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import sampleImage from "../images/R1.jpg";
import { ethers } from "ethers";
import { Tooltip } from "antd";
const Card = ({data}) => {
  const bgColors = [
    "#EE8434",
    "#C95D63",
    "#AE8799",
    "#717EC3",
    "#496DDB",
  ]
  const navigate = useNavigate();
  return (
    <div className='h-[350px] w-[300px] relative flex flex-col gap-2 cursor-pointer shadow-md border-2 border-black  rounded-lg ' 
    style={{ backgroundColor: bgColors[ Math.floor(Math.random() * bgColors.length)] }}
    onClick={()=>{
      localStorage.setItem("owner_wallet_id" , data?.creatorWallet);
      // navigate(`/Placedetail/${data?.id}`);
    }}>
      <div><img className='w-[300px] h-[200px] rounded-lg object-cover' src={sampleImage} alt="image" /></div>
      <div className="p-3 flex flex-col gap-5">
      {/* <div className='w-full text-lg text-center font-semibold'>{data?.area}</div> */}
      <div className='text-center w-full text-sm font-medium'> {data?.name} | {data?.place} </div>
      <div>
        Time: {data?.time } | {data?.day}
      </div>
      <div className="flex justify-between">
        <Tooltip title={data?.creatorWallet}>
        <img src={`https://api.dicebear.com/7.x/bottts/png?seed=${data?.creatorWallet}`} className="w-[30px] object-cover rounded-full border-black border-2" alt="profile"/>
        </Tooltip>
      <div className='bg-[#93B7BE]  text-sm font-medium border border-black px-3 py-1 text-center rounded-md cursor-pointer'>Park It @{ethers.formatEther(data?.amount)}Ether / hr</div>
      </div>
      </div>
      
    </div>
  )
}

const BuyParking = () => {
  const [places, setplaces] = useState("");
  const [originalplace, setoriginalplace] = useState([]);
  const [placelist, setplacelist] = useState([]);
  const context = useContext(Appcontext);
  const {GetContract , Walletaddress} = context;
  useEffect(()=>{
    const fetchData = async ()=>{
        try{
          const contract = await GetContract();
          const data = await contract.getAllParkDetails();
          setoriginalplace((data));
        }catch(err){
          console.error(err);
        }
    }
    if(Walletaddress !== ""){
      fetchData();
    }
  },[Walletaddress]);
  return (
    <div>
      <div className="p-2 flex justify-center gap-2 w-full items-center">
        <input
          type={"text"}
          value={places}
          onChange={(e) => setplaces(e.target.value)}
          placeholder="search places"
          className="bg-slate-200 w-1/2 shadow-lg outline-none p-2 rounded-lg"
        ></input>
        <div className="p-2 bg-red-400 text-white rounded-md">Search</div>
      </div>
      <div className="grid grid-cols-3 justify-items-center w-5/6 mx-auto my-0 !gap-5 p-4 flex-wrap">
        {originalplace.length !== 0 && originalplace?.map((parking, index) => (
          <Card  data={parking} key={index} />
        ))}
      </div>
    </div>
  );
};

export default BuyParking;

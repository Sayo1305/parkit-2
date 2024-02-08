"use client";
import { ethers } from "ethers";
import { Appcontext } from "./Appcontext";
import React, { useState } from "react";
import abi from "../utils/contractAbi.json";
const AppState = (props) => {
  const [Walletconnection, setwalletconnection] = useState(false);
  const [Walletaddress, setWalletaddress] = useState("");
  const [datalist, setdatalist] = useState([]);
  const GetContract = async ()=>{
    try{
      const contractAddress  = "0x73aa408d982FB33B7D42c4948887f125bA1C3288";
      const contractAbi = abi.abi;
      const provider = new ethers.BrowserProvider(window.ethereum);//read the Blockchain
      const signer =  await provider.getSigner(); //write the blockchain
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
    
      return contract;
    }catch(err){
      console.log(err)
      return null;
    }
  }
  return (
    <Appcontext.Provider
      value={{
        Walletaddress,
        Walletconnection,
        datalist,
        setdatalist,
        setWalletaddress,
        setwalletconnection,
        GetContract,
      }}
    >
      {props.children}
    </Appcontext.Provider>
  );
};

export default AppState;

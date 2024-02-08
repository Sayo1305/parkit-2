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
      const contractAddress  = "0x381E6D4e0894584717183781a28EfF164E20F504";
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

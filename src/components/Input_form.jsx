import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";
import bg from "../images/form_fill.jpg";
import { Button, DatePicker, Form, Input, TimePicker, notification } from "antd";
import ImageModal from "./ImageModal";
import { ethers } from "ethers";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import abi from "../utils/contractAbi.json";
import dayjs from "dayjs";
const Input_form = () => {
  const context = useContext(Appcontext);
  const [Imagefile, setImagefile] = useState([]);
  const { Walletaddress  , GetContract} = context;
  const {form} = Form.useForm();
  const [loading , setLoading] = useState(false);
  const [openImageModal , setOpenImageModal] = useState(false);
  

  const handle_submit = async (values) => {
    const formattedTime = dayjs(values.time).format('HH:mm:ss');
    const formattedDate = dayjs(values.date).format('YYYY-MM-DD');
    values.time = formattedTime;
    values.date = formattedDate;
    values.image = Imagefile;
    values.walletAddress = Walletaddress;
    values.amount = ethers.parseEther(values.amount);
    try{
      const contract = await GetContract();
      if(contract){
        setLoading(true);
        const res  = await contract.storePark(values.tagline, values.place , values.pincode , values.image , values.amount , values.date , values.time);
        if(res){
          notification.success({message : "Items  listed successfully, it may take a few minutes, as it is on testnet."});
        }
      }else{
        console.log("contract not there");
        notification.error({message : "error in saving try again.. "});
      }
    }catch(e){
      console.log(e);
      notification.error({message : "error in saving try again.. "});
    }finally{
      setLoading(false);
    }
  };
  return (
    <div className="p-3">
      {" "}
      <div className="w-full text-center p-3 text-2xl font-bold">Add Parking Slot</div>
      <div className="w-5/6 mx-auto my-0  flex md:flex-row flex-col-reverse items-center justify-between">
        <Form
        ref={form}
          onFinish={handle_submit}
          className="md:w-1/2 w-full bg-[#D5F8E7] p-4 rounded-md flex flex-col !gap-0"
          layout="vertical"
        >
          {
            Imagefile.length !== 0 ? <div className="text-green-500 text-center mb-2"  ><CheckCircleOutlined/> Image Uploaded</div> : 
            <Form.Item className="flex items-center justify-center">
              <Button onClick={()=>{setOpenImageModal(true)}}>Upload Pictures</Button>
            </Form.Item>
          }
          
          <Form.Item label="Tagline" name={"tagline"}>
            <Input size="large" className="w-full bg-[#DFE5E2]" />
          </Form.Item>
          <Form.Item label="Place" name={"place"}>
            <Input size="large" className="w-full bg-[#DFE5E2]" />
          </Form.Item>
          <Form.Item label="Pincode" name={"pincode"}>
            <Input size="large" type="number" className="w-full bg-[#DFE5E2] " />
          </Form.Item>
          <Form.Item label="Amount (per hour) In Ether" name={"amount"}>
            <Input size="large" type="number" className="w-full bg-[#DFE5E2]" />
          </Form.Item>
          <div className="flex gap-5 items-center justify-between">
            <Form.Item className="w-1/2" label="Time" name={"time"}>
              <TimePicker size="large" className="w-full bg-[#DFE5E2]" format={"HH:mm"} />
            </Form.Item>
            <Form.Item className="w-1/2" label="Date" name={"date"}>
              <DatePicker size="large" className="w-full bg-[#DFE5E2]" />
            </Form.Item>
          </div>
          <Form.Item className="" label="address" name={"walletAddress"}>
            <Input
              defaultValue={Walletaddress}
              readOnly
              size="large"
              className="w-full bg-[#DFE5E2]"
            />
          </Form.Item>
          <Form.Item className="flex items-center justify-center">
            <Button
              htmlType="submit"
              className="bg-blue-200 text-blue-600 flex items-center justify-center border-blue-900 text-lg px-10"
            >
              Submit {loading === true && <LoadingOutlined/>}
            </Button>
          </Form.Item>
        </Form>
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <img src={bg} className="w-full object-cover" alt="pic" />
        </div>
      </div>
      <ImageModal open={openImageModal} setopen={setOpenImageModal} setFilesUpload={setImagefile}/>
    </div>
  );
};

export default Input_form;

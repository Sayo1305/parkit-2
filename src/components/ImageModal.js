import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Toast } from "./Toast";


const ImageModal = ({ open, setopen, setFilesUpload }) => {
  const [imagePrev, setImagePrev] = useState([]);
  const [images , setImages] = useState([]);

  const handleDelete = (index) => {
    const updatedImagePrev = [...imagePrev];
    updatedImagePrev.splice(index, 1);
    setImagePrev(updatedImagePrev);
  };
  const apiKey = process.env.REACT_APP_API_KEY_;
  const secretKey = process.env.REACT_APP_SECRET_KEY_;
  const handleChange = (files) => {
    const previewUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePrev(previewUrls);
    setImages(files);
//     console.log(previewUrls);
  };
  const handleUpload = async (fileList) => {
      try {
        // Convert fileList object to an array of files
        const filesArray = Object.values(fileList);
    
        // Check if filesArray is not empty
        if (filesArray.length > 0) {
          // Convert each file to base64 and include name in metadata
          const base64Promises = filesArray.map((file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve({
                data: reader.result.split(',')[1],
                name: file.name, // Include the file name in metadata
              });
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(file);
            });
          });
    
          // Wait for all base64 conversions to complete
          const base64ArrayWithMetadata = await Promise.all(base64Promises);
    
          // Send base64 data with metadata to Pinata
          const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
              pinata_api_key: apiKey,
              pinata_secret_api_key: secretKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ base64Array: base64ArrayWithMetadata }),
          });
    
          if (res.ok) {
            const data = await res.json();
            // console.log(data);
            setFilesUpload(data?.IpfsHash);
            Toast.fire({
              icon : "success",
              text : "Images Uploaded",
            });
            setopen(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    
    

  return (
    <Modal
      open={open}
      width={700}
      footer={null}
      onCancel={() => {
        setopen(false);
      }}
    >
      <div className="">
        <div className="text-center font-bold text-xl">Upload Image</div>
        <div className="w-1/2 mx-auto my-5 flex flex-col items-center relative justify-center h-auto p-2 rounded-md border-2 border-dashed">
          <CloudUploadOutlined className="text-7xl text-center text-blue-400 z-10" />
          <input
            onChange={(e) => {
              handleChange(e.target.files);
            }}
            multiple
            type="file"
            className="text-sm w-full absolute top-0 left-0  h-full opacity-0 z-20"
          />
          <div className="text-center text-sm text-slate-500">
            Note: This images are uploaded on Decentralised Network so, Please Check before upload
          </div>
        </div>
        <div className="flex flex-wrap gap-5 items-center justify-start">
          {imagePrev.length > 0 &&
            imagePrev.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-[100px] h-[100px] object-cover hover:bg-slate-500"
                />
                <div className="absolute top-0 right-0 p-1 cursor-pointer text-red-500">
                  <DeleteOutlined
                    onClick={() => handleDelete(index)}
                  />
                </div>
              </div>
            ))}
        </div>

        <Button onClick={()=>{handleUpload(images)}}>Upload</Button>
      </div>
    </Modal>
  );
};

export default ImageModal;

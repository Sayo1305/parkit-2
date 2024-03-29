import './App.css';
import React from 'react'
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Addparking from './pages/Addparking';
import BuyParking from './pages/BuyParking';
import Placedetails from './pages/Placedetails';
import Navbar from './components/Navbar';
import MyParking from './pages/Myparking';
import MyBooking from './pages/Mybooking';
// import GetDatabase from './utils/GetDatabase';
function App() {
  // useEffect(()=>{
  //   GetDatabase();
  // },[]);
  return (
    <div className="w-full h-screen">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/AddParking' element={<Addparking/>}></Route>
        <Route path='/BuyParking' element={<BuyParking/>}></Route>
        <Route path='/Placedetail/:id' element={<Placedetails/>}></Route>
        <Route path='/myparking' element={<MyParking/>}></Route>
        <Route path='/MyBooking' element={<MyBooking/>}></Route>
      </Routes>
    </div>
  );
}

export default App;

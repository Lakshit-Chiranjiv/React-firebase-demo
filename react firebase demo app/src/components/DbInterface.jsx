import React, { useState,useEffect } from 'react';
import { db } from './../firebase-config';
import { collection,getDocs,addDoc } from 'firebase/firestore';
import { async } from '@firebase/util';

const DbInterface = () => {

    let foodID = 1;
    const [foodItems,setFoodItems] = useState([]);
    
    const [itemName,setItemName] = useState("");
    const [itemPrice,setItemPrice] = useState(0);
    const [itemAvailability,setItemAvailability] = useState(true);

    const foodMenuCollectionRef = collection(db,"food_menu");

    const getMenu = async()=>{
        const menuData = await getDocs(foodMenuCollectionRef);
        setFoodItems(menuData.docs.map((docItem)=> ({...docItem.data(),itemId:docItem.id})));
        // console.log(menuData);

        // menuData.docs.map((dt)=>{
        //     console.log(dt.data(),Number(dt.id));
        // })
    }

    const submitMenuItem = async(e)=>{
        e.preventDefault();
        // console.log(itemName,itemPrice,typeof(itemAvailability),itemAvailability);
        await addDoc(foodMenuCollectionRef,{ item: itemName,price: itemPrice,available: Boolean(itemAvailability) });
        getMenu();
    }

    useEffect(()=>{
        getMenu();
    },[]);

  return (
    <>
    <h1 className='text-center m-3 display-1'>Firebase Restaurent</h1>
    <div className='db'>
        <div className="menu">
            <h1>Food Menu</h1>
            {
                foodItems.map((food)=>{
                    return (
                        <div className="itm" key={food.itemId}>
                            <h4 className={food.available?'text-success':'text-warning'}>{food.item}....${food.price}</h4>
                            <button className='btn btn-danger'>Delete</button>
                        </div>
                    )
                })
            }
        </div>
        <div className="add">
            <h1>Add Food Item</h1>

            <form onSubmit={submitMenuItem}>
                <label htmlFor='item name'>Food Item Name</label>
                <input type="text" placeholder='item name ....' onChange={(e)=>{setItemName(e.target.value)}}/>
                <br /><br />
                <label htmlFor='item price'>Food Item Price</label>
                <input type="number" placeholder='price...' onChange={(e)=>{setItemPrice(Number(e.target.value))}}/>
                <br /><br />
                <label htmlFor="availability">Available??</label>
                <select name="avail" onChange={(e)=>{
                    console.log("hey");
                    setItemAvailability(e.target.value==="true")}}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <input type="submit" value="submit" />
            </form>
        </div>
    </div>
    </>
  )
}

export default DbInterface
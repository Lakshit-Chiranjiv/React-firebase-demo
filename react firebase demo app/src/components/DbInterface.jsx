import React, { useState,useEffect } from 'react';
import { db } from './../firebase-config';
import { collection,getDocs,addDoc,setDoc,doc,updateDoc } from 'firebase/firestore';

const DbInterface = () => {

    const [foodItems,setFoodItems] = useState([]);
    
    const [itemName,setItemName] = useState("");
    const [itemPrice,setItemPrice] = useState(0);
    const [itemAvailability,setItemAvailability] = useState(true);

    const [updateItemName,setUpdateItemName] = useState("");
    const [updateItemPrice,setUpdateItemPrice] = useState(0);
    const [updateItemAvailability,setUpdateItemAvailability] = useState(true);

    const [showAddEmptyError,setShowAddEmptyError] = useState(false);
    const [showAddExistError,setShowAddExistError] = useState(false);
    const [showUpdateEmptyError,setShowUpdateEmptyError] = useState(false);
    const [showUpdateExistError,setShowUpdateExistError] = useState(false);

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
        if(itemName !== ''){
            let tempFoodItems = foodItems.map((val)=>val.item.toLowerCase());
            if(!tempFoodItems.includes(itemName.toLowerCase())){
                await setDoc(doc(foodMenuCollectionRef, String(foodItems.length + 1)),{
                    item: itemName,
                    price: itemPrice,
                    available: Boolean(itemAvailability)
                });
                getMenu();
            }
            else{
                setShowAddExistError(true);
                setTimeout(()=>{
                    setShowAddExistError(false);
                },4000);
            }
        }
        else{
            setShowAddEmptyError(true);
            setTimeout(()=>{
                setShowAddEmptyError(false);
            },4000);
        }
        // console.log(itemName,itemPrice,typeof(itemAvailability),itemAvailability);
        // await addDoc(foodMenuCollectionRef,{ item: itemName,price: itemPrice,available: Boolean(itemAvailability) });
        
    }

    const updateMenuItem = async(e)=>{
        e.preventDefault();
        if(updateItemName !== ''){
            let tempFoodItems = foodItems.map((val)=>val.item.toLowerCase());
            if(tempFoodItems.includes(itemName.toLowerCase())){
                await setDoc(doc(foodMenuCollectionRef, String(foodItems.length + 1)),{
                    item: itemName,
                    price: itemPrice,
                    available: Boolean(itemAvailability)
                });
                getMenu();
            }
            else{
                setShowUpdateExistError(true);
                setTimeout(()=>{
                    setShowUpdateExistError(false);
                },4000);
            }
        }
        else{
            setShowUpdateEmptyError(true);
            setTimeout(()=>{
                setShowUpdateEmptyError(false);
            },4000);
        }
    }

    useEffect(()=>{
        getMenu();
    },[]);

  return (
    <>
    <h1 className='text-center m-3 display-1'>Firebase Restaurent</h1>
    <div className='mb-5 db'>
        <div className="menu">
            <h1>Food Menu</h1>
            {
                foodItems.map((food)=>{
                    return (
                        <div className="m-4 itm" key={food.itemId}>
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
                    setItemAvailability(e.target.value==="true")}}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <input type="submit" value="submit" />
                <br />
                {
                    showAddEmptyError && 
                    <p className='text-danger'>Please fill the item name !!</p>
                }
                {
                    showAddExistError &&
                    <p className='text-danger'>This item already exists in the menu!!</p>
                }
                
            </form>

            <h1>Update Menu Item</h1>

            <form onSubmit={updateMenuItem}>
                <label htmlFor='item name'>Food Item Name</label>
                <input type="text" placeholder='item name ....' onChange={(e)=>{setUpdateItemName(e.target.value)}}/>
                <br /><br />
                <label htmlFor='item price'>Food Item Price</label>
                <input type="number" placeholder='price...' onChange={(e)=>{setUpdateItemPrice(Number(e.target.value))}}/>
                <br /><br />
                <label htmlFor="availability">Available??</label>
                <select name="avail" onChange={(e)=>{
                    setUpdateItemAvailability(e.target.value==="true")}}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
                <input type="submit" value="Update" />
                <br />
                {
                    showUpdateEmptyError && 
                    <p className='text-danger'>Please fill the item name !!</p>
                }
                {
                    showUpdateExistError &&
                    <p className='text-danger'>This item doesn't exists in the menu!!</p>
                }
            </form>
        </div>
    </div>
    </>
  )
}

export default DbInterface
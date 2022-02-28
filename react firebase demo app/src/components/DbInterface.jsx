import React, { useState,useEffect } from 'react';
import { db,auth } from './../firebase-config';
import { collection,getDocs,getDoc,addDoc,setDoc,doc,updateDoc,deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';


const DbInterface = () => {

    let navigate = useNavigate();

    const [foodItems,setFoodItems] = useState([]);
    
    const [itemName,setItemName] = useState("");
    const [itemPrice,setItemPrice] = useState(0);
    const [itemAvailability,setItemAvailability] = useState(true);

    const [updateItemId,setUpdateItemId] = useState("");
    const [updateItemName,setUpdateItemName] = useState("");
    const [updateItemPrice,setUpdateItemPrice] = useState(0);
    const [updateItemAvailability,setUpdateItemAvailability] = useState(true);

    const [showUpdateForm,setShowUpdateForm] = useState(false);

    const [showAddEmptyError,setShowAddEmptyError] = useState(false);
    const [showAddExistError,setShowAddExistError] = useState(false);
    const [showUpdateEmptyError,setShowUpdateEmptyError] = useState(false);

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
                // await setDoc(doc(foodMenuCollectionRef, String(foodItems.length + 1)),{
                //     item: itemName,
                //     price: itemPrice,
                //     available: Boolean(itemAvailability)
                // });
                await addDoc(foodMenuCollectionRef,{ item: itemName,price: itemPrice,available: Boolean(itemAvailability) });
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

    const updateMenuItem = async(id)=>{
        if(updateItemName !== ''){
            await updateDoc(doc(foodMenuCollectionRef, id),{
                item: updateItemName,
                price: updateItemPrice,
                available: Boolean(updateItemAvailability)
            });
            getMenu();
            setShowUpdateForm(false);
        }
        else{
            setShowUpdateEmptyError(true);
            setTimeout(()=>{
                setShowUpdateEmptyError(false);
            },4000);
        }
    }

    const prepareUpdateForm = async(id)=>{
        const menuItemData = await getDoc(doc(foodMenuCollectionRef,id));
        // console.log(menuItemData,menuItemData.data());
        setUpdateItemId(id);
        setUpdateItemName(menuItemData.data().item);
        setUpdateItemPrice(Number(menuItemData.data().price));
        setUpdateItemAvailability(Boolean(menuItemData.data().available));
    }

    const deleteMenuItem = async(id)=>{
        await deleteDoc(doc(foodMenuCollectionRef, id));
        getMenu();
    }

    const logoutUser = async()=>{
        await signOut(auth);
        navigate("/");
        // setShowUsername(false);
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
                        <div className="border-bottom border-2 p-3 m-4 itm" key={food.itemId}>
                            <div className="d-flex menu-item-data">
                                <h4 className={food.available?'text-success':'text-warning'}>{food.item}</h4>
                                <h5 className="mt-auto mb-auto text-primary prc">${food.price}</h5>
                            </div>
                            <div className="d-flex menu-item-btns">
                                <button className='btn btn-sm btn-danger me-4 w-25' onClick={()=>{
                                    deleteMenuItem(food.itemId);
                                }}>Delete</button>
                                <button className='btn btn-sm btn-dark me-4 w-25' onClick={()=>{
                                    setShowUpdateForm(true);
                                    prepareUpdateForm(food.itemId);
                                }}>Edit</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <div className="add">
            <h1>Add Food Item</h1>

            <form onSubmit={submitMenuItem}>
                <label htmlFor='item name' className='form-label'>Food Item Name</label>
                <input type="text" className='form-control w-75' placeholder='item name ....' onChange={(e)=>{setItemName(e.target.value)}}/>
                <br /><br />
                <label htmlFor='item price' className='form-label'>Food Item Price</label>
                <input type="number" className='form-control w-75' placeholder='price...' onChange={(e)=>{setItemPrice(Number(e.target.value))}}/>
                <br /><br />
                <label htmlFor="availability">Available??</label>
                <select name="avail" className='form-select w-75' onChange={(e)=>{
                    setItemAvailability(e.target.value==="true")}}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <div className="d-grid">
                    <input className='btn btn-success w-75 mt-5' type="submit" value="Submit" />
                </div>
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

            {
                showUpdateForm &&
                <>
                    <h1>Update Menu Item</h1>

                    <form>
                        <label htmlFor='item name' className='form-label'>Food Item Name</label>
                        <input type="text" className='form-control w-75' placeholder='item name ....' value={updateItemName} onChange={(e)=>{setUpdateItemName(e.target.value)}}/>
                        <br /><br />
                        <label htmlFor='item price' className='form-label'>Food Item Price</label>
                        <input type="number" className='form-control w-75' placeholder='price...' value={updateItemPrice} onChange={(e)=>{setUpdateItemPrice(Number(e.target.value))}}/>
                        <br /><br />
                        <label htmlFor="availability">Available??</label>
                        <select name="avail" className='form-select w-75' value={updateItemAvailability} onChange={(e)=>{
                            setUpdateItemAvailability(e.target.value==="true")}}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        {/* <input type="submit" value="Update" /> */}
                        <br />
                        {
                            showUpdateEmptyError && 
                            <p className='text-danger'>Please fill the item name !!</p>
                        }
                    </form>

                    <div className="d-grid">
                        <button className='btn btn-success w-75' onClick={()=>{updateMenuItem(updateItemId)}}>Update</button>
                    </div>
                </>
            }

        </div>
    </div>
    <div className="d-grid">
        <button className='btn btn-danger w-25' onClick={logoutUser}>Logout</button>
    </div>
    </>
  )
}

export default DbInterface
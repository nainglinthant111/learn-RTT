import TouchButton from './component/touchButton.jsx';
import CountBTN from './component/CountBTN.jsx';
import { useEffect, useState } from 'react';

// const onpass=(name) => {
//     alert(`Hello ${name} !`);
// }
// const city=["yangon","Bago","Shwe Gu","Taunggyi","Mandalay"];

function Greeting() {
    let [count,setCount]= useState(0);
    let [city,setCity]=useState(["yangon","ShweGu"])
    let [user,setUser]= useState({name:"Aung Aung",age:20,status:true})
    let [name,setName]= useState("");
    let [error,setError]= useState("");
    useEffect(()=>{
        if(!name){
            setError("Name is required");
        }else{
            setError("");
        }
    },[name])
  return (
    <>
    <h1>Hello World</h1>
    {/* {city.map((item)=>
    <TouchButton key={item} onpass={onpass}>{item}</TouchButton>

)} */}
<p>Count {count} </p>
<button  onClick={()=>setCount(count+1)}>increase</button>

{
    city.map((item)=>
        <ul key={item}>
            <li  >{item}</li>
        </ul>)
}
        <button onClick={()=>setCity([...city,"Mandalay"])}> Add City</button>

    {user.status ? <p>So Busy!</p> : <p>So Free</p> }
    <button onClick={()=>setUser({...user,status:!user.status})}>Change Status</button>



    <form>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={name} id="name" onChange={(e)=>setName(e.target.value)} />
        {error && <p>{error}</p>}
    </form>
    </>
  );

}


export default Greeting
import React,{useEffect} from 'react'
import{Form,Input,message}from 'antd'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios' 
const Login=()=>{
   const navigate=useNavigate();
    // form submit
     const SubmitHandler= async(values)=>{
       try{
    const {data}= await axios.post('/users/login',values)
    console.log(data);
    message.success('login success')
    localStorage.setItem('user',JSON.stringify({...data.user,password:''}))
    navigate('/')
  
       }
catch(error){
 message.error('something went wrong')
}

     };

     //prevent for login user
     useEffect(()=>{
      if(localStorage.getItem('user')){
          navigate('/')
      }
   },[navigate])
    return(
      <>
          <div className="register-page">
            <Form layout="vertical" onFinish={SubmitHandler}>
            <h1>LOGIN Form</h1>
             
                <Form.Item label="Email" name="email">
                    <Input type="email"/> 
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type="password"/> 
                </Form.Item>
                <div className=" justify-content-between">
                <Link to="/register"> Not a User?Click here to register</Link>
             

               <div>
               <button className="btn btn-primary">LOGIN</button>
               </div>
                </div>

            </Form> 
          </div>

      </>  
    );
};

export default Login;
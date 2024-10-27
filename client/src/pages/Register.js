import './Register.css';
import React ,{useState,useEffect}from 'react'
import{Form,Input,message}from 'antd'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios' 

const Register=()=>{

    const navigate= useNavigate()
    // form submit
     const SubmitHandler=async (values)=>{
        try{
            await axios.post('/users/register',values)
            message.success('registration successful')
            navigate('/login');
        }
        catch(error){
        message.error("invalid username or password");
        }
        
     };
     //prevent for login user
     useEffect(()=>{
        if(localStorage.getItem('user')){
            navigate('/')
        }
     },[navigate]);
    return(
      <>
          <div className="register-page">
            <Form layout="vertical" onFinish={SubmitHandler}>
            <h1>Register Form</h1>
                <Form.Item label="Name" name="name">
                    <Input/> 
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type="email"/> 
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type="password"/> 
                </Form.Item>
                <div className=" justify-content-between">
               <Link to="/login"> Already Register ?Click here to login</Link>
               <div>
               <button className="btn btn-primary">REGISTER</button>
               </div>
                </div>

            </Form> 
          </div>

      </>  
    );
};

export default Register;
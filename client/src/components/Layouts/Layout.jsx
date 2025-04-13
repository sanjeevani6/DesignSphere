import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout=({children,user})=>{
    return(
        <>
            <Header user={user}/>
            <div className='content '>
           {children}
            </div>
            <Footer/>
        </>
    )
}

export default Layout;
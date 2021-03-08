import React from 'react';
// import {Button} from "antd-mobile";
// import {fwPush} from "../common/common";
import Style from '../App.css';
import logo from "../image/404.png";

const Error = ()=>{
    return(
        <div className={Style.App_header}>
            <img src={logo} className={Style.App_logo} alt="logo"/>
            <h3>404</h3>
            <p>Sorry, the page you visited does not exist.</p>
            {/*<Button  size="small" type="primary" onClick={() => fwPush('/home')}>*/}
            {/*    Back Home*/}
            {/*</Button>*/}
            <footer className={Style.footer}>
                <span>Copyright © VRC, Inc. All Rights Reserved.</span>
            </footer>
        </div>
    );
}

export  default  Error;

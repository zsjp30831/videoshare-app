import React, {Component} from 'react';
// // import {Button, Icon} from 'antd-mobile';
import logo from './admin-logo.png';
import styles from './App.css';
import LoginForm from "./user/LoginForm";

class App extends Component {
    render() {
        return (
            <div className={styles.App}>
                <header className={styles.App_header}>
                    <h3 className={styles.App_title}>
                        <img src={logo} className={styles.App_logo} alt="logo"/>Platform Demo Login
                    </h3>
                    <LoginForm/>
                    <footer className={styles.App_footer}>@VRC, INC. All Rights Reserved.</footer>
                </header>
            </div>
        );
    }
}

export default App;

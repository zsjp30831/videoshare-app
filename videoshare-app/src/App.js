import React, {Component} from 'react';
import {Button, Icon} from 'antd-mobile';
import styles from './App.css';
import LoginForm from "./user/LoginForm";

class App extends Component {
    render() {
        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <LoginForm/>
                </header>
            </div>
        );
    }
}

export default App;

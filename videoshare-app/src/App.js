import React, {Component} from 'react';
import styles from './App.css';
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Error from "./components/404";
import {Route,Switch} from "react-router-dom"

class App extends Component {
    render() {
        return (
            <div>
                <Switch >
                    <Route exact path='/' component={LoginForm}/>
                    <Route path='/home' component={Home}/>
                    <Route component={Error}/>
                </Switch>
            </div>

        );

    }
}

export default App;

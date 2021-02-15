import React, {Component} from 'react';
import NameInput from "./components/NameInput";
import AutoLogin from "./components/AutoLogin";
import Login from "./components/Login";
import Home from "./components/Home";
import VrcPlayer from "./components/VrcPlayer";
import Error from "./components/404";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import {Route, Switch} from "react-router-dom"
import Styles from './App.css'

class App extends Component {
    render() {
        return (
            <div className={Styles.App}>
                <Switch>
                    <Route exact path='/' component={Login}/>
                    <Route path='/autologin' component={AutoLogin}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/player' component={VrcPlayer}/>
                    <Route path='/nameinput' component={NameInput}/>
                    <Route path='/home' component={Home}/>
                    <Route path='/privacy' component={Privacy}/>
                    <Route path='/terms' component={Terms}/>
                    <Route component={Error}/>
                </Switch>
            </div>
        );

    }
}

export default App;

import React, {Component} from 'react';
import NameInput from "./components/NameInput";
import Login from "./components/Login";
import Home from "./components/Home";
import VrcPlayerEx from "./components/VrcPlayerEx";
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
                    <Route path='/login' component={Login}/>
                    <Route path='/player' component={VrcPlayerEx}/>
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

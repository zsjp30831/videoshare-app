import React, {Component} from 'react';
import Login from "./components/Login";
import Home from "./components/Home";
import Error from "./components/404";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import {Route, Switch} from "react-router-dom"

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Login}/>
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

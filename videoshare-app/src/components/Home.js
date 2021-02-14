import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwInitAuth} from "../common/common";

var urlInfoList = {};

class Home extends Component {

    constructor(props) {
        super(props);
        var obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            urlInfoList = this.props.location.state.msg;
        }
        // console.log(urlInfoList);
    }

    componentDidMount() {
        fwInitAuth(() => {});
    }

    render() {
        let players = [];
        if (urlInfoList && urlInfoList.length > 0) {
            urlInfoList.forEach((item, index) => {
                players.push(<VrcPlayer srcUrl={item.videoUrl} key={index}
                                          poster={item.postUrl}/>);
            });
        }

        return (
            <div className={Styles.center}>
                {players}
            </div>
        );
    }

}

export default Home;

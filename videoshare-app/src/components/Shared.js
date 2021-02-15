import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwInitAuth} from "../common/common";


class Shared extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlInfo: '',
        };
    }

    componentDidMount() {

        var obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            //userInfo = this.props.location.state.msg;
        }

        fwInitAuth(() => {
            // fwCallServiceByKeyDirect();
        });
    }

    render() {
        const {urlInfo} = this.state;
        return (
            <div className={Styles.center}>
                <VrcPlayer srcUrl={urlInfo.videoUrl}
                           poster={urlInfo.postUrl}/>)
            </div>
        );
    }


}

export default Shared;

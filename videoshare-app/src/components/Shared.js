import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwInitAuth, fwIsEmpty} from "../common/common";


class Shared extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlInfo: {},
        };
    }

    updateUI = (param) => {
        this.setState({urlInfo: param});
    }


    componentDidMount() {
        var obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            //userInfo = obj.msg;
        }

        fwInitAuth(() => {
            // fwCallServiceByKeyDirect();
            let respones = {
                videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                postUrl: "https://video-react.js.org/assets/poster.png",
            }

            this.updateUI(respones);
        });
    }

    render() {
        const {urlInfo} = this.state;
        if (fwIsEmpty(urlInfo)) {
            return null;
        }

        return (
            <div className={Styles.center}>
                <VrcPlayer srcUrl={urlInfo.videoUrl}
                           poster={urlInfo.postUrl}/>
            </div>
        );
    }

}

export default Shared;
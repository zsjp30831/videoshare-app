import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwCallServiceByKeyDirect, fwInitAuth, fwIsEmpty} from "../common/common";
import UrlConfig from "../config";


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

        fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsUnAuth, token, postData, function onSuccess(response) {

            },
            function onError(err) {

            }
        );

        fwInitAuth(() => {

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

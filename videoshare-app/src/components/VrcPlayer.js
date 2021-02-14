import React, {Component, Fragment} from 'react';
import Styles from './VrcPlayer.css'
import {WhiteSpace, NavBar, ActionSheet} from 'antd-mobile';
import Share from "../image/share.png";
import Line from "../image/line.png";
import Twitter from "../image/twitter.png";
import YouTube from "../image/youtube.png";
import Facebook from "../image/facebook.png";
import Wechat from "../image/wechat.png";
import Copy from "../image/copy.png";
import AuthPicker from "./AuthPicker";

import {
    Player,
    ControlBar,
    BigPlayButton,
    VolumeMenuButton
} from 'video-react';


import "../../../videoshare-app/node_modules/video-react/dist/video-react.css";

// import  "./video-react.css";


class VrcPlayerEx extends Component {

    constructor() {
        super();
        this.state = {
            clicked: 'none',
            authLevel:'Unlock',
        };
    }

    handleAuthChange= (item) =>{
        this.setState({authLevel: item});
    }

    doShare = (index) => {
        if (index > -1) {
            // alert(this.dataList[index].title);
            // alert(this.state.authLevel);


        }
    }

    dataList = [
        {url: 'OpHiXAcYzmPQHcdlLFrc', title: 'Copy', icon: Copy},
        {url: 'OpHiXAcYzmPQHcdlLFrc', title: 'Line', icon: Line},
        {url: 'OpHiXAcYzmPQHcdlLFrc', title: 'Twitter', icon: Twitter},
        {url: 'wvEzCMiDZjthhAOcwTOu', title: 'YouTube', icon: YouTube},
        {url: 'cTTayShKtEIdQVEMuiWt', title: 'Facebook', icon: Facebook},
        {url: 'umnHwvEgSyQtXlZjNJTt', title: 'Wechat', icon: Wechat},
    ].map(obj => ({
        icon: <img src={obj.icon} alt={obj.title}
                   style={{width: 40}}/>,
        title: obj.title,
    }));


    showShareActionSheet = () => {
        ActionSheet.showShareActionSheetWithOptions({
                options: this.dataList,
                title:'共有',
                message: <AuthPicker handleAuthChange={this.handleAuthChange.bind(this)} />,
                cancelButtonText: 'キャンセル',
            },
            (buttonIndex, rowIndex) => {
                this.doShare(buttonIndex);
                // this.setState({clicked: buttonIndex > -1 ? this.dataList[buttonIndex].title : 'cancel'});
            });
    }

    render() {
        return (
            <Fragment>
                <div style={{width: 400, height: 300}}>
                    <NavBar
                        className={Styles.NavBar}
                        mode="light"
                        rightContent={[
                            <img src={Share} className={Styles.logo} alt="share"
                                 onClick={this.showShareActionSheet}/>
                        ]}
                    >
                        卒業証書授与動画
                    </NavBar>
                    <Player poster={this.props.poster}>
                        <source src={this.props.srcUrl} type="video/mp4"/>
                        <BigPlayButton position="center"/>
                        <ControlBar autoHide={true} disableDefaultControls={false}>
                            <VolumeMenuButton/>
                        </ControlBar>
                    </Player>
                </div>
                <WhiteSpace/>
            </Fragment>
        )
    }
}


export default VrcPlayerEx;

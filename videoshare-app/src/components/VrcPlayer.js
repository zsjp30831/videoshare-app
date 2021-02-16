import React, {Component, Fragment} from 'react';
import Styles from './VrcPlayer.css'
import {NavBar, ActionSheet} from 'antd-mobile';
import PlayerTitle from './PlayerTitle'
import {fwCallApp, fwSuccess} from '../common/common'
import copy from 'copy-to-clipboard';
import Share from "../image/share.png";
import Line from "../image/line.png";
import Twitter from "../image/twitter.png";
import YouTube from "../image/youtube.png";
import Facebook from "../image/facebook.png";
// import Wechat from "../image/wechat.png";
import CopyIcon from "../image/copy.png";
import AuthPicker from "./AuthPicker";
import logo from "../image/admin-logo.png";
import {
    Player,
    ControlBar,
    BigPlayButton,
    VolumeMenuButton
} from 'video-react';


import "../../../videoshare-app/node_modules/video-react/dist/video-react.css";

// import  "./video-react.css";


class VrcPlayer extends Component {

    constructor() {
        super();
        this.state = {
            clicked: 'none',
            authLevel: 'Unlock',
        };
    }

    handleAuthChange = (item) => {
        this.setState({authLevel: item});
    }

    doShare = (index) => {
        if (index > -1) {
            // alert(this.dataList[index].title);
            // alert(this.state.authLevel);
            // alert(this.props.srcUrl);
            if (index > 0) {
                fwCallApp(index, document.location.href+'/shared');
            } else {
                // url copy
                console.log(document.location.href);
                copy(document.location.href+'/shared');
                fwSuccess('コピーされました');
            }
        }
    }

    dataList = [
        {title: 'Copy', icon: CopyIcon},
        {title: 'Line', icon: Line},
        {title: 'Twitter', icon: Twitter},
        {title: 'YouTube', icon: YouTube},
        {title: 'Facebook', icon: Facebook},
        // {title: 'Wechat', icon: Wechat},
    ].map(obj => ({
        icon: <img src={obj.icon} alt={obj.title}
                   style={{width: 40}}/>,
        title: obj.title,
    }));


    showShareActionSheet = () => {
        ActionSheet.showShareActionSheetWithOptions({
                options: this.dataList,
                title: '共有',
                message: <AuthPicker handleAuthChange={this.handleAuthChange.bind(this)}/>,
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
                        icon={<img src={logo} className={Styles.logo} alt=""/>}
                        mode="light"
                        rightContent={[
                            <img key="0" src={Share} className={Styles.share} alt="share"
                                 onClick={this.showShareActionSheet}/>
                        ]}
                    >
                        <PlayerTitle title="卒業証書授与動画"
                                     owner="zs30831"
                                     frequency="100"
                                     createDate="2021-2-15"
                        />
                    </NavBar>
                    <Player poster={this.props.poster}>
                        <source src={this.props.srcUrl} type="video/mp4"/>
                        <BigPlayButton position="center"/>
                        <ControlBar autoHide={true} disableDefaultControls={false}>
                            <VolumeMenuButton/>
                        </ControlBar>
                    </Player>
                </div>
            </Fragment>
        )
    }
}


export default VrcPlayer;

import React, {Component, Fragment} from 'react';
import Styles from './VrcPlayer.css'
import {NavBar, ActionSheet, WhiteSpace} from 'antd-mobile';
import PlayerTitle from './PlayerTitle'
import {fwCallApp, fwCallServiceByKeyDirect, fwErrorMessage, fwInitAuth, fwSuccess, fwUnLoading} from '../common/common'
import copy from 'copy-to-clipboard';
import Share from "../image/share.png";
import Line from "../image/line.png";
import Twitter from "../image/twitter.png";
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
import UrlConfig from "../config";

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
            // authLevel設定
            let postData = {
                ContentId: this.props.contentId,
                Authority: this.state.authLevel === 'Unlock' ? 0 : 1,
            }
            copy(document.location.href + '/shared?cid=' + postData.ContentId,{
                onCopy:(text)=>{
                   console.log(postData);
                    fwInitAuth((token) => {
                        fwCallServiceByKeyDirect(UrlConfig.SetMediaContentsAuthorityURL, token, postData, function onSuccess(response) {
                                fwUnLoading();
                                // console.log(response);
                                if (response && response.data && response.data.Status === 'OK') {
                                    // console.log(document.location.href);
                                    if (index > 0) {
                                        fwCallApp(index, document.location.href + '/shared?cid=' + encodeURIComponent(postData.ContentId));
                                    } else {
                                        // url copy icon
                                        // copy(document.location.href + '/shared?cid=' + postData.ContentId);
                                        fwSuccess('コピーされました');
                                    }
                                } else {
                                    fwErrorMessage("権限設定失敗しました。");
                                }
                            },
                            function onError(err) {
                                fwErrorMessage("権限設定例外が発生しました。");
                            }
                        );
                    });
                } // end of onCopy
            });

            // console.log(postData);
            // fwInitAuth((token) => {
            //     fwCallServiceByKeyDirect(UrlConfig.SetMediaContentsAuthorityURL, token, postData, function onSuccess(response) {
            //             fwUnLoading();
            //             // console.log(response);
            //             if (response && response.data && response.data.Status === 'OK') {
            //
            //                 if (index > 0) {
            //                     fwCallApp(index, document.location.href + '/shared?cid=' + encodeURIComponent(postData.ContentId));
            //                 } else {
            //                     // url copy icon
            //                     // console.log(document.location.href);
            //                     copy(document.location.href + '/shared?cid=' + postData.ContentId);
            //                     fwSuccess('コピーされました');
            //                 }
            //             } else {
            //                 fwErrorMessage("権限設定失敗しました。");
            //             }
            //         },
            //         function onError(err) {
            //             fwErrorMessage("権限設定例外が発生しました。");
            //         }
            //     );
            // });
        }
    }

    dataList = [
        {title: 'Copy', icon: CopyIcon},
        {title: 'Line', icon: Line},
        {title: 'Twitter', icon: Twitter},
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
                message: <AuthPicker key="0" handleAuthChange={this.handleAuthChange.bind(this)} />,
                cancelButtonText: 'キャンセル',
            },
            (buttonIndex, rowIndex) => {
                this.doShare(buttonIndex);
                // this.setState({clicked: buttonIndex > -1 ? this.dataList[buttonIndex].title : 'cancel'});
            });
    }

    render() {
        const {title, owner, frequency, createDt, srcUrl, poster} = this.props;
        return (
            <Fragment>
                <div style={{width: 400, height: 300, margin: 20}}>
                    <NavBar
                        className={Styles.NavBar}
                        icon={<img src={logo} className={Styles.logo} alt=""/>}
                        mode="light"
                        rightContent={[
                            <img key="0" src={Share} className={Styles.share} alt="share"
                                 onClick={this.showShareActionSheet}/>
                        ]}
                    >
                        <PlayerTitle key="1"
                                     title={title}
                                     owner={owner}
                                     frequency={frequency}
                                     createDate={createDt}
                        />
                    </NavBar>
                    <Player poster={poster} fluid={false} width={'100%'} height={'90%'}>
                        <source src={srcUrl} type="video/mp4"/>
                        <BigPlayButton position="center"/>
                        <ControlBar autoHide={true} disableDefaultControls={false}>
                            <VolumeMenuButton/>
                        </ControlBar>
                    </Player>
                    <WhiteSpace size={'lg'}/>
                </div>
            </Fragment>
        )
    }
}


export default VrcPlayer;

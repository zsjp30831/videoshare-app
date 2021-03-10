import React, {Component, Fragment} from 'react';
import Styles from './VrcPlayer.css'
import {NavBar, ActionSheet, WhiteSpace, Icon, Modal, Toast} from 'antd-mobile';
import PlayerTitle from './PlayerTitle'
import {
    fwCallApp,
    fwCallServiceByKeyDirect,
    fwErrorMessage,
    fwInitAuth,
    fwSuccess,
    fwSuccessEx,
    fwUnLoading
} from '../common/common'
import copy from 'copy-to-clipboard';
// import Share from "../image/share.png";
import Line from "../image/line.png";
import Twitter from "../image/twitter.png";
import Facebook from "../image/facebook.png";
import CopyIcon from "../image/copy.png";
import AuthPicker from "./AuthPicker";
import logo from "../image/people-b.png";
import downloadIcon from "../image/download.png";
import Delete from "../image/delete.png";
import {
    Player,
    ControlBar,
    BigPlayButton,
    VolumeMenuButton
} from 'video-react';

import "../../../videoshare-app/node_modules/video-react/dist/video-react.css";
import UrlConfig from "../config";

const alertM = Modal.alert;


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

    doShare = (index, rowNo) => {
        if (index > -1) {
            switch (rowNo) {
                case 0:
                    // authLevel設定
                    let postData = {
                        ContentId: this.props.contentId,
                        Authority: this.state.authLevel[0] === 'Unlock' ? 0 : 1,
                    }
                    // copy
                    let sharedUrl = document.location.href.substr(0, document.location.href.length - 8) + '/shared?cid=' + postData.ContentId;
                    copy(sharedUrl);

                    let title = this.props.title;
                    // console.log(postData);
                    // alert(postData.Authority);
                    fwInitAuth((token) => {
                        fwCallServiceByKeyDirect(UrlConfig.SetMediaContentsAuthorityURL, token, postData, function onSuccess(response) {
                                fwUnLoading();
                                // console.log(response);
                                if (response && response.data && response.data.Status === 'OK') {
                                    // console.log(document.location.href);
                                    if (index > 0) {
                                        if (!title) {
                                            title = "AvarU App Shared:"
                                        }
                                        fwCallApp(index, sharedUrl, title);
                                    } else {
                                        // url copy icon
                                        fwSuccess('コピーされました.');
                                    }
                                } else {
                                    fwErrorMessage("権限設定失敗しました.");
                                }
                            },
                            function onError(err) {
                                fwErrorMessage("権限設定例外が発生しました.");
                            }
                        );
                    });
                    break;
                case 1:
                    // download
                    if (index === 0) {
                        let postData = {
                            ContentId: this.props.contentId
                        }
                        fwInitAuth((token) => {
                            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsDownloadURL, token, postData, function onSuccess(response) {
                                    // console.log(response);
                                    if (response && response.data && response.data.Status === 'OK') {
                                        fwSuccessEx(`ダウンロードURLが「${response.data.Email}」に送信しました。ご確認お願い致します。`, 5);
                                    } else {
                                        fwErrorMessage("ダウンロード失敗しました.");
                                    }
                                },
                                function onError(err) {
                                    fwErrorMessage("ダウンロード例外が発生しました.");
                                }
                            );
                        });
                    }
                    //delete
                    if (index === 1) {
                        // messagebox
                        alertM('削除', '削除しますか?', [
                            { text: '取消', onPress: () => { } },
                            {
                                text: '確定',
                                onPress: () =>{
                                    let postData = {
                                        ContentId: this.props.contentId
                                    }
                                    fwInitAuth((token) => {
                                        fwCallServiceByKeyDirect(UrlConfig.DeleteMediaContentsURL, token, postData, function onSuccess(response) {
                                                // console.log(response);
                                                if (response && response.data && response.data.Status === 'OK') {
                                                    Toast.success("削除しました.",1,()=>{
                                                        window.location.reload(true);
                                                    });
                                                } else {
                                                    fwErrorMessage("ダウンロード失敗しました.");
                                                }
                                            },
                                            function onError(err) {
                                                fwErrorMessage("ダウンロード例外が発生しました.");
                                            }
                                        );
                                    });
                                },
                            },
                        ])
                    }
                    break;
                default:
                    break;
            }
        }
    }

    dataList = [
        {title: 'Copy', icon: CopyIcon},
        {title: 'Line', icon: Line},
        {title: 'Twitter', icon: Twitter},
        {title: 'Facebook', icon: Facebook},
        {title: 'Download', icon: downloadIcon},
        {title: 'Delete', icon: Delete},
        // {title: 'Wechat', icon: Wechat},
    ].map(obj => ({
        icon: <img src={obj.icon} alt={obj.title}
                   style={{width: 40}}/>,
        title: obj.title,
    }));


    showShareActionSheet = () => {
        const data = [[this.dataList[0], this.dataList[1], this.dataList[2], this.dataList[3],], [this.dataList[4], this.dataList[5]]];
        ActionSheet.showShareActionSheetWithOptions({
                options: data,
                title: '共有',
                message: <AuthPicker handleAuthChange={this.handleAuthChange.bind(this)}/>,
                cancelButtonText: 'キャンセル',
            },
            (buttonIndex, rowIndex) => {
                this.doShare(buttonIndex, rowIndex);
                // this.setState({clicked: buttonIndex > -1 ? this.dataList[buttonIndex].title : 'cancel'});
            });
    }

    render() {
        const {title, owner, frequency, createDt, srcUrl, poster, share} = this.props;
        return (
            <Fragment>
                <div style={{width: 400, height: 300, margin: 20}}>
                    <Player poster={poster} fluid={false} width={'100%'} height={'90%'}>
                        <source src={srcUrl} type="video/mp4"/>
                        <BigPlayButton position="center"/>
                        <ControlBar autoHide={true} disableDefaultControls={false}>
                            <VolumeMenuButton/>
                        </ControlBar>
                    </Player>
                    <WhiteSpace size={'lg'}/>
                    <NavBar
                        className={Styles.NavBar}
                        icon={<img src={logo} className={Styles.logo} alt=""/>}
                        mode="light"
                        rightContent={[
                            // share && (<img key="0" src={Share} className={Styles.share}
                            //                alt="share"
                            //                onClick={this.showShareActionSheet}/>)
                            share && (<Icon key="1" type="ellipsis" onClick={this.showShareActionSheet}/>)
                        ]}
                    >
                        <PlayerTitle key="1"
                                     title={title}
                                     owner={owner}
                                     frequency={frequency}
                                     createDate={createDt}
                        />
                    </NavBar>
                    <WhiteSpace size={'lg'}/>
                </div>
            </Fragment>
        )
    }
}


export default VrcPlayer;

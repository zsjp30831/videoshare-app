import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwErrorMessage, fwInitAuth, fwCallServiceByKeyDirect, fwLoading, fwUnLoading} from "../common/common";
import UrlConfig from '../config';

let handler;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlInfoList: [],
        };
        this.dataPolling = this.dataPolling.bind(this);
    }

    updateUI = (param) => {
        this.setState({urlInfoList: param});
    }

    dataPolling = (postData) => {
        handler = this;
        let timer = this.pollingTimer;
        console.log(postData);
        fwInitAuth((token) => {
            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsStatusURL, token, postData, function onSuccess(response) {
                    if (response && response.data) {
                        let status = response.data.PStatus;
                        if (status === 'Completed') {
                            timer && clearInterval(timer);
                            console.log("step1");
                            // videoListを取得する
                            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsListURL, token, "", function onSuccess(response) {
                                    if (response && response.data && response.data.ContentIdList) {
                                        console.log("step2");
                                        console.log(response.data.ContentIdList.length);

                                        let urlInfoList = [];
                                        response.data.ContentIdList.forEach((item, index) => {
                                            let pstData = {
                                                ContentId: item,
                                            }

                                            // videoItemを取得する
                                            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsURL, token, pstData, function onSuccess(response) {
                                                    fwUnLoading();
                                                    if (response && response.data && response.data.Contents) {
                                                        urlInfoList.push(response.data.Contents);
                                                        if (index === 5) {

                                                            handler.updateUI(urlInfoList);
                                                            console.log("stepyyy");
                                                        }
                                                        console.log("stepxxx");

                                                    } else {
                                                        fwErrorMessage("動画が存在しません。");
                                                    }
                                                },
                                                function onError(err) {
                                                    fwErrorMessage("例外が発生しました。");
                                                }
                                            );

                                        });
                                        console.log(urlInfoList);
                                    } else {
                                        fwErrorMessage("動画が存在しません。");
                                    }
                                },
                                function onError(err) {
                                    fwErrorMessage("例外が発生しました。");
                                }
                            );
                        } else if (status !== 'Failed') {
                            fwLoading("動画作成中、少々お待ちください。。。");
                        } else {
                            fwErrorMessage("通信エラーが発生しました。");
                            timer && clearInterval(timer);
                        }
                    } else {
                        fwErrorMessage("通信エラーが発生しました。");
                        timer && clearInterval(timer);
                    }
                },
                function onError(err) {
                    fwErrorMessage("例外が発生しました。");
                    timer && clearInterval(timer);
                }
            );
        });
    }

    componentDidMount() {
        let contentId = null;
        let obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            contentId = this.props.location.state.msg;
        }

        if (!contentId) {
            fwErrorMessage("コンテンツIDが未存在する。");
            return;
        }

        // console.log(contentId);

        let postData = {
            ContentId: contentId,
        };
        this.pollingTimer = setInterval(
            () => {
                this.dataPolling(postData);
            },
            3000);
    }

    componentWillUnmount() {
        this.pollingTimer && clearInterval(this.pollingTimer);
    }


    render() {
        const {urlInfoList} = this.state;
        let players = [];
        if (urlInfoList && urlInfoList.length > 0) {
            urlInfoList.forEach((item, index) => {
                players.push(<VrcPlayer key={index}
                                        owner={item.VrcId}
                                        contentId={item.ContentId}
                                        frequency={item.AccessCount}
                                        createDt={item.CreateTime}
                                        srcUrl={item.Url}
                                        title={item.Title}
                                        poster=""/>);
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

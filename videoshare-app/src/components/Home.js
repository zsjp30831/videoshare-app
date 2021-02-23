import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwErrorMessage, fwInitAuth, fwCallServiceByKeyDirect, fwLoading, fwUnLoading, fwPush} from "../common/common";
import UrlConfig from '../config';
import {getVrcId} from "../common/cognito-auth";
import {Button} from "antd-mobile";

var handler;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlInfoList: [],
        };
    }

    updateUI = (param) => {
        this.setState({urlInfoList: param});
    }

    getVideoList = () => {
        fwLoading();
        handler = this;
        fwInitAuth((token) => {
            let postData = {
                VrcId: getVrcId(),
            };
            // videoListを取得する
            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsListURL, token, postData, function onSuccess(response) {
                    if (response && response.data && response.data.ContentIdList) {
                        // console.log(response.data.ContentIdList.length);
                        let length = response.data.ContentIdList.length;

                        let urlInfoList = [];
                        response.data.ContentIdList.forEach((item, index) => {
                            let pstData = {
                                ContentId: item,
                                VrcId: getVrcId(),
                            };

                            // if (index > 5) {
                            //     fwUnLoading();
                            //     return;
                            // }

                            // videoItemを取得する
                            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsURL, token, pstData, function onSuccess(response) {
                                    if (index === length - 1) {
                                        fwUnLoading();
                                    }
                                    if (response && response.data && response.data.Contents) {
                                        urlInfoList.push(response.data.Contents);
                                        handler.updateUI(urlInfoList);
                                    } else {
                                        // fwErrorMessage("動画が存在しません。");
                                    }
                                },
                                function onError(err) {
                                    fwErrorMessage("動画取得例外が発生しました。");
                                }
                            );
                        });
                        // console.log(urlInfoList);
                    } else {
                        fwErrorMessage("動画が存在しません。");
                    }
                },
                function onError(err) {
                    fwErrorMessage("動画一覧取得例外が発生しました。");
                }
            );
        });
    }

    componentDidMount() {

        // let obj = this.props.location.state;
        // if (obj && obj.hasOwnProperty('msg')) {
        //     email = this.props.location.state.msg;
        // }
        // console.log(email);

        this.getVideoList();
    }

    onSubmit=()=>{
        fwPush('/nameinput');
    }

    render() {
        // console.log("render");
        const {urlInfoList} = this.state;
        let players = [];
        if (urlInfoList && urlInfoList.length > 0) {
            urlInfoList.forEach((item, index) => {
                players.push(<VrcPlayer key={index}
                                        owner={item.VrcId}
                                        contentId={item.ContentId}
                                        frequency={item.AccessCount}
                                        createDt={item.CreateTime}
                                        srcUrl={item.Url} // "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                                        title={item.Title}
                                        share={true}
                                        download={false}
                                        poster=""/>);
            });
        }

        return (
            <div className={Styles.center}>
                {players}
                <footer className={Styles.footer}>
                    <Button className={Styles.submit} type='primary' onClick={this.onSubmit}>卒業式動画作成</Button>
                </footer>
            </div>
        );
    }

}

export default Home;

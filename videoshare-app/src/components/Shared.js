import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {
    fwCallServiceDirect,
    fwCallServiceByKeyDirect,
    fwErrorMessage,
    fwInitAuth,
    fwIsEmpty,
    fwLoading,
    fwError,
    fwUnLoading
} from "../common/common";
import UrlConfig from "../config";

let handler;

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
        handler = this;
        // console.log(this.props.location.search);
        const query = this.props.location.search;
        const arr = query.split('?') // ['shared', 'cid=xxxxxx&']
        if (arr && arr.length > 1) {
            var pram = new URLSearchParams('?'+arr[1]);
            let contentId = pram.get('cid');
            let postData = {
                ContentId: contentId,
            };
            console.log(postData);
            fwLoading();
            fwCallServiceDirect(UrlConfig.GetMediaContentsUnAuth, postData, function onSuccess(response) {
                    console.log(response);
                    if (response && response.data) {
                        let status = response.data.Status
                        if (status === 'RequireLogin') {
                            // fwPush("/login");
                            fwError("/login");
                        } else if (status === 'OK') {
                            //動画取得する
                            fwInitAuth((token) => {
                                fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsURL, token, postData, function onSuccess(response) {
                                        fwUnLoading();
                                        console.log(response.data);
                                        handler.updateUI(response.data.Contents);
                                    },
                                    function onError(err) {
                                        fwErrorMessage("動画取得例外が発生しました。");
                                    }
                                );
                            });
                        } else {
                            fwErrorMessage("権限取得エラーが発生しました。");
                        }
                    } else {
                        fwErrorMessage("権限取得失敗が発生しました。");
                    }

                },
                function onError(err) {
                    fwErrorMessage("権限取得例外が発生しました。");
                }
            );

        }else{
            fwErrorMessage("請求url不正。");
            return;
        }
    }

    render() {
        const {urlInfo} = this.state;
        if (fwIsEmpty(urlInfo)) {
            return null;
        }

        return (
            <div className={Styles.center}>
                <VrcPlayer owner={urlInfo.VrcId}
                           contentId={urlInfo.ContentId}
                           frequency={urlInfo.AccessCount}
                           createDt={urlInfo.CreateTime}
                           srcUrl={urlInfo.Url} // "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                           title={urlInfo.Title}
                           poster=""/>);
            </div>
        );
    }

}

export default Shared;

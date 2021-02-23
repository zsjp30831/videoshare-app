import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {
    fwCallServiceDirect,
    fwCallServiceByKeyDirect,
    fwErrorMessage,
    fwgetAWSToken,
    fwIsEmpty,
    fwLoading,
    fwError,
    fwUnLoading,
    fwAddMeta
} from "../common/common";
import UrlConfig from "../config";
import 'url-search-params-polyfill';

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
            var pram = new URLSearchParams('?' + arr[1]);
            let contentId = pram.get('cid');
            let cid;
            if (contentId && contentId.length > 24) {
                cid = contentId.substr(0, 24);
            } else {
                cid = contentId;
            }

            let postData = {
                ContentId: cid,
            };
            // console.log(postData);
            fwLoading();
            fwCallServiceDirect(UrlConfig.GetMediaContentsUnAuth, postData, function onSuccess(response) {
                    // console.log(response);
                    if (response && response.data) {
                        let status = response.data.Status
                        if (status === 'RequireLogin') {
                            fwgetAWSToken(function onSuccess(token) {
                                    fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsURL, token, postData, function onSuccess(response) {
                                            // console.log(response);
                                            fwUnLoading();
                                            //動画表示
                                            handler.updateUI(response.data.Contents);
                                        },
                                        function onError() {
                                            fwError("動画取得失敗しました。");
                                        }
                                    );
                                },
                                function onError() {
                                    fwError("サインインしてください。");
                                }
                            );
                        } else if (status === 'OK') {
                            fwUnLoading();
                            //動画表示
                            handler.updateUI(response.data.Contents);
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

        } else {
            fwErrorMessage("請求url不正。");
            return;
        }
    }

    render() {
        const {urlInfo} = this.state;
        if (fwIsEmpty(urlInfo)) {
            return null;
        }

        // twitter card display 作成
        let playerUrl = "https://d2lyotf9hzix2g.cloudfront.net/shared?cid=" + urlInfo.ContentId;
        fwAddMeta("twitter:card", "player");
        fwAddMeta("twitter:site", "@AvarU");
        fwAddMeta("twitter:title", urlInfo.Title);
        fwAddMeta("twitter:player", playerUrl);
        fwAddMeta("twitter:player:width", "480");
        fwAddMeta("twitter:player:height", "480");

        // facebook display 作成
        fwAddMeta("og:type", "@AvarU");
        fwAddMeta("og:image", "https://video-react.js.org/assets/poster.png");
        fwAddMeta("og:title", urlInfo.Title);
        fwAddMeta("og:url", playerUrl);

        return (
            <div className={Styles.center}>
                <VrcPlayer owner={urlInfo.VrcId}
                           contentId={urlInfo.ContentId}
                           frequency={urlInfo.AccessCount}
                           createDt={urlInfo.CreateTime}
                           srcUrl={urlInfo.Url} // "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                           title={urlInfo.Title}
                           share={false}
                           download={false}
                           poster=""/>
            </div>
        );
    }

}

export default Shared;

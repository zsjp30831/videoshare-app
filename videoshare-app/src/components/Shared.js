import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Shared.css'
import {
    fwCallServiceDirect,
    fwCallServiceByKeyDirect,
    fwErrorMessage,
    fwgetAWSToken,
    fwIsEmpty,
    fwLoading,
    fwError,
    fwUnLoading,
} from "../common/common";
import UrlConfig from "../config";
import 'url-search-params-polyfill';
import hus from "../image/hus_sv.png";
import vrc from "../image/vrc.png";
import nine from "../image/nine.png";
import {Flex} from 'antd-mobile';

let handler;

class Shared extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlInfo: {},
        };
        document.oncontextmenu = () => {
            return false
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
                                    fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsAuthURL, token, postData, function onSuccess(response) {
                                            // console.log(response);
                                            fwUnLoading();
                                            //動画表示
                                            handler.updateUI(response.data.Contents);
                                        },
                                        function onError() {
                                            fwErrorMessage("動画取得失敗しました。");
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

        return (
            <div className={Styles.center}>
                <div className={Styles.title}>
                    バーチャル学位記授与式
                </div>
                <VrcPlayer owner={urlInfo.DispName}
                           contentId={urlInfo.ContentId}
                           frequency={urlInfo.AccessCount}
                           createDt={urlInfo.CreateTime}
                           srcUrl={urlInfo.Url} // "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                           title={urlInfo.Title}
                           share={false}
                           poster=""/>
                <footer className={Styles.footer}>
                    <Flex>
                        <Flex.Item>
                            <a href="https://www.hus.ac.jp/" target="_blank" rel="noopener noreferrer">
                                <img src={hus} className={Styles.hus} alt="HUS" />
                            </a>
                            {/*<WhiteSpace/>*/}
                            {/*<div className={Styles.husText}>北海道科学大学</div>*/}
                        </Flex.Item>
                        <Flex.Item>
                            <a href="https://9nine-hakama.jp/" target="_blank" rel="noopener noreferrer">
                                <img src={nine} className={Styles.nine} alt="nine" />
                            </a>
                            {/*<WhiteSpace/>*/}
                            {/*<div className={Styles.nineText}>株式会社9</div>*/}
                        </Flex.Item>
                        <Flex.Item>
                            <a href="https://www.vrcjp.com/" target="_blank" rel="noopener noreferrer">
                                <img src={vrc} className={Styles.vrc} alt="VRC" />
                            </a>
                            {/*<WhiteSpace/>*/}
                            {/*<div className={Styles.vrcText}>株式会社VRC</div>*/}
                        </Flex.Item>
                    </Flex>
                </footer>
            </div>
        );
    }

}

export default Shared;

import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwErrorMessage, fwInitAuth, fwCallServiceByKeyDirect, fwLoading} from "../common/common";
import UrlConfig from '../config';

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


    componentDidMount() {
        let contentId = null;
        var obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            contentId = this.props.location.state.msg;
        }
        if (!contentId) {
            fwErrorMessage("コンテンツIDが未存在する。");
            return;
        }

        console.log(contentId);

        fwInitAuth((token) => {

            let postData = {
                ContentId: contentId,
            };
　　　　　　　　


            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsStatusURL, token, postData, function onSuccess(response) {
                    if (response && response.data){
                        if(response.data.PStatus ==='Ready'){
                            fwLoading("動画作成中、少々お待ちください。")
                        }

                    }else{
                        fwErrorMessage("通信エラーが発生しました。");
                    }
                },
                function onError(err) {
                    fwErrorMessage("通信エラーが発生しました。");
                }
            );
            // let urlInfoList = [
            //     {
            //         videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            //         postUrl: "https://video-react.js.org/assets/poster.png"
            //     },
            //     {
            //         videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            //         postUrl: ""
            //     },
            //     {
            //         videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            //         postUrl: "https://video-react.js.org/assets/poster.png"
            //     },
            //     {
            //         videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            //         postUrl: "https://video-react.js.org/assets/poster.png"
            //     },
            //     {
            //         videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            //         postUrl: "https://video-react.js.org/assets/poster.png"
            //     },
            // ];

            // this.updateUI(urlInfoList);
        });

    }

    render() {
        const {urlInfoList} = this.state;
        let players = [];
        if (urlInfoList && urlInfoList.length > 0) {
            urlInfoList.forEach((item, index) => {
                players.push(<VrcPlayer srcUrl={item.videoUrl} key={index}
                                        poster={item.postUrl}/>);
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

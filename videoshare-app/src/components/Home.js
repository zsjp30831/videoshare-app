import React, {Component} from 'react';
import VrcPlayer from "./VrcPlayer";
import Styles from './Home.css'
import {fwInitAuth} from "../common/common";


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
        var obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('msg')) {
            //userInfo = this.props.location.state.msg;
        }
        // console.log(userInfo);


        fwInitAuth(() => {

            // fwCallServiceByKeyDirect();
           let  urlInfoList = [
                {
                    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                    postUrl: "https://video-react.js.org/assets/poster.png"
                },
                {
                    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                    postUrl: ""
                },
                {
                    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                    postUrl: "https://video-react.js.org/assets/poster.png"
                },
                {
                    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                    postUrl: "https://video-react.js.org/assets/poster.png"
                },
                {
                    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                    postUrl: "https://video-react.js.org/assets/poster.png"
                },
            ];

            this.updateUI(urlInfoList);
        });

    }

    render() {
        const{urlInfoList}= this.state;
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

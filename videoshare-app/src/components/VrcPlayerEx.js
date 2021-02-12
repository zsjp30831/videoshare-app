import React, {Component, Fragment} from 'react';
import Styles from './VrcPlayerEx.css'
import {WhiteSpace, NavBar, Icon} from 'antd-mobile';
import {
    Player,
    ControlBar,
    BigPlayButton,
    VolumeMenuButton
} from 'video-react';


import "../../../videoshare-app/node_modules/video-react/dist/video-react.css"; // import css
// import  "./video-react.css";

class VrcPlayerEx extends Component {

    render() {
        return (
            <Fragment>
                <div style={{width: 400, height: 300}}>
                    <NavBar
                        className={Styles.NavBar}
                        mode="light"
                        rightContent={[
                            <Icon key="0" type="ellipsis" onClick={()=>{alert("hello")}} />,
                        ]}
                    >
                        卒業証書授与動画
                    </NavBar>
                    <Player poster={this.props.poster}>
                        <source src={this.props.srcUrl} type="video/mp4"/>
                        <BigPlayButton position="center"/>
                        <ControlBar autoHide={true} disableDefaultControls={false}>
                            <VolumeMenuButton/>
                        </ControlBar>
                    </Player>
                </div>
                <WhiteSpace/>
            </Fragment>
        )
    }
}


export default VrcPlayerEx;
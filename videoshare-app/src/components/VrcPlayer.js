import React from 'react';
import ReactPlayer from 'react-player'

const VrcPlayer = () => {

    return (
        <div>
            <ReactPlayer url='https://media.w3.org/2010/05/sintel/trailer_hd.mp4' playing />
        </div>
    );
}

export default VrcPlayer;

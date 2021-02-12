import React, {Component} from 'react';
import VrcPlayerEx from "./VrcPlayerEx";
import Styles from './Home.css'

// var urlInfoList =
// {
//     videoUrl:"https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
//     postUrl:"https://video-react.js.org/assets/poster.png"
//
//
// }





class Home extends Component {

    componentDidMount() {

    }


    // data = urlInfoList.map(item => {
    //     console.log(item);
    //     <VrcPlayerEx srcUrl={item.videoUrl}
    //                  poster={item.postUrl}/>
    // });

    render() {


        return (
            <div className={Styles.center}>
                <VrcPlayerEx srcUrl="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                             poster="https://video-react.js.org/assets/poster.png"/>
                <VrcPlayerEx srcUrl="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"/>
                <VrcPlayerEx srcUrl="http://media.w3.org/2010/05/bunny/movie.mp4"/>
                <VrcPlayerEx srcUrl="http://media.w3.org/2010/05/bunny/movie.mp4"/>
                <VrcPlayerEx srcUrl="http://peach.themazzone.com/durian/movies/sintel-1024-surround.mp4"
                             poster="https://video-react.js.org/assets/poster.png"/>
            </div>
        );
    }

}

export default Home;

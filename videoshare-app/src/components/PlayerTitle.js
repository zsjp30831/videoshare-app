import React, {Component} from 'react';
import Styles from './PlayerTitle.css'

class PlayerTitle extends Component {

    render() {

        return (
            <div className={Styles.title}>
                {this.props.title}
                <div className={Styles.subTitle}>
                    <span style={{fontSize: 12}}>
                        {this.props.owner}
                        ・{this.props.frequency} 回視聴
                        ・{this.props.createDate}
                    </span>
                </div>
            </div>
        );
    }

}


export default PlayerTitle;
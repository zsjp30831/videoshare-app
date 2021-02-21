import React, {Component} from 'react';
import Styles from './PlayerTitle.css';
import {fwDateFormat} from '../common/common'


class PlayerTitle extends Component {

    countFormat = (count) => {
        if (count > 10000) {
            let res = (count / 10000).toFixed(1);
            return `${res}万回視聴`;
        }
        return `${count}回視聴`;
    }

    render() {
        const {title, owner, frequency, createDate} = this.props;
        let count = this.countFormat(frequency);
        let date = fwDateFormat(createDate);
        return (
            <div className={Styles.title}>
                {title}
                <div className={Styles.subTitle}>
                    <span style={{fontSize: 12}}>
                        {owner}・{count}・{date}
                    </span>
                </div>
            </div>
        );
    }

}


export default PlayerTitle;

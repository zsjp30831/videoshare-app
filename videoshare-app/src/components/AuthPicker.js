import React, {Component} from 'react';
import {Picker, List} from "antd-mobile";
import Lock from '../image/lock.png';
import UnLock from '../image/unlock.png';

const itemStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '16px',
    height: '16px',
    marginRight: '1px',
};

const authItem = [
    {
        label:
            (<div>
                <img key="0" src={UnLock} alt="" style={{...itemStyle}}/>
                <span>誰にでも公開</span>
            </div>),
        value: 'Unlock',
    },
    {
        label:
            (<div>
                <img key="1" src={Lock} alt="" style={{...itemStyle}}/>
                <span>限定公開</span>
            </div>),
        value: 'Lock',
    },
];

class AuthPicker extends Component {

    state = {
        itemValue: ['Unlock'],
    }

    onChangeItem = (item) => {
        this.setState({
            itemValue: item,
        });
        this.props.handleAuthChange(item);
    };

    componentDidMount() {
        this.props.handleAuthChange(this.state.itemValue);
    }

    render() {
        return (
            <div>
                <Picker
                    data={authItem}
                    value={this.state.itemValue}
                    cols={1}
                    okText='確定'
                    dismissText='キャンセル'
                    onChange={this.onChangeItem}
                >
                    <List.Item arrow="horizontal">権限</List.Item>
                </Picker>
            </div>
        );
    }

}


export default AuthPicker;

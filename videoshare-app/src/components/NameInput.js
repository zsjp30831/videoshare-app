import React, {Component} from 'react'
import {Button, InputItem, Toast, WhiteSpace} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './NameInput.css'
import logo from "../image/people.png";
import {fwInitAuth, fwCallServiceByKeyDirect, fwErrorMessage, fwPush} from "../common/common";
import UrlConfig from '../config';

class NameInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initAuthFlg: false,
        };
    }

    componentDidMount() {
        fwInitAuth(() => {
            this.nameInst.focus();
            this.setState({initAuthFlg: true,});
        });
    }

    onSubmit = () => {
        // console.log(this.props.form.getFieldsValue());
        let name = this.props.form.getFieldsValue().name;
        if (name) {
            var postData = {
                Name: name,
            };

            fwCallServiceByKeyDirect(UrlConfig.CreateMediaContentsURL, "", postData, function onSuccess(result) {
                    fwPush("/home", "");
                },
                function onError(err) {
                    // console.log(err);
                    fwErrorMessage("エラーが発生しました。");
                });
        } else {
            fwErrorMessage("名前を入力してください。");
        }
    }

    render() {
        const {initAuthFlg} = this.state;
        const {getFieldProps, getFieldError} = this.props.form;

        const validateName = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('名前を入力してください'));
            }
        }

        if (!initAuthFlg) {
            return null;
        }

        return (
            <div className={Styles.nameInput}>
                <div className={Styles.center}>
                    <h2>名前入力</h2>
                    <img src={logo} className={Styles.logo} alt="logo"/>
                    <WhiteSpace/>
                    <InputItem
                        className={Styles.inputItem}
                        {...getFieldProps('name', {
                            rules: [
                                {validator: validateName},
                            ],
                        })}
                        ref={el => this.nameInst = el}
                        error={!!getFieldError('name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('name'), 1);
                        }}
                        clear
                        placeholder="名前を入力してください"
                    >
                        {/*<span>名前</span>*/}
                    </InputItem>
                    <WhiteSpace/>

                    <Button className={Styles.submit} type='primary' onClick={this.onSubmit}>決定</Button>
                    <footer className={Styles.footer}>
                        <span>Copyright © VRC, Inc. All Rights Reserved.</span>
                    </footer>
                </div>
            </div>
        );
    }

}


export default createForm()(NameInput)

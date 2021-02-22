import React, {Component} from 'react'
import {Button, InputItem, Toast, WhiteSpace} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './NameInput.css'
import {fwInitAuth, fwCallServiceByKeyDirect, fwErrorMessage, fwPush, fwUnLoading} from "../common/common";
import UrlConfig from '../config';

class NameInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initAuthFlg: false,
        };
    }

    componentDidMount() {
        fwInitAuth((token) => {
            if (this.nameInst) {
                this.nameInst.focus();
            }
            this.setState({initAuthFlg: true,});
        });
    }

    onSubmit = () => {
        // console.log(this.props.form.getFieldsValue());
        let name = this.props.form.getFieldsValue().name;
        if (name) {
            let title = this.props.form.getFieldsValue().title;
            if (title && title.length > 15) {
                fwErrorMessage("15文字以内入力可能。");
                return;
            }

            let email;
            let obj = this.props.location.state;
            if (obj && obj.hasOwnProperty('msg')) {
                email = obj.msg;
            }

            if (!email) {
                fwErrorMessage("メールを入力してください。");
                return;
            }

            let postData = {
                Name: name,
                Target: email,
                Title: title,
            };
            // console.log(postData);
            fwInitAuth((token) => {
                // console.log(token);
                fwCallServiceByKeyDirect(UrlConfig.CreateMediaContentsURL, token, postData, function onSuccess(response) {
                        fwUnLoading();
                        if (response && response.data && response.data.Status === "OK") {
                            fwPush("/home", response.data.ContentId);
                        } else {
                            fwErrorMessage("通信エラーが発生しました。");
                        }
                    },
                    function onError(err) {
                        // console.log(err);
                        fwErrorMessage("名前入力画面例外が発生しました。");
                    });
            });

        } else {
            fwErrorMessage("名前を入力してください。");
        }
    }

    render() {
        const {initAuthFlg} = this.state;
        if (!initAuthFlg) {
            return null;
        }

        const {getFieldProps, getFieldError} = this.props.form;
        const validateName = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('名前を入力してください'));
            }
        }

        const validateTitle = (rule, value, callback) => {
            if (value.length >= 16) {
                callback(new Error('15文字以内入力可能'));
            }
        }

        return (
            <div className={Styles.nameInput}>
                <div className={Styles.center}>
                    <h1 className={Styles.label}>あなたの名前</h1>
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
                        placeholder=""
                    >
                        {/*<span>名前</span>*/}
                    </InputItem>
                    <h1 className={Styles.label}>卒業証書授与動画タイトル</h1>
                    <InputItem
                        className={Styles.inputItem}
                        {...getFieldProps('title', {
                            rules: [
                                {validator: validateTitle},
                            ],
                        })}
                        ref={el => this.nameInst = el}
                        error={!!getFieldError('title')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('title'), 1);
                        }}
                        clear
                        placeholder="15文字以内入力可能"
                    >
                    </InputItem>
                    <WhiteSpace/>
                    <footer className={Styles.footer}>
                        <Button className={Styles.submit} type='primary' onClick={this.onSubmit}>つぎへ</Button>
                        {/*<span>Copyright © VRC, Inc. All Rights Reserved.</span>*/}
                    </footer>
                </div>
            </div>
        );
    }

}


export default createForm()(NameInput)

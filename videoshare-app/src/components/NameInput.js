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
                Title: this.props.form.getFieldsValue().title,
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

        return (
            <div className={Styles.nameInput}>
                <div className={Styles.center}>
                    <h2>名前入力</h2>
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
                    <h2>タイトル入力</h2>
                    <InputItem
                        className={Styles.inputItem}
                        {...getFieldProps('title', {
                            rules: [
                                {validator: validateName},
                            ],
                        })}
                        ref={el => this.nameInst = el}
                        error={!!getFieldError('title')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('title'), 1);
                        }}
                        clear
                        placeholder=""
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

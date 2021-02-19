import React, {Component} from 'react'
import {Button, InputItem, Toast, WhiteSpace} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './Login.css'
import logo from "../image/admin-logo.png";
import {NavLink} from "react-router-dom"
import {signin} from "../common/cognito-auth";
import {fwErrorMessage, fwLoading, fwPush} from "../common/common";


var accessUrl = null;

class Login extends Component {

    componentDidMount() {
        this.emailInst.focus();

        // login請求前のurl取得する
        let obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('url')) {
            accessUrl = '/' + obj.url.split('/').slice(3).join('/'); // domainを除く
            // console.log(accessUrl);
        }
    }

    onSubmit = () => {
        // console.log(this.props.form.getFieldsValue());
        let email = this.props.form.getFieldsValue().email;
        let password = this.props.form.getFieldsValue().password;
        if (email && password) {
            fwLoading();
            signin(email, password, function signinSuccess(result) {
                    if (!accessUrl) {
                        let currentUrl = document.location.href;
                        let path = currentUrl.split('/').slice(3).join('/')
                        if (path === "autologinerror") {
                            fwPush("/nameinput",email);
                        } else {
                            // fwPush("/home", "");
                            fwErrorMessage("入口が間違う。");
                        }
                    } else {
                        fwPush(accessUrl, "");
                    }
                },

                function signinError(err) {
                    // console.log(err);
                    fwErrorMessage("ユーザ名またパスワードは正しくありません。");
                });
        } else {
            fwErrorMessage("ユーザ名またパスワードを入力してください。");
        }
    }

    render() {

        const {getFieldProps, getFieldError} = this.props.form;
        const validatePassword = (rule, value, callback) => {
            // if (value && value.length >= 8) {
            //     callback();
            // } else {
            //     // callback(new Error('请输入至少8位密码'));
            // }
        }

        const validateEmail = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('メールアドレスを入力してください'));
            }
        }

        return (
            <div className={Styles.login}>
                <div className={Styles.center}>
                    <img src={logo} className={Styles.logo} alt="logo"/>
                    <h3>ログイン</h3>

                    <InputItem
                        className={Styles.inputItem}
                        {...getFieldProps('email', {
                            rules: [
                                {validator: validateEmail},
                            ],
                        })}
                        ref={el => this.emailInst = el}
                        error={!!getFieldError('email')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('email'), 1);
                        }}
                        clear
                        placeholder="メール"
                    >
                        {/*<span>メール</span>*/}
                    </InputItem>
                    <WhiteSpace/>
                    <InputItem
                        className={Styles.inputItem}
                        {...getFieldProps('password', {
                            rules: [
                                {validator: validatePassword},
                            ],
                        })}
                        error={!!getFieldError('password')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('password'), 1);
                        }}
                        clear
                        type="password"
                        placeholder="パスワード"
                    >
                        {/*<span>パスワード</span>*/}
                    </InputItem>
                    <WhiteSpace/>

                    <Button className={Styles.submit} type='primary' onClick={this.onSubmit}>ログイン</Button>
                    <footer className={Styles.footer}>
                            <span>
                                <NavLink to="/privacy">プライバシー</NavLink>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <NavLink to="/terms">規約 </NavLink>
                            </span>
                    </footer>
                </div>
            </div>

        );
    }

}


export default createForm()(Login)

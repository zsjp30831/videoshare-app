import React, {Component} from 'react'
import {Button, InputItem, Toast} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './Login.css'
import logo from "../admin-logo.png";
import {NavLink} from "react-router-dom"
import {signin} from "../common/cognito-auth";
import {createBrowserHistory} from "history";

class Login extends Component {

    componentDidMount() {
        this.emailInst.focus();
    }

    onSubmit = () => {
        console.log(this.props.form.getFieldsValue());
        let email = this.props.form.getFieldsValue().email;
        let password = this.props.form.getFieldsValue().password;
        if (email && password) {
            signin(email, password, function signinSuccess(result) {
                    // alert("success");
                    let history = createBrowserHistory();
                    history.push({pathname: "/home"});
                    history.go();
                },
                function signinError(err) {
                    // console.log(err);
                    alert("ユーザ名またパスワードは正しくありません。");
                });
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
            <div className="login">
                <div className="body">
                    <div className={Styles.center}>
                        <img src={logo} className={Styles.logo} alt="logo"/>
                        <h3>ログイン</h3>


                        <InputItem
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
                            placeholder=""
                        >
                            <span>メール</span>
                        </InputItem>
                        <br/>
                        <InputItem
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
                            placeholder=""
                        >
                            <span>パスワード</span>
                        </InputItem>
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
            </div>

        );
    }

}


export default createForm()(Login)
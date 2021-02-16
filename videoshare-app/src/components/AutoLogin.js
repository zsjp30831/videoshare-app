import React, {Component} from 'react';
import {fwLoading, fwPush, fwUnLoading} from "../common/common";
import {signin} from "../common/cognito-auth";

class AutoLogin extends Component {

    componentDidMount() {
        fwLoading();
        // console.log(this.props.location.search);
        const query = this.props.location.search;
        const arr = query.split('&') // ['?user=', 'pass=7']
        if (arr && arr.length === 2) {
            const email = arr[0].substr(6);
            const password = arr[1].substr(5);
            // console.log(email);
            // console.log(password);
            signin(email, password, function signinSuccess(result) {
                    fwUnLoading();
                    fwPush("/nameinput");
                },
                function signinError(err) {
                    // fwErrorMessage("ユーザ名またパスワードは正しくありません。");
                    fwPush("/autologinerror");
                });
        } else {
            // fwErrorMessage("請求パラメータ不正。");
            fwPush("/autologinerror");
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default AutoLogin;
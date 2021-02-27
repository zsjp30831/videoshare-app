import React, {Component} from 'react';
import {fwPush, fwLoading, fwUnLoading, setVrcId, setRelationId,fwErrorMessage} from "../common/common";
import {signin} from "../common/cognito-auth";

class AutoLogin extends Component {

    componentDidMount() {
        fwLoading();
        // console.log(this.props.location.search);
        // alert(this.props.location.search);
        const query = this.props.location.search;
        const arr = query.split('&') // ['?user=', 'pass=7',vrcid=xx,relationid=xxxxx]
        if (arr && arr.length >= 2) {
            const email = arr[0].substr(6);
            const password = arr[1].substr(5);
            const vrcId = arr[2].substr(6);
            const relationId = arr[3].substr(11);
            setVrcId(vrcId);
            setRelationId(relationId);

            // console.log(email);
            // console.log(password);
            // console.log(vrcid);
            // console.log(relationid);
            signin(email, password, function signinSuccess(result) {
                    fwUnLoading();
                    fwPush("/webview", {vrcId: vrcId, relationId: relationId});
                },
                function signinError(err) {
                    // fwErrorMessage("ユーザ名またパスワードは正しくありません。");
                    // console.log("ユーザ名またパスワードは正しくありません。");
                    fwPush("/autologinerr", {vrcId: vrcId, relationId: relationId});
                });
        } else {
            fwErrorMessage("請求パラメータ不正、リトライしてください。");
            // console.log("請求パラメータ不正。");
            // fwPush("/autologinerr", {});
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

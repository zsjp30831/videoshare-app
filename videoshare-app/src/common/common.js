import {Toast} from 'antd-mobile'
import {createBrowserHistory} from "history";
import {getAWSToken} from "./cognito-auth";
import axios from 'axios';

export function fwLoading(msg) {
    if (!msg) {
        Toast.loading("Loading...", 0);
    } else {
        Toast.loading(msg, 0);
    }
}

export function fwUnLoading() {
    Toast.hide();
}

export function fwErrorMessage(msg) {
    Toast.fail(msg, 1);
}

export function fwError(msg) {
    if (!msg) {
        msg = "エラーが発生しました";
    }
    Toast.fail(msg, 1, () => {
        let history = createBrowserHistory();
        history.push({pathname: "/login"});
        history.go();
    });
}

export function fwInitAuth(onSuccess) {
    fwLoading();
    getAWSToken().then((token) => {
        fwUnLoading();
        if (token) {
            onSuccess();
        } else {
            fwError('認証失敗しました。');
        }
    }).catch(() => {
        fwError('認証失敗しました。');
        // fwUnLoading();
    })
}

export function fwPush(path, data) {
    let history = createBrowserHistory();
    history.push({
        pathname: path,
        state: {
            msg: data
        }
    });
    history.go();
}

export function fwCallServiceByKeyDirect(apiUrl, apiKey, data, fncSuccess, fncError) {
    fwLoading();
    if (!fncError) { // error handle
        // fncError = fwError;
    }

    axios({
        method: 'post',
        url: 'https://platform-console.vrcjp.com/v1/getbillinginfo',
        contentType: "application/json",
        data: JSON.stringify(data),
    })
        .then(function (response) {
            console.log(response);
            fwUnLoading();
            fncSuccess();
        })
        .catch(function (error) {
            console.log(error);
            fwUnLoading();
            fncError();
        });
}



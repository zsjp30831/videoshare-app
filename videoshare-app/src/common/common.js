import {Toast} from 'antd-mobile'
import {createBrowserHistory} from 'history';
import {getAWSToken} from "./cognito-auth";
import axios from 'axios';
import CallApp from 'callapp-lib';

export function fwIsEmpty(obj) {
    return (JSON.stringify(obj) === '{}') ? true : false;
}

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
        history.push({
            pathname: "/login",
            search: document.location.href,
        });
        history.go();
    });
}

export function fwSuccess(msg) {
    Toast.success(msg, 1);
}

export function fwInitAuth(onSuccess) {
    // fwLoading();
    getAWSToken().then((token) => {
        // fwUnLoading();
        if (token) {
            onSuccess(token);
        } else {
            fwError('認証失敗しました。');
        }
    }).catch(() => {
        fwError('認証例外しました。');
        // fwUnLoading();
    })
}

export function fwgetAWSToken(onSuccess, onError) {

    getAWSToken().then((token) => {
        if (token) {
            onSuccess(token);
        } else {
            onError();
        }
    }).catch(() => {
        onError();
    })
}

export function fwPush(path) {
    let history = createBrowserHistory();
    history.push({
        pathname: path,
        // query: data
    });
    history.go();
}

export function fwCallServiceByKeyDirect(apiUrl, authToken, data, fncSuccess, fncError) {
    if (!fncError) { // error handle
        // fncError = fwErrorMessage;
    }

    axios({
        method: 'post',
        url: apiUrl,
        headers: {
            Authorization: authToken,
        },
        contentType: "application/json",
        data: JSON.stringify(data),
    })
        .then(function (response) {
            // console.log(response);
            fncSuccess(response);
        })
        .catch(function (error) {
            // console.log(error);
            fwUnLoading();
            fncError(error);
        });
}

export function fwCallServiceDirect(apiUrl, data, fncSuccess, fncError) {
    if (!fncError) { // error handle
        // fncError = fwErrorMessage;
    }

    axios({
        method: 'post',
        url: apiUrl,
        headers: {
            'content-type': 'application/json',
        },
        contentType: "application/json",
        data: JSON.stringify(data),
    })
        .then(function (response) {
            // console.log(response);
            fncSuccess(response);
        })
        .catch(function (error) {
            // console.log(error);
            fwUnLoading();
            fncError(error);
        });
}

export function fwDateFormat(str) {

    if (str && str.length < 8) {
        return '';
    }
    const year = str.substr(0, 4);
    const month = str.substr(4, 2);
    const day = str.substr(6, 2);
    // const hour = str.substr(8, 2);
    // const min = str.substr(10, 2);
    // const sec = str.substr(12, 2);
    const formatted = `${year}-${month}-${day}`;
    return formatted;
};

const twitterOpt = {
    scheme: {
        protocol: 'Twitter',
    },
    intent: {
        package: '',
        scheme: 'Twitter',
    },
    universal: {
        host: 'twitter.com/compose/tweet',
        pathKey: 'action',
    },
    appstore: 'https://apps.apple.com/jp/app/twitter-%E3%83%84%E3%82%A4%E3%83%83%E3%82%BF%E3%83%BC/id333903271',
    yingyongbao: 'https://play.google.com/store/apps/details?id=com.twitter.android',
    fallback: 'https://twitter.com/intent/tweet?text=',
    timeout: 2000,
};


// const facebookOpt = {
//     scheme: {
//         protocol: 'fb',
//     },
//     intent: {
//         package: '',
//         scheme: 'fb',
//     },
//     universal: {
//         host: 'facebook.com',
//         pathKey: 'action',
//     },
//     appstore: 'https://apps.apple.com/jp/app/facebook/id284882215',
//     yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android',
//     fallback: 'https://www.facebook.com/',
//     timeout: 2000,
// };


export function fwAddMeta(name, content, property) {//手动添加mate标签
    let meta = document.createElement('meta');
    if (name && name.length > 0) {
        meta.name = name;
    }

    if (property) {
        meta.setAttribute("property", property);
    }
    meta.content = content;
    document.getElementsByTagName('head')[0].appendChild(meta);
}


export function fwTwitterInsertMeta(name, content) {
    let refNode = document.getElementsByName('twitter:player:width');
    let meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;

    document.getElementsByTagName('head')[0].insertBefore(meta, refNode[0]);
}


export function fwCallApp(index, url, title) {

    switch (index) {
        case 0:
            break;
        case 1:
            // pc
            // window.open('https://lineit.line.me/share/ui?url=' + encodeURIComponent(url), "_blank");  //ios できない
            // window.location.href = 'https://lineit.line.me/share/ui?url=' + encodeURIComponent(url);
            window.location.href = 'line://msg/text/' + encodeURIComponent(url);    //iphone
            break;
        case 2:
            let option = twitterOpt;
            option.fallback = twitterOpt.fallback + title + '　' + encodeURIComponent(url);
            const lib = new CallApp(option);
            lib.open({path: '', param: {text: title, url: url}});
            break;
        case 3:
            // window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), "_blank");
            window.location.href = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
            break;
        case 4:
            // option = wechatOpt;
            break;
        default:
            break;
    }

}


import {Toast} from 'antd-mobile'
import {createBrowserHistory} from "history";
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
            state: {
                url: document.location.href
            }
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
            console.log(error);
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
        contentType: "application/json",
        data: JSON.stringify(data),
    })
        .then(function (response) {
            // console.log(response);
            fncSuccess(response);
        })
        .catch(function (error) {
            console.log(error);
            fwUnLoading();
            fncError();
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

const lineOpt = {
    scheme: {
        protocol: 'line',
    },
    intent: {
        package: 'com.zhihu.android',
        scheme: 'line',
    },
    // universal: {
    //     host: 'oia.zhihu.com/question/270839820/answer/477722658',
    //     pathKey: 'action',
    // },
    appstore: 'https://apps.apple.com/jp/app/line/id443904275',
    yingyongbao: 'https://chrome.google.com/webstore/detail/line/ophjlpahpchlmihnnnihgmmeilfjmjjc',
    fallback: 'https://line.me/ja/',
    timeout: 2000,
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
    yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android',
    fallback: 'https://twitter.com/',
    timeout: 2000,
};

// const youtubeOpt = {
//     scheme: {
//         protocol: 'youtube',
//     },
//     intent: {
//         package: 'com.zhihu.android',
//         scheme: 'youtube',
//     },
//     universal: {
//         host: 'youtube.com/',
//         pathKey: 'action',
//     },
//     appstore: 'https://apps.apple.com/jp/app/youtube/id544007664',
//     yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android',
//     fallback: 'https://www.youtube.com/',
//     timeout: 2000,
// };


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

// const wechatOpt = {
//     scheme: {
//         protocol: 'weixin',
//     },
//     intent: {
//         package: 'com.tencent.mm',
//         scheme: 'weixin',
//     },
//     universal: {
//         host: 'dl/moments',
//         pathKey: 'action',
//     },
//     appstore: 'https://apps.apple.com/jp/app/wechat/id414478124',
//     yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.zhihu.android',
//     fallback: 'https://wx.qq.com/',
//     timeout: 2000,
// };

export function fwCallApp(index, url) {

    let option;
    switch (index) {
        case 0:
            break;
        case 1:
            option = lineOpt;
            break;
        case 2:
            option = twitterOpt;
            break;
        case 3:
            window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), "_blank");
            // window.location.href = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
            return;
        case 4:
            // option = wechatOpt;
            break;
        default:
            break;
    }

    const lib = new CallApp(option);
    lib.open({path: '', param: {url}});

}


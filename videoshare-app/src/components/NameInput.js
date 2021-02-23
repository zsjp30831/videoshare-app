import React, {Component} from 'react'
import {Button, InputItem, Toast, WhiteSpace} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './NameInput.css'
import {getVrcId} from "../common/cognito-auth";
import {fwInitAuth, fwCallServiceByKeyDirect, fwErrorMessage, fwPush, fwUnLoading, fwLoading} from "../common/common";
import UrlConfig from '../config';

var handler;
var pollingFlag = false;

class NameInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initAuthFlg: false,
        };
        this.dataPolling = this.dataPolling.bind(this);
    }

    dataPolling = (postData) => {
        pollingFlag = true;
        let timer = this.pollingTimer;
        fwInitAuth((token) => {
            fwCallServiceByKeyDirect(UrlConfig.GetMediaContentsStatusURL, token, postData, function onSuccess(response) {
                    if (response && response.data) {
                        let status = response.data.PStatus;
                        if (status === 'Completed') {
                            timer && clearInterval(timer);
                            fwPush('/home');
                        } else if (status !== 'Failed') {
                            pollingFlag = false;
                            fwLoading("動画作成中、少々お待ちください。。。");
                        } else {
                            fwErrorMessage("動画作成失敗しました。");
                            timer && clearInterval(timer);
                        }
                    } else {
                        fwErrorMessage("動画作成状態確認通信エラーが発生しました。");
                        timer && clearInterval(timer);
                    }
                },
                function onError(err) {
                    fwErrorMessage("動画作成状態確認例外が発生しました。");
                    timer && clearInterval(timer);
                }
            );
        });
    }


    componentDidMount() {
        fwInitAuth((token) => {
            if (this.nameInst) {
                this.nameInst.focus();
            }
            this.setState({initAuthFlg: true,});
            handler = this;
        });
    }

    componentWillUnmount() {
        this.pollingTimer && clearInterval(this.pollingTimer);
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



            fwLoading();
            fwInitAuth((token) => {
                let postData = {
                    Name: name,
                    Title: title,
                    VrcId: getVrcId(),
                };
                console.log(postData);
                // console.log(token);
                fwCallServiceByKeyDirect(UrlConfig.CreateMediaContentsURL, token, postData, function onSuccess(response) {
                        fwUnLoading();
                        if (response && response.data && response.data.Status === "OK") {
                            console.log(response.data.ContentId);

                            // polling
                            handler.pollingTimer = setInterval(
                                () => {
                                    if (!pollingFlag) {
                                        handler.dataPolling(postData);
                                    }
                                },
                                3000);

                            //timeout check
                            setTimeout(() => {
                                // alert("timeout ");
                                if (handler.pollingTimer) {
                                    clearInterval(handler.pollingTimer);
                                }
                            }, 180 * 1000);


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

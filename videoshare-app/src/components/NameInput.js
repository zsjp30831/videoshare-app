import React, {Component} from 'react'
import {Button, InputItem, Toast, WhiteSpace, Checkbox, Flex} from 'antd-mobile'
import {createForm} from 'rc-form'
import Styles from './NameInput.css'
import {
    fwInitAuth,
    fwCallServiceByKeyDirect,
    fwErrorMessage,
    fwPush,
    fwLoading,
    setVrcId,
    getVrcId,
    setRelationId,
    getRelationId,
} from "../common/common";
import UrlConfig from '../config';

const AgreeItem = Checkbox.AgreeItem;

var handler;
var pollingFlag = false;
var loadingFlag = true;

class NameInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initAuthFlg: false,
            radioA: true,
            radioB: false,
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
                            fwLoading("動画作成しました。");
                            timer && clearInterval(timer);
                            fwPush('/webview', {vrcId: getVrcId(), relationId: getRelationId()});
                        } else if (status !== 'Failed') {
                            pollingFlag = false;
                            if (loadingFlag) {
                                loadingFlag = false;
                                fwLoading("動画作成中、一分ほどお待ちください...");
                            }
                        } else {
                            fwErrorMessage("動画作成失敗しました。");
                            timer && clearInterval(timer);
                            loadingFlag = true;
                        }
                    } else {
                        fwErrorMessage("動画作成状態確認通信エラーが発生しました。");
                        timer && clearInterval(timer);
                        loadingFlag = true;
                    }
                },
                function onError(err) {
                    fwErrorMessage("動画作成状態確認例外が発生しました。");
                    timer && clearInterval(timer);
                    loadingFlag = true;
                }
            );
        });
    }


    componentDidMount() {
        // console.log(this.props.location);
        let obj = this.props.location.state;
        if (obj && obj.hasOwnProperty('vrcId')) {
            setVrcId(obj.vrcId);
        }
        if (obj && obj.hasOwnProperty('relationId')) {
            setRelationId(obj.relationId);
        }

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
            if (name.length > 6) {
                fwErrorMessage("名前は6文字以内を入力してください.");
                return;
            }
            let title = this.props.form.getFieldsValue().title;
            if (title && title.length > 15) {
                fwErrorMessage("タイトルは15文字以内を入力してください.");
                return;
            }

            fwInitAuth((token) => {
                let postData = {
                    Name: name,
                    Title: title,
                    VrcId: getVrcId(),
                    ConferKbn: this.state.radioA ? 1 : 2,
                    RelationId: getRelationId(),
                };
                // console.log(postData);
                fwLoading();
                // console.log(token);
                fwCallServiceByKeyDirect(UrlConfig.CreateMediaContentsURL, token, postData, function onSuccess(response) {
                        // console.log(response);
                        if (response && response.data && response.data.Status === "OK") {
                            // console.log(response.data.ContentId);
                            let pstData = {
                                ContentId: response.data.ContentId,
                            }
                            // polling
                            handler.pollingTimer = setInterval(
                                () => {
                                    if (!pollingFlag) {
                                        handler.dataPolling(pstData);
                                    }
                                },
                                6000);

                            //timeout check
                            setTimeout(() => {
                                // alert("timeout ");
                                if (handler.pollingTimer) {
                                    clearInterval(handler.pollingTimer);
                                }
                                fwErrorMessage("リトライしてください.");
                                loadingFlag = true;
                            }, 180 * 1000);

                        } else if (response && response.data && response.data.Status === "AwardNotExists") {
                            fwErrorMessage("授与する方を学長に選択してください.");
                        } else if (response && response.data && response.data.Status === "AvatarNotExists") {
                            fwErrorMessage("対象アバターは存在しないため、動画は生成できません.");
                        } else {
                            fwErrorMessage("通信エラーが発生しました.");
                        }
                    },
                    function onError(err) {
                        // console.log(err);
                        fwErrorMessage("名前入力画面例外が発生しました.");
                    });
            });

        } else {
            fwErrorMessage("名前を入力してください.");
        }
    }

    onChange = (value) => {
        if (value === 1) {
            this.setState({
                radioA: true,
                radioB: false,
            })
        } else {
            this.setState({
                radioA: false,
                radioB: true,
            })
        }
    };

    render() {
        const {initAuthFlg, radioA, radioB} = this.state;
        if (!initAuthFlg) {
            return null;
        }

        const {getFieldProps, getFieldError} = this.props.form;
        const validateName = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('名前を入力してください'));
            } else if (value.length > 6) {
                callback(new Error('名前は6文字以内を入力してください'));
            } else {
            }
        }

        const validateTitle = (rule, value, callback) => {
            if (value.length >= 16) {
                callback(new Error('15文字以内入力可能'));
            }
        }

        return (
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
                    placeholder="6文字以内入力可能"
                >
                    {/*<span>名前</span>*/}
                </InputItem>
                <h1 className={Styles.label}>動画タイトル</h1>
                <InputItem
                    className={Styles.inputItem}
                    {...getFieldProps('title', {
                        rules: [
                            {validator: validateTitle},
                        ],
                    })}
                    ref={el => this.titleInst = el}
                    error={!!getFieldError('title')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('title'), 1);
                    }}
                    clear
                    placeholder="15文字以内入力可能"
                >
                </InputItem>
                <WhiteSpace/>

                <h1 className={Styles.label2}>学位記を授与する方を選択</h1>
                <div className={Styles.box}>
                    <Flex justify="between">
                        <Flex.Item>
                            <AgreeItem className={Styles.radioA} checked={radioA} onChange={() => this.onChange(1)}>
                                <span className={Styles.font} onClick={() => this.onChange(1)}>学長</span>
                            </AgreeItem>
                        </Flex.Item>
                        <Flex.Item>
                            <AgreeItem className={Styles.radioB} checked={radioB} onChange={() => this.onChange(2)}>
                                <span className={Styles.font} onClick={() => this.onChange(2)}>学科長</span>
                            </AgreeItem>
                        </Flex.Item>
                    </Flex>
                </div>

                <footer className={Styles.footer}>
                    <Button className={Styles.submit} type='primary' onClick={this.onSubmit}>つぎへ</Button>
                    {/*<span>Copyright © VRC, Inc. All Rights Reserved.</span>*/}
                </footer>
            </div>

        );
    }

}


export default createForm()(NameInput)

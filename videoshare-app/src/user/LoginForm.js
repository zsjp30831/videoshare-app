import React, {Component} from 'react';
import styles from './LoginForm.css';
import {signin} from '../common/cognito-auth'

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        // alert('input email: ' + this.state.email);
        // alert('input pass: ' + this.state.password);
        event.preventDefault();

        let email = this.state.email;
        let password = this.state.password;

        signin(email, password, function signinSuccess(result) {
                alert("success");
            },
            function signinError(err) {
                alert("login failed:"+err);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className={styles.block}>
                    <label>Email:</label>
                    <input className={styles.input}
                           name="email"
                           type="text"
                           value={this.state.email}
                           onChange={this.handleInputChange}/>
                </div>
                <div className={styles.block}>
                    <label> Password:</label>
                    <input className={styles.input}
                           name="password"
                           type="password"
                           value={this.state.password}
                           onChange={this.handleInputChange}/>
                </div>
                <div className={styles.btn_submit}>
                    <input className={styles.submit} type="submit" value="Login"/>
                </div>
            </form>
        );
    }
}

export default LoginForm;

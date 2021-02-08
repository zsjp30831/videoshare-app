import React, {Component} from 'react';
import styles from './LoginForm.css';

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
        alert('input email: ' + this.state.email);
        event.preventDefault();
    }

    render() {
        return (
            <form class={styles.vertical} onSubmit={this.handleSubmit}>
                <label class={styles.label}>
                    Email:
                    <input
                        class={styles.field}
                        name="email"
                        type="text"
                        value={this.state.email}
                        onChange={this.handleInputChange}/>
                </label>
                <br/>
                <label class={styles.label}>
                    Password:
                    <input
                        class={styles.field}
                        name="password"
                        type="text"
                        value={this.state.password}
                        onChange={this.handleInputChange}/>
                </label>
                <input class="submit" type="submit" value="Login"/>
            </form>
        );
    }
}

export default LoginForm;

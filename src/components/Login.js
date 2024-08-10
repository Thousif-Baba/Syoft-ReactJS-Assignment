import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_email: '',
            user_password: '',
            error: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
        if (registeredUser && registeredUser.user_email === this.state.user_email) {
            if (registeredUser.user_password === this.state.user_password) {
                try {
                    const response = await axios.post('https://syoft.dev/Api/userlogin/api/userlogin', {
                        user_email: this.state.user_email,
                        user_password: this.state.user_password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('User login:', response.data);
                    if (response.status === 200) {
                        localStorage.setItem('user', JSON.stringify(registeredUser));
                        this.props.history.push('/dashboard');
                    } else {
                        this.setState({ error: 'Invalid credentials' });
                    }
                } catch (error) {
                    console.error('Error logging in:', error.response ? error.response.data : error.message);
                    this.setState({ error: 'Invalid credentials' });
                }
            } else {
                this.setState({ error: 'Wrong password' });
            }
        } else {
            this.setState({ error: 'User not registered' });
        }
    };

    render() {
        return (
            <div className="login-container">
                <div className="login-header">
                    <h2>Sign in</h2>
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="email"
                        name="user_email"
                        placeholder="Email address"
                        value={this.state.user_email}
                        onChange={this.handleChange}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        name="user_password"
                        placeholder="Password"
                        value={this.state.user_password}
                        onChange={this.handleChange}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="login-button">Sign in</button>
                </form>
                {this.state.error && <p className="error">{this.state.error}</p>}
            </div>
        );
    }
}

export default withRouter(Login);

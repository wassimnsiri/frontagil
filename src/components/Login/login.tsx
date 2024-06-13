import React, { useState } from 'react';
import { LoginResponse, login } from '../../network/user_services';
import logoDark from '../../images/logo_dark.png';
import { useNavigate } from 'react-router-dom';

const LoginP = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleForgotPassword = () => {
        navigate('/resetpassword');
    };

    const handleSignIn = async () => {
        try {
            const response: LoginResponse = await login({ username: credentials.username, password: credentials.password });
            console.log('Login successful. Token:', response.token);

            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('id', response.user._id as string);
       

          
                navigate('/');
         
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <style>
                {`
                    body {
                        background: url('http://cdn.wallpapersafari.com/13/6/Mpsg2b.jpg');
                        margin: 0px;
                        font-family: 'Ubuntu', sans-serif;
                        background-size: 100% 110%;
                    }
                    h1, h2, h3, h4, h5, h6, a {
                        margin: 0; padding: 0;
                    }
                    .login {
                        margin: 0 auto;
                        max-width: 500px;
                    }
                    .login-header {
                        color: #fff;
                        text-align: center;
                        font-size: 300%;
                    }
                    .login-form {
                        border: .5px solid #fff;
                        background: #4facff;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px #000;
                    }
                    .login-form h3 {
                        text-align: left;
                        margin-left: 40px;
                        color: #fff;
                    }
                    .login-form {
                        box-sizing: border-box;
                        padding-top: 15px;
                        padding-bottom: 10%;
                        margin: 5% auto;
                        text-align: center;
                    }
                    .login input[type="text"],
                    .login input[type="password"] {
                        max-width: 400px;
                        width: 80%;
                        line-height: 3em;
                        font-family: 'Ubuntu', sans-serif;
                        margin: 1em 2em;
                        border-radius: 5px;
                        border: 2px solid #f2f2f2;
                        outline: none;
                        padding-left: 10px;
                    }
                    .login-form input[type="button"] {
                        height: 30px;
                        width: 100px;
                        background: #fff;
                        border: 1px solid #f2f2f2;
                        border-radius: 20px;
                        color: slategrey;
                        text-transform: uppercase;
                        font-family: 'Ubuntu', sans-serif;
                        cursor: pointer;
                    }
                    .sign-up {
                        color: #f2f2f2;
                        margin-left: -70%;
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    .no-access {
                        color: #E86850;
                        margin: 20px 0px 20px -57%;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    .try-again {
                        color: #f2f2f2;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    @media only screen and (min-width: 150px) and (max-width: 530px) {
                        .login-form h3 {
                            text-align: center;
                            margin: 0;
                        }
                        .sign-up, .no-access {
                            margin: 10px 0;
                        }
                        .login-button {
                            margin-bottom: 10px;
                        }
                    }
                    .tip {
                        text-align: center;
                        color: #fff;
                    }
                    .cont {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .form {
                        background: #fff;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px #000;
                        padding: 2em;
                        margin: 1em;
                    }
                    .img {
                        display: none;
                    }
                    .submit, .fb-btn {
                        background: #4facff;
                        border: none;
                        border-radius: 5px;
                        color: #fff;
                        padding: 0.5em 1em;
                        margin-top: 1em;
                        cursor: pointer;
                    }
                `}
            </style>
            <div className="bg-yellow-400 flex justify-center items-center h-screen">
                <div className="bg-black shadow-md rounded px-10 pt-30 pb-8 mb-4 flex flex-col w-96 animate__animated animate__fadeIn">
                    <img src={logoDark} alt="Logo" className="mx-auto mb-10" style={{ width: '100px' }} />
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-yellow-100"
                            id="username"
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-yellow-100"
                            id="password"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleSignIn}
                        >
                            Sign In
                        </button>
                        <a
                            className="inline-block align-baseline font-bold text-sm text-yellow-300 hover:text-yellow-400"
                            onClick={handleForgotPassword}
                            style={{ cursor: 'pointer' }}
                        >
                            Forgot Password?
                        </a>
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginP;

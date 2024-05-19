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
        // Rediriger vers l'interface ResetPassword
        navigate('/resetpassword');
    };

    const handleSignIn = async () => {
        try {
            const response: LoginResponse = await login({ username: credentials.username, password: credentials.password });
            console.log('Login successful. Token:', response.token);
            
            // Enregistre le token et les informations de l'utilisateur dans le stockage local
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('id', response.user._id as string);
            localStorage.setItem('role', response.user.role as string);
            
            // Redirection en fonction du rôle de l'utilisateur
            if (response.user.role === 'admin') {
                navigate('/');
            } else if (response.user.role === 'gerant') {
                navigate('/welcome');
            
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
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
    );
};

export default LoginP;

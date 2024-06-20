import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom'; 
import './signup.css'; 

export default function SignUpPage() {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };
    
    const handleSignUp = async () => {
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        if (username.trim() === '') {
            setErrorMessage('Username cannot be empty');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            navigate('/home'); 
        } catch (error) {
            setErrorMessage('Email already in use, please try again');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSignUp();
        }
    };

    return (
        <section className="signup-container">
            <div className="signup-header">
                <h1>Create an account</h1>
            </div>

            <form className="signup-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="form-group">
                    <button type="button" onClick={handleSignUp}>Sign Up</button>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </section>
    );
}

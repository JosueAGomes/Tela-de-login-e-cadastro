import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const location = useLocation(); // Para obter a rota atual

    useEffect(() => {
        // Redireciona somente se não estiver na página de registro ou login
        if (localStorage.getItem('authToken') && location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/chat'); // Redireciona para o componente ChatApp
        }
    }, [navigate, location.pathname]);

    const validateForm = () => {
        let isValid = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Por favor, insira um endereço de e-mail válido');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (password.length < 8) {
            setPasswordError('A senha deve ter pelo menos 8 caracteres');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('emailUsuario', data.email); // Armazena o email
                    localStorage.setItem('nomeUsuario', data.name); // Armazena o nome do usuário
                    navigate('/chat'); // Redireciona para o chat
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Email ou senha inválidos');
                }
            } catch (err) {
                setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
                console.error('Erro ao tentar logar:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Email</label>
                    <div className="input-with-icon">
                        <img src="/src/assets/email-icon.png" alt="Email Icon" className="input-icon" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            required
                        />
                    </div>
                    {emailError && <span className="error-text">{emailError}</span>}
                </div>
                <div className="input-container">
                    <label>Senha</label>
                    <div className="input-with-icon">
                        <img src="/src/assets/password-icon.png" alt="Password Icon" className="input-icon" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    {passwordError && <span className="error-text">{passwordError}</span>}
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Logando...' : 'Login'}</button>
            </form>
            <p className="register-prompt">
                Não tem conta?
                <Link to="/register">Inscreva-se.</Link>
            </p>
        </div>
    );
};

export default Login;

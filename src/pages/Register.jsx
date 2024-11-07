import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Para obter a rota atual

    useEffect(() => {
        // Redireciona somente se não estiver na página de login ou registro
        if (localStorage.getItem('authToken') && location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/chat'); // Redireciona para o componente ChatApp
        }
    }, [navigate, location.pathname]); // Adicione location.pathname como dependência

    const validateForm = () => {
        let isValid = true;

        if (name.trim().length === 0) {
            setNameError('Por favor, insira seu nome completo');
            isValid = false;
        } else {
            setNameError('');
        }

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

        if (password !== confirmPassword) {
            setConfirmPasswordError('As senhas não coincidem');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        if (!termsAccepted) {
            setError('Você precisa aceitar os termos de serviço');
            isValid = false;
        } else {
            setError(null);
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false); // Adicione esta linha para redefinir o estado de carregamento
            return;
        }

        try {
            const registerData = {
                name,
                email,
                password,
            };

            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registro realizado com sucesso!', data);

                setSuccess(true);
                setError(null);

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao realizar o registro.');
                setSuccess(false);
            }
        } catch (err) {
            setError('Erro ao tentar registrar. Tente novamente mais tarde.');
            setSuccess(false);
            console.error('Erro no registro:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Criar sua conta</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Registro realizado com sucesso! Redirecionando...</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Nome</label>
                    <div className="input-with-icon">
                        <img src="/src/assets/user-icon.png" alt="User Icon" className="input-icon" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu nome completo"
                            required
                        />
                    </div>
                    {nameError && <span className="error-text">{nameError}</span>}
                </div>
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
                <div className="input-container">
                    <label>Confirmar Senha</label>
                    <div className="input-with-icon">
                        <img src="/src/assets/password-icon.png" alt="Password Icon" className="input-icon" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme sua senha"
                            required
                        />
                    </div>
                    {confirmPasswordError && <span className="error-text">{confirmPasswordError}</span>}
                </div>
                <div className="terms-checkbox">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                    />
                    <label>Aceito os Termos de Serviço e Política de Privacidade</label>
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
            </form>
            <p className="already-account">
                Já tem uma conta?
                <Link to="/login">Faça login.</Link>
            </p>
        </div>
    );
};

export default Register;

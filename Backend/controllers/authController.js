import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já cadastrado. Por favor, tente um novo cadastro ou faça login com as credenciais existentes' });
        }

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retornar o email e o nome do usuário na resposta
        res.json({ token, email: user.email, name: user.name }); // Inclui o nome na resposta
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Nova função para obter todos os usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Busca todos os usuários
        return res.status(200).json(users); // Retorna a lista de usuários
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
};

// Ajuste aqui para exportar os controladores
export default { register, login, getAllUsers };

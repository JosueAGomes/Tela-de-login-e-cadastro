import express from 'express';
import cors from 'cors'; // Importa o pacote CORS
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors()); // Adiciona o middleware CORS para permitir requisições de outros domínios
app.use(express.json()); // Para interpretar JSON no corpo das requisições
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    connectDB(); // Chama a função para conectar ao MongoDB
});

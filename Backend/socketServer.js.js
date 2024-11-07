import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

let mensagens = {};
let usuarios = {};

io.on('connection', (socket) => {
  // Não exibir o socket.id diretamente, mas sim o nome do usuário (caso já tenha sido registrado)
  console.log(`Aguardando autenticação de usuários...`);

  socket.on('novoUsuario', (nomeUsuario) => {
    if (nomeUsuario && typeof nomeUsuario === 'string' && nomeUsuario.trim() !== '') {
      usuarios[socket.id] = nomeUsuario;
      console.log(`Usuário conectado: ${nomeUsuario}`);  // Exibe o nome do usuário
      io.emit('usuariosOnline', Object.values(usuarios));
    } else {
      console.error('Nome de usuário inválido:', nomeUsuario);
    }
  });

  socket.on('enviarMensagem', ({ idChat, mensagem }) => {
    if (!mensagens[idChat]) {
      mensagens[idChat] = [];
    }
    mensagens[idChat].push(mensagem);

    io.emit('novaMensagem', { idChat, mensagem });
  });

  socket.on('usuarioDigitando', (nomeUsuario) => {
    socket.broadcast.emit('usuarioDigitando', nomeUsuario);
  });

  socket.on('disconnect', () => {
    // Ao desconectar, exibe o nome do usuário
    const nomeUsuario = usuarios[socket.id];
    console.log(`Usuário desconectado: ${nomeUsuario || socket.id}`);  // Se o nome não estiver definido, exibe o ID
    delete usuarios[socket.id];
    io.emit('usuariosOnline', Object.values(usuarios));
  });
});

app.get('/', (req, res) => {
  res.send('Servidor de chat funcionando!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

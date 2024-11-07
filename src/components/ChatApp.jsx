import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const socket = io('http://localhost:3000');

const ChatApp = () => {
  const [chatAtivo, setChatAtivo] = useState(null);
  const [conversas, setConversas] = useState([]);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const emailUsuario = localStorage.getItem('emailUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario'); // Recupera o nome do usuário armazenado

    if (!emailUsuario || !nomeUsuario) {
      alert("Por favor, faça o login para acessar o chat.");
      return; // Impede o restante do código de ser executado
    }

    setUsuario(nomeUsuario); // Define o nome do usuário
    socket.emit('novoUsuario', nomeUsuario); // Envia o nome do usuário ao servidor

    socket.on('novaMensagem', (novaMensagem) => {
      const { idChat, mensagem } = novaMensagem;
      if (chatAtivo && chatAtivo.id === idChat) {
        const existeMensagem = chatAtivo.mensagens.some(
          (msg) => msg.texto === mensagem.texto && msg.horario === mensagem.horario
        );
        if (!existeMensagem) {
          setChatAtivo((prevChat) => ({
            ...prevChat,
            mensagens: [...prevChat.mensagens, mensagem]
          }));
        }
      }

      setConversas((prevConversas) => {
        return prevConversas.map((conversa) => {
          if (conversa.id === idChat) {
            const existeMensagem = conversa.mensagens.some(
              (msg) => msg.texto === mensagem.texto && msg.horario === mensagem.horario
            );
            if (!existeMensagem) {
              return { ...conversa, mensagens: [...conversa.mensagens, mensagem] };
            }
          }
          return conversa;
        });
      });
    });

    socket.on('usuariosOnline', (usuarios) => {
      // Filtra o usuário logado da lista de usuários online
      const usuariosSemEu = usuarios.filter((usuarioOnline) => usuarioOnline !== nomeUsuario);
      setUsuariosOnline(usuariosSemEu);
    });

    return () => {
      socket.off('novaMensagem');
      socket.off('usuariosOnline');
    };
  }, [chatAtivo]);

  const iniciarConversa = (nomeOutroUsuario) => {
    const idChat = [usuario, nomeOutroUsuario].sort().join('-');
    const conversaExistente = conversas.find((conversa) => conversa.id === idChat);

    if (!conversaExistente) {
      const novaConversa = { id: idChat, nome: nomeOutroUsuario, mensagens: [] };
      setConversas([...conversas, novaConversa]);
      setChatAtivo(novaConversa);
    } else {
      setChatAtivo(conversaExistente);
    }
  };

  const enviarMensagem = (idChat, textoMensagem) => {
    const novaMensagem = {
      texto: textoMensagem,
      remetente: usuario,
      horario: new Date().toLocaleTimeString()
    };

    if (chatAtivo && chatAtivo.id === idChat) {
      setChatAtivo((prevChat) => ({
        ...prevChat,
        mensagens: [...prevChat.mensagens, novaMensagem]
      }));
    }

    setConversas((prevConversas) => {
      return prevConversas.map((conversa) => {
        if (conversa.id === idChat) {
          return { ...conversa, mensagens: [...conversa.mensagens, novaMensagem] };
        }
        return conversa;
      });
    });

    socket.emit('enviarMensagem', { idChat, mensagem: novaMensagem });
  };

  return (
    <div className="chat-app">
      <Sidebar 
        conversas={conversas} 
        setChatAtivo={setChatAtivo} 
        iniciarConversa={iniciarConversa} 
        usuariosOnline={usuariosOnline} // Exibe a lista completa de usuários online (sem o próprio)
      />
      {chatAtivo ? (
        <ChatWindow 
          chat={chatAtivo} 
          enviarMensagem={enviarMensagem} 
          usuarioAtual={usuario} // Passa o nome do usuário para o ChatWindow
          socket={socket} 
        />
      ) : (
        <div className="mensagem-boas-vindas">Selecione um usuário para começar a conversar</div>
      )}
    </div>
  );
};

export default ChatApp;

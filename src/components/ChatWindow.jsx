import React, { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import Message from './Message';

const ChatWindow = ({ chat, enviarMensagem, usuarioAtual, socket }) => {
  const [usuarioDigitando, setUsuarioDigitando] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.mensagens]);

  useEffect(() => {
    socket.on('usuarioDigitando', (nomeUsuario) => {
      if (nomeUsuario !== usuarioAtual) { // Apenas atualiza se não for o próprio usuário
        setUsuarioDigitando(nomeUsuario);
        setTimeout(() => setUsuarioDigitando(null), 2000); // Limpa a indicação após 2 segundos
      }
    });

    return () => {
      socket.off('usuarioDigitando');
    };
  }, [socket, usuarioAtual]);

  const handleSend = (textoMensagem) => {
    enviarMensagem(chat.id, textoMensagem);
  };

  return (
    <div className="chat-window">
      <div className="mensagens">
        {chat.mensagens.map((msg, index) => (
          <Message 
            key={index} 
            texto={msg.texto} 
            remetente={msg.remetente} 
            horario={msg.horario} 
            usuarioAtual={usuarioAtual}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="indicador-digitando">
        {usuarioDigitando && <span>{usuarioDigitando} está digitando...</span>} {/* Exibe o usuário que está digitando */}
      </div>
      <MessageInput enviar={handleSend} socket={socket} />
    </div>
  );
};

export default ChatWindow;

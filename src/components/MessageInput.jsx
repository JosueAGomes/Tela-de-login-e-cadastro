import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ enviar, socket }) => {
  const [textoInput, setTextoInput] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (textoInput.trim()) {
      enviar(textoInput);
      setTextoInput('');
    }
  };

  const handleTyping = () => {
    socket.emit('usuarioDigitando', localStorage.getItem('nomeUsuario')); // Envia o nome do usuário que está digitando
    // Limpar o timeout anterior
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Definir o timeout para parar de mostrar "digitando" após 2 segundos
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('usuarioParouDigitando'); // Aqui poderia ser uma lógica para notificar que parou de digitar, mas não é necessário agora
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="input-mensagem">
      <input
        type="text"
        value={textoInput}
        onChange={(e) => {
          setTextoInput(e.target.value);
          handleTyping();
        }}
        placeholder="Digite uma mensagem..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default MessageInput;

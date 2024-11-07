import React from 'react';

const Message = ({ texto, remetente, horario, usuarioAtual }) => {
  const isSentByUser = remetente === usuarioAtual; // Verifica se a mensagem foi enviada pelo usuário atual
  return (
    <div className={`mensagem ${isSentByUser ? 'enviada' : 'recebida'}`}>
      <div className="conteudo-mensagem">
        <span className="texto-mensagem">{texto}</span> {/* Exibe apenas o texto da mensagem */}
      </div>
      <div className="horario-mensagem">{horario}</div>
    </div>
  );
};

export default Message;

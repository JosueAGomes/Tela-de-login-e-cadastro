import React from 'react';

const Sidebar = ({ conversas, setChatAtivo, iniciarConversa, usuariosOnline }) => {
  return (
    <div className="sidebar">
      <h3>Usuários Online</h3>
      {usuariosOnline.map((usuario, index) => (
        <div key={index} className="usuario-online" onClick={() => iniciarConversa(usuario)}>
          {usuario}
        </div>
      ))}

      <h3>Conversas Recentes</h3>
      {conversas.map((conversa) => (
        <div key={conversa.id} className="chat-preview" onClick={() => setChatAtivo(conversa)}>
          <div className="chat-nome">
            {conversa.nome}
          </div>
          <div className="ultima-mensagem">
            {conversa.mensagens[conversa.mensagens.length - 1]?.texto}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

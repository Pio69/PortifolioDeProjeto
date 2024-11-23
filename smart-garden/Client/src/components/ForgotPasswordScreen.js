// src/components/ForgotPasswordScreen.js
import React, { useState } from 'react';

function ForgotPasswordScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de recuperação de senha aqui

    // Exemplo de resposta
    setResponseMessage(
      'Em alguns instantes, um e-mail será enviado com instruções para redefinir a senha da sua conta.'
    );
  };

  const validateEmail = (value) => {
    setEmail(value);
    const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    setIsEmailValid(regex.test(value));
  };

  return (
    <div className="col-md-8" id="forgot-password-screen">
      {/* Logo */}
      <div className="d-flex justify-content-center mb-5">
        <img
          className="image-logo"
          src="../assets/images/logo-final.png"
          style={{ width: '85%', objectFit: 'fill', height: '100%' }}
          alt="WEG Image"
        />
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-center">Redefinir senha</h3>
        <p className="text-center">Informe seu e-mail para obter um link de redefinição de senha</p>
      </div>

      {/* Formulário */}
      <div className="mt-5">
        <form id="forgotPasswordForm" onSubmit={handleSubmit}>
          {/* Mensagem de resposta */}
          {responseMessage && (
            <div
              className="text-center w-100 mb-3 txtResponse"
              id="forgotResponseSuccess"
              style={{ fontSize: '14px', color: '#425F0F' }}
            >
              <span>{responseMessage}</span>
            </div>
          )}

          {/* E-mail */}
          <div className="input-group col-lg-12 mb-2">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white px-4 border-md border-right-0">
                <i className="fa fa-envelope text-muted" alt="E-mail"></i>
              </span>
            </div>
            <input
              id="forgotEmail"
              type="email"
              name="email"
              placeholder="E-mail"
              className="form-control bg-white border-left-0 border-md"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
            />
          </div>

          {/* Botão de redefinir senha */}
          <div className="form-group col-lg-12 mx-auto mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-block py-2"
              id="btnForgotPassword"
              disabled={!isEmailValid}
            >
              <span className="font-weight-bold">Redefinir senha</span>
            </button>
          </div>

          {/* Lembra-se da sua senha? */}
          <div className="form-group col-lg-12 mx-auto mt-4 text-right w-100" style={{ fontSize: '14px' }}>
            <button type="button" className="text-primary ml-2 btn btn-link" onClick={onLogin}>
              Conecte-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;

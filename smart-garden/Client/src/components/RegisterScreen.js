// src/components/RegisterScreen.js
import React, { useState } from 'react';

function RegisterScreen({ onLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [strength, setStrength] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Função para verificar a força da senha
  const checkStrength = (password) => {
    let strengthValue = 0;
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strengthValue += 1;
    if (password.match(/([0-9])/)) strengthValue += 1;
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strengthValue += 1;
    if (password.length > 7) strengthValue += 1;

    switch (strengthValue) {
      case 0:
      case 1:
        setStrength('Muito fraca');
        break;
      case 2:
        setStrength('Fraca');
        break;
      case 3:
        setStrength('Boa');
        break;
      case 4:
        setStrength('Forte');
        break;
      default:
        setStrength('');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkStrength(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de registro aqui

    // Exemplo de resposta
    setResponseMessage('Confirme seu email para ter acesso à aplicação.');
  };

  return (
    <div className="col-md-8" id="register-screen">
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
        <h3 className="text-center">Criar conta</h3>
        <p className="text-center">Preencha os campos necessários e cadastre sua conta</p>
      </div>

      {/* Formulário */}
      <div className="mt-4">
        <form id="registerAccountForm" onSubmit={handleSubmit}>
          {/* Mensagem de resposta */}
          {responseMessage && (
            <div
              className="text-center w-100 mb-3"
              id="registerResponseError"
              style={{ fontSize: '14px', color: '#425F0F' }}
            >
              <span id="txtRegisterResponse">{responseMessage}</span>
            </div>
          )}

          {/* Nome completo */}
          <div className="input-group col-lg-12 mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white px-4 border-md border-right-0">
                <i className="fa fa-user text-muted"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control bg-white border-left-0 border-md"
              id="firstName"
              name="firstName"
              placeholder="Nome completo"
              autoComplete="off"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          {/* E-mail */}
          <div className="input-group col-lg-12 mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white px-4 border-md border-right-0">
                <i className="fa fa-envelope text-muted" alt="E-mail"></i>
              </span>
            </div>
            <input
              type="email"
              className="form-control bg-white border-left-0 border-md"
              name="email"
              placeholder="E-mail"
              autoComplete="off"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Senha */}
          <div className="input-group col-lg-12 mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white px-4 border-md border-right-0">
                <i className="fa fa-lock text-muted" alt="Lock" title="Fechadura"></i>
              </span>
            </div>
            <input
              id="registerPassword"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Senha"
              className="form-control bg-white border-left-0 border-md password"
              autoComplete="off"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Alternar visualização da senha"
            >
              <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          {/* Força da senha */}
          {formData.password && (
            <div className="input-group col-lg-12 mb-3" id="strength-section">
              <div className="w-100" id="popover-password">
                <p style={{ fontSize: '12px' }}>
                  Força da senha: <span id="result">{strength}</span>
                </p>
                {/* Barra de progresso (opcional) */}
              </div>
            </div>
          )}

          {/* Confirmar senha */}
          <div className="input-group col-lg-12 mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white px-4 border-md border-right-0">
                <i className="fa fa-lock text-muted" alt="Lock" title="Fechadura"></i>
              </span>
            </div>
            <input
              id="registerConfirmPassword"
              type={passwordVisible ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar senha"
              className="form-control bg-white border-left-0 border-md password"
              autoComplete="off"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Alternar visualização da senha"
            >
              <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          {/* Botão de registro */}
          <div className="form-group col-lg-12 mx-auto mt-4">
            <button type="submit" className="btn btn-primary btn-block py-2" id="btnRegisterAccount">
              <span className="font-weight-bold">Criar conta</span>
            </button>
          </div>

          {/* Já possui uma conta? */}
          <div className="text-center mb-auto" style={{ fontSize: '15px' }}>
            <p id="btn-have-account">
              Já possui uma conta?
              <button type="button" className="text-primary ml-2 btn btn-link" onClick={onLogin}>
                Conecte-se
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;

// src/components/LoginScreen.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo-final.png'; // Caminho para o logo
import './styles.css'; // Estilos específicos da tela de login
import './LoginScreen.css'; // Estilos específicos da tela de login

function LoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [responseError, setResponseError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar requisição para o endpoint de login
      const response = await axios.post('http://localhost:3001/auth/login', formData);

      if (response.data.success) {
        // Armazenar o token JWT (use localStorage ou cookies seguros em produção)
        localStorage.setItem('token', response.data.token);

        // Redirecionar para o dashboard
        navigate('/dashboard');
      } else {
        // Exibir mensagem de erro retornada pelo backend
        setResponseError(response.data.msg);
      }
    } catch (error) {

      console.error("Erro ao fazer login:", error);
      console.log("Mensagem de erro:", responseError);


      // Tratar erros de requisição
      if (error.response) {
        // Erros retornados pelo servidor
        if (error.response.status === 401) {
          setResponseError('Email ou senha incorretos. Por favor, tente novamente.');
        } else if (error.response.status === 404) {
          setResponseError('Usuário não registrado. Por favor, cadastre-se antes de tentar fazer login.');
        } else {
          setResponseError(error.response.data.msg || 'Erro ao fazer login');
        }
      } else {
        // Erros de rede ou outros
        setResponseError('Erro de conexão com o servidor. Verifique sua conexão e tente novamente.');
      }
    }
  };

  return (
    <div className="container-fluid d-flex flex-row p-0 half">
      {/* Lado Esquerdo */}
      <div className="col-lg-4 d-flex flex-column justify-content-center contents">
        <div className="container">
          <div className="row align-items-center justify-content-center h-auto mb-4">
            <div className="col-md-8" id="login-screen">
              {/* Logo */}
              <div className="d-flex justify-content-center mb-2">
                <img
                  className="image-logo"
                  src={logo}
                  alt="Logo"
                  style={{ width: '85%', objectFit: 'fill', height: '100%' }}
                />
              </div>

              {/* Header */}
              <div className="mb-4">
                <h3 className="text-center">Bem-vindo</h3>
                <p className="text-center">Entre com suas credenciais</p>
              </div>

              {/* Formulário */}
              <div className="mt-5">
                <form id="loginForm" onSubmit={handleSubmit}>
                  {/* Mensagem de erro */}
                  {responseError && (
                    <div
                      className="text-center w-100 mb-3 alert alert-danger"
                      id="loginResponseError"
                      role="alert"
                    >
                      <span>{responseError}</span>
                    </div>
                  )}

                  {/* E-mail */}
                  <div className="input-group col-lg-12 mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="E-mail"
                      className="form-control bg-white border-left-0 border-md"
                      autoComplete="off"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  {/* Senha */}
                  <div className="input-group col-lg-12 mb-2">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      placeholder="Senha"
                      className="form-control bg-white border-left-0 border-md password"
                      autoComplete="on"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="toggle"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      aria-label="Alternar visualização da senha"
                    >
                      <i
                        className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                      ></i>
                    </button>
                  </div>

                  {/* Botão de login */}
                  <div className="form-group col-lg-12 mx-auto mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block py-2"
                      id="btnLogin"
                      name="btn-login"
                    >
                      <span className="font-weight-bold">Entrar</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito */}
      <div
        className="col-lg-8 bg"
        style={{
          backgroundImage:
            "url('https://www.housedigest.com/img/gallery/what-is-a-smart-garden-and-should-you-buy-one/intro-1677007007.jpg')",
        }}
      >
        <div
          className="content-left-wrapper opacity-mask"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="col-12">
                <h1 id="dsd-heading">Smart Garden</h1>
                <p id="dsd-description">
                  A aplicação web inteligente de gerenciamento de jardins permite
                  monitorar e controlar remotamente a irrigação, a fertilização e as
                  condições climáticas, proporcionando economia de tempo e recursos
                  para os usuários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

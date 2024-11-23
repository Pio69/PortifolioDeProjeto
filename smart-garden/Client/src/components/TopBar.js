import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; // Importa o arquivo logo.svg
import "./styles.css";
import "./TopBar.css";

function TopBar() {
  const [showDropdown, setShowDropdown] = useState(false); // Controla a exibição do dropdown
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  const isLoggedIn = !!localStorage.getItem("token");

  // Função de logout
  const handleLogout = () => {
    // Remove o token do localStorage
    localStorage.removeItem("token");
    // Redireciona para a tela de login
    navigate("/login");
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-icon-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="top-bar">
      {/* Logo e texto */}
      <Link to="/dashboard" className="logo-container">
        <img src={logo} alt="Smart Garden Logo" width="32" height="32" />
        <span className="logo-text">Smart Garden</span>
      </Link>

      {/* Ícones de autenticação */}
      <div className="auth-icons">
        {isLoggedIn && (
          <div
            className="user-icon-container"
            onClick={() => setShowDropdown(!showDropdown)} // Alterna o estado do dropdown
          >
            <i className="fa-solid fa-user user-icon"></i>
            {/* Dropdown para "Sair" */}
            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <button onClick={handleLogout} className="dropdown-item">
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;

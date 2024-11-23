import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <i className="fa-solid fa-chart-column icon-custom-color"></i>, // Ícone do gráfico de colunas do Font Awesome
      path: '/dashboard'
    },
    {
      icon: <i className="fa-solid fa-bars icon-custom-color"></i>, // Ícone de barras do Font Awesome
      path: '/events'
    },
    {
      icon: <i className="fa-solid fa-pen-to-square icon-custom-color"></i>, // Ícone de barras do Font Awesome
      path: '/forms'
    }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="menu-item"
          onClick={() => navigate(item.path)} // Navega para a rota associada ao botão
        >
          {/* Renderizando o ícone diretamente */}
          {item.icon}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;

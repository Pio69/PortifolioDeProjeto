import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Events from './components/Events'; // Importe o componente Events
import DeviceRegistration from './components/DeviceRegistration'; // Importe o componente Events

import './App.css';

function App() {
  return (
    <Router>
      <div className="d-lg-flex half" style={{ overflow: 'hidden' }}>
        <div className="contents order-2 order-md-1" style={{ width: '100%' }}>
          <div className="container">
            <div
              className="row align-items-center justify-content-center h-auto mb-4"
              style={{ overflowY: 'auto', height: '100vh' }}
            >
              <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<Events />} /> {/* Nova Rota */}
                <Route path="/forms" element={<DeviceRegistration />} /> {/* Nova Rota */}
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

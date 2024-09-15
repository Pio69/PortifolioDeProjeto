import React from 'react';
import Home from './components/Home';
import Sobre from './components/Sobre';
import Devices from './components/Devices';

import {BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>

        <Nav variant="tabs">
          <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
          <Nav.Link as={Link} to="/devices">Devices</Nav.Link>
          <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
        </Nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>

        </BrowserRouter>

      </div>
    </>
  );
}

export default App;
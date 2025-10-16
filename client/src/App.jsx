import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from '../PAGE/Portfolio';
import Home from '../PAGE/Home';
import About from '../PAGE/About';
import Projects from '../PAGE/Projects';
import Skills from '../PAGE/Skills';
import Contact from '../PAGE/Contact';
import Admin from '../PAGE/Admin';
import AdminDashboard from '../PAGE/AdminDashboard';
import AdminProfile from '../PAGE/AdminProfile';
import AdminMessages from '../PAGE/AdminMessages';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Portfolio />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="skills" element={<Skills />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="admin/messages" element={<AdminMessages />} />
        </Route>
      </Routes>  );
}

export default App;

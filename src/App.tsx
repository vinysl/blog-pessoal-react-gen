import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import Cadastro from './pages/register/Cadastro';
import Navbar from './components/navBar/NavBar';
import Home from './pages/home/Home';
import Footer from './components/footer/Footer';
import ListaTemas from './components/themes/listaTemas/ListaTemas';
import FormularioTema from './components/themes/formularioTema/FormularioTema';
import DeletarTema from './components/themes/deletarTema/DeletarTema';
import ListaPostagens from './components/posts/listaPostagens/ListaPostagens';
import FormularioPostagem from './components/posts/formularioPostagem/FormularioPostagem';

import Perfil from './pages/profile/Perfil';
import DeletarPostagem from './components/posts/deletarPostagem/DeletarPostagem';

function App() {

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Navbar />
          <div className='min-h-[80vh]'>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/home" element={<Home />} />
              <Route path="/temas" element={<ListaTemas />} />
              <Route path="/cadastroTema" element={<FormularioTema />} />
              <Route path="/editarTema/:id" element={<FormularioTema />} />
              <Route path="/deletarTema/:id" element={<DeletarTema />} />
              <Route path="/postagens" element={<ListaPostagens />} />
              <Route path="/cadastroPostagem" element={<FormularioPostagem />} />
              <Route path="/editarPostagem/:id" element={<FormularioPostagem />} />
              <Route path="/deletarPostagem/:id" element={<DeletarPostagem />} />
              <Route path="/perfil" element={<Perfil />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
import { Route, Routes } from 'react-router-dom';
import Authpage from './pages/Homepage/Authpage/Authpage';
import Signuppage from './pages/signuppage';
import ProfilePage from './pages/profilepage';
import Homepage from '../../components/Homepage';
import PublicPage from './pages/PublicPage';
import Messages from '../../components/Messages';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Authpage />} />
      <Route path='/home/:username' element={<Homepage />} />
      <Route path='/signup' element={<Signuppage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/public' element={<PublicPage />}/> 
      <Route path='/messages' element={<Messages />}/> 
    </Routes>
  );
}

export default App;

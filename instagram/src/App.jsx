import { Route, Routes } from 'react-router-dom';
import Authpage from './pages/Homepage/Authpage/Authpage';
import Signuppage from './pages/signuppage';
import ProfilePage from './pages/profilepage';
import Homepage from '../../Homepage';
import PublicPage from './pages/PublicPage';
import Messages from '../../Messages';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/auth' element={<Authpage />} />
      <Route path='/signup' element={<Signuppage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/public' element={<PublicPage />}/> 
      <Route path='/messages' element={<Messages />}/> 
    </Routes>
  );
}

export default App;

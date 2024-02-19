import { Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import SignUp from './Pages/signup';
import UploadPost from './Pages/uploadPost';

const App = () => {
 return (
    <>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/newpost" element={<UploadPost />} />
       </Routes>
    </>
    //<UploadPost />
 );
};

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from 'pages/Main';
// import Gallery from 'pages/Gallery';
import Wiki from 'pages/Wiki';
import {ROUTES} from 'constants/routes'
import Header from 'components/Header';

function App() {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/gallery/*" element={<Gallery />} /> */}
        <Route path={ROUTES.WIKI} element={<Wiki />} />
      </Routes>
    </Router>
  );
}

export default App;

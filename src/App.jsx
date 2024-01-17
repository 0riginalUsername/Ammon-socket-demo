
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './components/Home.jsx'
import Room from './components/Room.jsx'
import Login from './components/Login.jsx'
import LandingPage from './components/LandingPage.jsx'


function App() {

  return (
    <BrowserRouter >
      <p className="title">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</p>
 
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<Home/>}/>
        
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

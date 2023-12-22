import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './components/Home.jsx'
import Room from './components/Room.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter >
    <Routes>
    <Route path='/' element={<Home/>}/>
      <Route path='/room' element={<Room/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

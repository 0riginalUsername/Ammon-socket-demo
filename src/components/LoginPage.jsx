import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Login from './Login.jsx'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async (e, formData) => {
    e.preventDefault()

    let res = await axios.post('/api/auth', formData)

    if(res.data.success) {
      navigate('/room')
      console.log('login success');
    } else {
      alert('Login failed!')
    }
  }
  const handleRegister = async (e, formData) => {
    e.preventDefault()
    let res = await axios
  }
  return (
    <>
      <h1>Log In</h1>
      <Login onLogin={handleLogin} />
    </>
  );
}
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Login from './Login.jsx'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async (e, formData) => {
    e.preventDefault()

    let res = await axios.post('http://localhost:5555/api/auth', formData)

    if(res.data.success) {
      navigate('/room')
      console.log('login success');
    } else {
      alert('Login failed!')
    }
  }

  return (
    <>
      <h1>Log In</h1>
      <Login onLogin={handleLogin} />
    </>
  );
}
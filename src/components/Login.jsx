import { useState } from 'react'
import axios from 'axios'

export default function Login() {
    const [usernameValue, setUsernameValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    
    // function handleSubmit(e){
    //     e.preventDefault()
    //     console.log(props);
    //         // onLogin(e, {
    //         //     username: usernameValue,
    //         //     password: passwordValue
    //         // })
        
    // }

    const onLogin = async (e, formData) => {
        e.preventDefault()
    
        let res = await axios.post('http://localhost:5555/api/auth', formData)
    
        if(res.data.success) {
          navigate('/')
          console.log('login success');
        } else {
          alert('Login failed!')
        }
      }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onLogin(e, {
                    username: usernameValue,
                    password: passwordValue,
                });
            }}
        >
            <label htmlFor="username">Username</label>
            <input
                name="username"
                id="username"
                type="text"
                required 
                onChange={(e) => setUsernameValue(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
            name="password"
            id="password"
            type="text"
            required 
            onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button type='submit'>Log in</button>
        </form>
    )
}
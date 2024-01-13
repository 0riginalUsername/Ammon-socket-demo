import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.jsx'
import './index.css'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import {Provider} from 'react-redux'
import Room from './components/Room.jsx'
import store from './store.js'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

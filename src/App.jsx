import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Provider store={store}>
     <Outlet />
     </Provider>
    </>
  )
}

export default App

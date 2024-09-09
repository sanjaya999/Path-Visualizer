import { useState } from 'react'
import './App.css'
import Map from './component/Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Map />
    </>
  )
}

export default App

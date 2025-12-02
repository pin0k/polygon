import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'leaflet/dist/leaflet.css'
import Map from './Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <h1>Vite + React</h1>

      <Map />
      
    </>
  )
}

export default App

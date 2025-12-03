import { useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import Map from './Map'

function App() {
  return (
    <>
      <h1>Проверка попадания адреса в полигон</h1>
      <Map />
    </>
  )
}

export default App

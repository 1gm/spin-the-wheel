import SpinTheWheel from './SpinTheWheel'
import './App.css'

function App() {
  const items = [
    { name: 'Pizza', color: '#FF6B6B' },
    { name: 'Burger', color: '#4ECDC4' },
    { name: 'Sushi', color: '#45B7D1' },
    { name: 'Tacos', color: '#FFA07A' },
    { name: 'Pasta', color: '#98D8C8' },
    { name: 'Salad', color: '#F7DC6F' },
  ]

  return (
    <div className="app">
      <h1>Spin The Wheel!</h1>
      <SpinTheWheel items={items} alwaysChooseItemWithName="Pizza" />
    </div>
  )
}

export default App

import SpinTheWheel, { type SpinTheWheelItem } from './SpinTheWheel';
import './App.css';
import { useEffect, useState } from 'react';

const andi: SpinTheWheelItem[] = [
  { name: 'Cinammon Roll Doll', color: '#FF6B6B', isWinningItem: false },
  { name: 'New Backpack', color: '#4ECDC4', isWinningItem: false },
  { name: "Tony's Sushi", color: '#45B7D1', isWinningItem: false },
  { name: `Clare's Shopping Spree`, color: '#573299', isWinningItem: true },
  { name: 'Amazon Giftcard', color: '#FFA07A', isWinningItem: false },
  { name: 'New Shoes', color: '#98D8C8', isWinningItem: false },
  { name: 'Starbucks Giftcard', color: '#F7DC6F', isWinningItem: false },
]

const sloane: SpinTheWheelItem[] = [
  { name: '10 Pink Drinks', color: '#FF6B6B', isWinningItem: false },
  { name: 'Computer Chair', color: '#4ECDC4', isWinningItem: true },
  { name: 'Bubble Skincare', color: '#45B7D1', isWinningItem: false },
  { name: `Movie Tickets`, color: '#573299', isWinningItem: false },
  { name: 'Soccer Cleats', color: '#FFA07A', isWinningItem: false },
  { name: 'Publix Giftcard', color: '#98D8C8', isWinningItem: false },
  { name: "Dillard's Outfit", color: '#F7DC6F', isWinningItem: false },
]

const hayden: SpinTheWheelItem[] = [
  { name: 'New Leotard', color: '#FF6B6B', isWinningItem: false },
  { name: 'Cirque-de-Soleil Tickets', color: '#4ECDC4', isWinningItem: true },
  { name: 'Water Bottle', color: '#45B7D1', isWinningItem: false },
  { name: `Gymnastics Private`, color: '#573299', isWinningItem: false },
  { name: 'Picasso Palette', color: '#FFA07A', isWinningItem: false },
  { name: 'New Shoes', color: '#98D8C8', isWinningItem: false },
  { name: 'Starbucks Giftcard', color: '#F7DC6F', isWinningItem: false },
]

function App() {
  const [items, setItems] = useState<SpinTheWheelItem[]>([]);

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const name = params.get('name')?.toLocaleLowerCase() || '';
    if (name === 'andi') {
      setItems(andi);
    } else if (name === 'sloane') {
      setItems(sloane);
    } else if (name === 'hayden') {
      setItems(hayden);
    }
  }, []);

  return (
    <div className="app">
      <SpinTheWheel
        items={items}
        numberOfRevolutions={75 + Math.floor(Math.random() * 10)}
      />
    </div>
  );
}

export default App;

import SpinTheWheel, { type SpinTheWheelItem } from './SpinTheWheel';
import './App.css';
import { useEffect, useState } from 'react';

const andi = {
  items: [
    { name: 'Cinammon Roll Doll', color: '#FF6B6B' },
    { name: 'New Backpack', color: '#4ECDC4' },
    { name: "Tony's Sushi", color: '#45B7D1' },
    { name: `Clare's Shopping Spree`, color: '#573299' },
    { name: 'Amazon Giftcard', color: '#FFA07A' },
    { name: 'New Shoes', color: '#98D8C8' },
    { name: 'Starbucks Giftcard', color: '#F7DC6F' },
  ],
  winningItemName: `Clare's Shopping Spree`,
}

const sloane = {
  items: [
    { name: '10 Pink Drinks', color: '#FF6B6B' },
    { name: 'Computer Chair', color: '#4ECDC4' },
    { name: 'Bubble Skincare', color: '#45B7D1' },
    { name: `Movie Tickets`, color: '#573299' },
    { name: 'Soccer Cleats', color: '#FFA07A' },
    { name: 'Publix Giftcard', color: '#98D8C8' },
    { name: "Dillard's Outfit", color: '#F7DC6F' },
  ],
  winningItemName: `Computer Chair`,
}

const hayden = {
  items: [
    { name: 'New Leotard', color: '#FF6B6B' },
    { name: 'Cirque-de-Soleil Tickets', color: '#4ECDC4' },
    { name: 'Water Bottle', color: '#45B7D1' },
    { name: `Gymnastics Private`, color: '#573299' },
    { name: 'Picasso Palette', color: '#FFA07A' },
    { name: 'New Shoes', color: '#98D8C8' },
    { name: 'Starbucks Giftcard', color: '#F7DC6F' },
  ],
  winningItemName: `Cirque-de-Soleil Tickets`
}

function App() {
  const [winningItemName, setWinningItemName] = useState<string>('');
  const [items, setItems] = useState<SpinTheWheelItem[]>([]);

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const name = params.get('name')?.toLocaleLowerCase() || '';
    if (name === 'andi') {
      setItems(andi.items);
      setWinningItemName(andi.winningItemName);
    } else if (name === 'sloane') {
      setItems(sloane.items);
      setWinningItemName(sloane.winningItemName);
    } else if (name === 'hayden') {
      setItems(hayden.items);
      setWinningItemName(hayden.winningItemName);
    }
  }, []);

  return (
    <div className="app">
      <SpinTheWheel
        items={items}
        winningItemName={winningItemName}
        numberOfRevolutions={75 + Math.floor(Math.random() * 10)}
      />
    </div>
  );
}

export default App;

import { useParams, useNavigate } from 'react-router-dom';
import SpinTheWheel from './SpinTheWheel';
import { personData, personNames, type PersonName } from './data';

export default function WheelPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const isValidPerson = (n: string | undefined): n is PersonName => {
    return n !== undefined && personNames.includes(n as PersonName);
  };

  if (!isValidPerson(name)) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', color: '#333' }}>Person not found</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#667eea',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const items = personData[name];

  return (
    <div className="app">
      <SpinTheWheel
        items={items}
        numberOfRevolutions={75 + Math.floor(Math.random() * 10)}
      />
    </div>
  );
}

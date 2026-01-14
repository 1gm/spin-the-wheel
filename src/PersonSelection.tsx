import { useNavigate } from 'react-router-dom';
import { personNames } from './data';

export default function PersonSelection() {
  const navigate = useNavigate();

  const handleSelectPerson = (name: string) => {
    navigate(`/${name}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '1rem',
        }}
      >
        Who is spinning the wheel?
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {personNames.map((name) => (
          <button
            key={name}
            onClick={() => handleSelectPerson(name)}
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#667eea',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5568d3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

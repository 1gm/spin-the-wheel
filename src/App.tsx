import { Routes, Route } from 'react-router-dom';
import './App.css';
import PersonSelection from './PersonSelection';
import WheelPage from './WheelPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<PersonSelection />} />
            <Route path="/:name" element={<WheelPage />} />
        </Routes>
    );
}

export default App;

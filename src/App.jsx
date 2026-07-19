import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Plan from './pages/Plan';
import Equipment from './pages/Equipment';
import EquipmentCategory from './pages/EquipmentCategory';
import EquipmentDetail from './pages/EquipmentDetail';
import Diet from './pages/Diet';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/video/:videoId" element={<EquipmentDetail />} />
        <Route path="/equipment/:categoryId" element={<EquipmentCategory />} />
        <Route path="/diet" element={<Diet />} />
      </Routes>
    </HashRouter>
  );
}

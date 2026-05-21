import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Operations from './pages/Operations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana İskeletimiz */}
        <Route path="/" element={<MainLayout />}>

          {/* İskeletin içinde değişecek sayfalar (Outlet buraları render edecek) */}
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="operations" element={<Operations />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
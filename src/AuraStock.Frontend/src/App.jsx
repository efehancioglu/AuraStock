import { useState, useEffect } from 'react';
import apiClient from './api/axiosClient';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('http://localhost:5117/api/products/with-stock')
      .then((response) => {
        // 1. Gelen veriyi konsola basalım ki neye benzediğini görelim
        console.log("API'den Gelen Ham Cevap:", response.data);

        // 2. Savunmacı Kod: Gelen veri gerçekten bir dizi (array) mi?
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Bazen API'ler veriyi { data: [...] } şeklinde bir nesne içine sarar
          setProducts(response.data.data);
        } else {
          // Hiçbiri değilse sistemi patlatmak yerine boş liste atıyoruz
          console.warn("Beklenmeyen veri formatı geldi!");
          setProducts([]);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Veriler yüklenirken bir hata oluştu. Backend çalışıyor mu?");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Envanter Durumu</h1>

        {isLoading && <p className="text-slate-500">Veriler getiriliyor...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 font-semibold">SKU</th>
                  <th className="py-3 px-6 font-semibold">Ürün Adı</th>
                  <th className="py-3 px-6 font-semibold">Birim Maliyet</th>
                  <th className="py-3 px-6 font-semibold text-center">Güncel Stok</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm">
                {/* 3. Savunmacı Kod: Sadece products bir diziyse map işlemini çalıştır */}
                {Array.isArray(products) && products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 font-medium">{product.sku}</td>
                    <td className="py-3 px-6">{product.name}</td>
                    <td className="py-3 px-6">{product.unitCost} ₺</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.currentStock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {product.currentStock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {Array.isArray(products) && products.length === 0 && (
              <div className="p-6 text-center text-slate-500">
                Sistemde henüz ürün bulunmamaktadır.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
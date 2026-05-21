import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { Trash2 } from 'lucide-react';

const Products = () => {
    // Tablo için State'ler
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form için State
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        unitCost: ''
    });

    // Ürünleri Getirme Fonksiyonu
    const fetchProducts = () => {
        setIsLoading(true);
        apiClient.get('/products/with-stock')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (response.data && Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                } else {
                    setProducts([]);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError("Veriler yüklenirken bir hata oluştu.");
                setIsLoading(false);
            });
    };

    // Sayfa açıldığında verileri çek
    useEffect(() => {
        fetchProducts();
    }, []);

    // Form elemanları değiştikçe state'i güncelle
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Form gönderildiğinde çalışacak asıl POST işlemimiz
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                sku: formData.sku,
                name: formData.name,
                unitCost: parseFloat(formData.unitCost)
            };

            await apiClient.post('/products', payload);

            setFormData({
                sku: '',
                name: '',
                unitCost: ''
            });

            fetchProducts();

        } catch (err) {
            console.error("Ürün eklenirken hata oluştu:", err);
            const errorMessage = err.response?.data?.message || "Ürün eklenirken sistemsel bir hata oluştu.";
            alert(`Hata: ${errorMessage}`);
        }
    };

    const handleDelete = async (id, name) => {
        const isConfirmed = window.confirm(`"${name}" adlı ürünü silmek istediğinize emin misiniz?`);

        if (isConfirmed) {
            try {
                await apiClient.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Silme işlemi başarısız:", err);
                alert("Ürün silinirken bir hata oluştu. Lütfen konsolu kontrol edin.");
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Üst Başlık */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Ürün Yönetimi</h2>
                <p className="text-slate-500 text-sm mt-1">Sisteme yeni ürün ekleyebilir ve mevcut envanteri görüntüleyebilirsiniz.</p>
            </div>

            {/* Ekranı İkiye Bölen Grid Yapısı */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SOL TARAF: Yeni Ürün Ekleme Formu */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Yeni Ürün Ekle</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU Kodu</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Örn: ELK-001"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Örn: Kablosuz Mouse"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Birim Maliyet (₺)</label>
                            <input
                                type="number"
                                name="unitCost"
                                value={formData.unitCost}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
                        >
                            Ürünü Kaydet
                        </button>
                    </form>
                </div>

                {/* SAĞ TARAF: Ürün Tablosu */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-800">Mevcut Ürünler</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                            {Array.isArray(products) ? products.length : 0} Ürün
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 uppercase text-xs leading-normal border-b border-slate-200">
                                    <th className="py-3 px-6 font-semibold">SKU</th>
                                    <th className="py-3 px-6 font-semibold">Ürün Adı</th>
                                    <th className="py-3 px-6 font-semibold text-right">Birim Maliyet</th>
                                    <th className="py-3 px-6 font-semibold text-center">Stok</th>
                                    <th className="py-3 px-6 font-semibold text-center">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 text-sm">
                                {isLoading && (
                                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Veriler yükleniyor...</td></tr>
                                )}
                                {error && (
                                    <tr><td colSpan="5" className="py-8 text-center text-red-500 font-medium">{error}</td></tr>
                                )}
                                {!isLoading && !error && Array.isArray(products) && products.length === 0 && (
                                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Sistemde ürün bulunmuyor.</td></tr>
                                )}
                                {!isLoading && !error && Array.isArray(products) && products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-medium text-slate-900">{product.sku}</td>
                                        <td className="py-3 px-6">{product.name}</td>
                                        <td className="py-3 px-6 text-right font-medium">{product.unitCost} ₺</td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.currentStock > 10 ? 'bg-emerald-100 text-emerald-700' :
                                                    product.currentStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.currentStock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                                title="Ürünü Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Products;
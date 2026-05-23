import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { Trash2, Edit } from 'lucide-react'; // Edit ikonunu ekledik

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // YENİ: Hangi ürünü düzenlediğimizi tutacak state (null ise ekleme modundayız demektir)
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        unitCost: ''
    });

    const fetchProducts = () => {
        setIsLoading(true);
        apiClient.get('/products/with-stock')
            .then((response) => {
                if (Array.isArray(response.data)) setProducts(response.data);
                else if (response.data && Array.isArray(response.data.data)) setProducts(response.data.data);
                else setProducts([]);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError("Veriler yüklenirken bir hata oluştu.");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // YENİ: Tablodaki Düzenle butonuna basılınca çalışacak fonksiyon
    const handleEditClick = (product) => {
        setEditingId(product.id);
        setFormData({
            sku: product.sku,
            name: product.name,
            unitCost: product.unitCost
        });
    };

    // YENİ: Düzenlemekten vazgeçilirse formu sıfırlayacak fonksiyon
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ sku: '', name: '', unitCost: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: editingId, // Sadece PUT işleminde dolu gider, POST'ta null olur
                sku: formData.sku,
                name: formData.name,
                unitCost: parseFloat(formData.unitCost)
            };

            // Akıllı Form: ID varsa PUT yap, yoksa POST yap!
            if (editingId) {
                await apiClient.put(`/products/${editingId}`, payload);
            } else {
                await apiClient.post('/products', payload);
            }

            cancelEdit(); // İşlem bitince formu temizle
            fetchProducts();

        } catch (err) {
            console.error("İşlem sırasında hata oluştu:", err);
            const errorMessage = err.response?.data?.message || "Sistemsel bir hata oluştu.";
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
                alert("Ürün silinirken bir hata oluştu.");
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Ürün Yönetimi</h2>
                <p className="text-slate-500 text-sm mt-1">Sisteme yeni ürün ekleyebilir, mevcut envanteri güncelleyebilir veya silebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Akıllı Form: Başlık state'e göre değişiyor */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit transition-all duration-300">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
                        {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU Kodu</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Butonlar state'e göre değişiyor */}
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                type="submit"
                                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-white ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {editingId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
                            </button>

                            {/* Düzenleme modundaysak İptal butonu göster */}
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    İptal Et
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Sağ Taraf: Ürün Tablosu */}
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
                                            <div className="flex justify-center gap-2">
                                                {/* YENİ: Düzenle Butonu */}
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded-md hover:bg-amber-50"
                                                    title="Ürünü Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                {/* Silme Butonu */}
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                                    title="Ürünü Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
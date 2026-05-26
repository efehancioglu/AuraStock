import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { ArrowDownToLine, ArrowUpFromLine, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const Operations = () => {
    // Form Stateleri
    const [movementType, setMovementType] = useState(1);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    // Veri Stateleri
    const [products, setProducts] = useState([]);
    const [recentMovements, setRecentMovements] = useState([]); // YENİ: Son hareketleri tutacağımız state
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Ürünleri çeken fonksiyon
    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/products/with-stock');
            const data = Array.isArray(response.data) ? response.data : response.data.data;
            setProducts(data || []);
        } catch (err) {
            console.error("Ürünler yüklenirken hata:", err);
        }
    };

    // YENİ: Son hareketleri API'den çeken fonksiyon
    const fetchRecentMovements = async () => {
        try {
            const response = await apiClient.get('/stockmovements/recent?count=5');
            // API'den gelen verinin yapısına göre diziyi alıyoruz
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setRecentMovements(data);
        } catch (err) {
            console.error("Son hareketler yüklenirken hata:", err);
        }
    };

    // Sayfa ilk açıldığında ikisini de çalıştır
    useEffect(() => {
        fetchProducts();
        fetchRecentMovements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!productId || !quantity || quantity <= 0) {
            setMessage({ text: 'Lütfen geçerli bir ürün ve miktar girin.', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                productId: productId,
                movementType: movementType,
                quantity: parseInt(quantity, 10),
                referenceNumber: referenceNumber || "Bilinmiyor"
            };

            await apiClient.post('/stockmovements', payload);

            setMessage({ text: 'Stok hareketi başarıyla işlendi!', type: 'success' });

            setQuantity('');
            setReferenceNumber('');
            setProductId('');

            // İşlem başarılı olunca hem stoğu güncelle hem de son hareketleri yenile!
            fetchProducts();
            fetchRecentMovements();

        } catch (err) {
            console.error("Stok işlemi hatası:", err);
            const errorMsg = err.response?.data?.message || "İşlem sırasında bir hata oluştu.";
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Tarihi güzel bir formata çeviren yardımcı fonksiyon
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Stok İşlemleri (Mal Kabul & Sevkıyat)</h2>
                <p className="text-slate-500 text-sm mt-1">Depoya ürün girişi veya çıkışı yapmak için bu ekranı kullanın.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* SOL PANEL: Operasyon Formu (Buraya hiç dokunmadık, aynen duruyor) */}
                <div className={`bg-white p-6 rounded-xl shadow-sm border-t-4 transition-colors duration-300 ${movementType === 1 ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Yeni İşlem Kaydı</h3>

                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setMovementType(1)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${movementType === 1
                                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500'
                                    : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'
                                }`}
                        >
                            <ArrowDownToLine size={20} />
                            Mal Kabul (Giriş)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMovementType(2)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${movementType === 2
                                    ? 'bg-rose-100 text-rose-800 border-2 border-rose-500'
                                    : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'
                                }`}
                        >
                            <ArrowUpFromLine size={20} />
                            Sevkıyat (Çıkış)
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">İşlem Yapılacak Ürün</label>
                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                            >
                                <option value="" disabled>Ürün Seçiniz...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        [{p.sku}] {p.name} - Mevcut Stok: {p.currentStock}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Miktar</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">İrsaliye/Fiş No (Opsiyonel)</label>
                                <input
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Örn: INV-2026"
                                />
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 px-4 rounded-lg text-white font-bold text-lg transition-colors flex justify-center items-center gap-2 ${movementType === 1 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'İşleniyor...' : (movementType === 1 ? 'Stoğa Ekle' : 'Stoktan Düş')}
                        </button>
                    </form>
                </div>

                {/* SAĞ PANEL: Son Hareketler (Şimdi Canlandı!) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Son Hareketler</h3>
                        <Clock size={18} className="text-slate-400" />
                    </div>

                    {recentMovements.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>Henüz bir stok hareketi bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentMovements.map((movement) => (
                                <div key={movement.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {/* İkon ve Renk Ayrımı */}
                                        <div className={`p-2 rounded-full ${movement.type === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {movement.type === 1 ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{movement.productName}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <span>{formatDate(movement.movementDate)}</span>
                                                {movement.referenceNumber !== "Bilinmiyor" && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{movement.referenceNumber}</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Miktar */}
                                    <div className={`font-bold text-lg ${movement.type === 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {movement.type === 1 ? '+' : '-'}{movement.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Operations;
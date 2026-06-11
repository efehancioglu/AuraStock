import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { Package, Activity, Calendar, AlertTriangle, AlertOctagon, CheckCircle2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalProducts: 0, totalMovements: 0, todayMovementsCount: 0, outOfStockAlerts: 0 });
    const [criticalProducts, setCriticalProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [topSellers, setTopSellers] = useState([]); // YENİ: En çok satanlar state'i
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // YENİ: 4 veriyi de aynı anda çekerek hızı maksimumda tutuyoruz
                const [summaryRes, criticalRes, chartRes, topSellersRes] = await Promise.all([
                    apiClient.get('/dashboard/summary'),
                    apiClient.get('/dashboard/critical-stock?threshold=20'),
                    apiClient.get('/dashboard/daily-movements'),
                    apiClient.get('/dashboard/top-sellers?count=5') // Yeni API çağrımız
                ]);

                const criticalData = Array.isArray(criticalRes.data) ? criticalRes.data : criticalRes.data.data || [];
                setCriticalProducts(criticalData);

                const chartDataArray = Array.isArray(chartRes.data) ? chartRes.data : chartRes.data.data || [];
                setChartData(chartDataArray);

                // En çok satanları state'e aktar
                const topSellersArray = Array.isArray(topSellersRes.data) ? topSellersRes.data : topSellersRes.data.data || [];
                setTopSellers(topSellersArray);

                setStats({
                    ...summaryRes.data,
                    outOfStockAlerts: criticalData.length
                });

            } catch (error) {
                console.error("Dashboard verileri yüklenemedi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass, subText }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">{subText}</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Hoş Geldin, Yönetici 🚀</h1>
                <p className="text-slate-500 mt-1">İşte AuraStock sistemindeki güncel durumun özeti.</p>
            </div>

            {/* 4'lü İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Ürün" value={stats.totalProducts} icon={Package} colorClass="bg-blue-50 text-blue-600" subText="Sistemdeki aktif ürün çeşitliliği" />
                <StatCard title="Toplam Hareket" value={stats.totalMovements} icon={Activity} colorClass="bg-purple-50 text-purple-600" subText="Tüm zamanların giriş/çıkış trafiği" />
                <StatCard title="Bugünkü İşlemler" value={stats.todayMovementsCount} icon={Calendar} colorClass="bg-emerald-50 text-emerald-600" subText="Son 24 saatte yapılan kayıtlar" />
                <StatCard title="Kritik Stok" value={stats.outOfStockAlerts} icon={AlertTriangle} colorClass="bg-rose-50 text-rose-600" subText="Acil takviye gereken ürünler" />
            </div>

            {/* İKİ GRAFİĞİ YAN YANA KOYDUĞUMUZ YENİ ALAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Sol Grafik: Günlük Trend (Zaten Vardı) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Son 7 Günlük Depo Trafiği</h3>
                    <div className="h-[300px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="inAmount" name="Mal Kabul" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    <Bar dataKey="outAmount" name="Sevkıyat" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">Veri yükleniyor...</div>
                        )}
                    </div>
                </div>

                {/* Sağ Grafik: En Çok Satanlar (YENİ) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-blue-500" size={24} />
                        <h3 className="text-lg font-bold text-slate-800">En Çok Çıkış Yapan 5 Ürün</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        {topSellers.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                {/* layout="vertical" komutu ile grafiği yan yatırıyoruz */}
                                <BarChart data={topSellers} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis type="category" dataKey="productName" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 13, fontWeight: 500 }} width={100} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="totalSold" name="Toplam Çıkış Adedi" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <Package className="mb-2 opacity-50" size={32} />
                                <p>Henüz yeterli satış verisi yok.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ALT ALAN: Kritik Stok Tablosu (Aynen duruyor, sadece hızlı menüyü çıkardık geniş dursun diye) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <AlertOctagon className="text-rose-500" size={24} />
                    <h4 className="text-lg font-bold text-slate-800">Kritik Seviyedeki Ürünler (20 Adet Altı)</h4>
                </div>

                <div className="p-0">
                    {criticalProducts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <CheckCircle2 className="mx-auto mb-3 text-emerald-500 opacity-50" size={48} />
                            <p>Harika! Şu an kritik seviyede hiçbir ürün bulunmuyor.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">SKU Kodu</th>
                                    <th className="px-6 py-4 font-medium">Ürün Adı</th>
                                    <th className="px-6 py-4 font-medium text-right">Kalan Stok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {criticalProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 font-mono text-sm">{product.sku}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${product.currentStock <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {product.currentStock} Adet
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;   
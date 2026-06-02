import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { Package, Activity, Calendar, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
// YENİ: Recharts importları
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalMovements: 0,
        todayMovementsCount: 0,
        outOfStockAlerts: 0
    });
    const [criticalProducts, setCriticalProducts] = useState([]);
    const [chartData, setChartData] = useState([]); // YENİ: Grafik verisi için state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // YENİ: 3 isteği aynı anda (paralel) gönderiyoruz
                const [summaryRes, criticalRes, chartRes] = await Promise.all([
                    apiClient.get('/dashboard/summary'),
                    apiClient.get('/dashboard/critical-stock?threshold=20'),
                    apiClient.get('/dashboard/daily-movements') // Grafiği çeken API
                ]);

                const criticalData = Array.isArray(criticalRes.data) ? criticalRes.data : criticalRes.data.data || [];
                setCriticalProducts(criticalData);

                // Grafik verisini state'e yaz
                const chartDataArray = Array.isArray(chartRes.data) ? chartRes.data : chartRes.data.data || [];
                setChartData(chartDataArray);

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Toplam Ürün"
                    value={stats.totalProducts}
                    icon={Package}
                    colorClass="bg-blue-50 text-blue-600"
                    subText="Sistemdeki aktif ürün çeşitliliği"
                />
                <StatCard
                    title="Toplam Hareket"
                    value={stats.totalMovements}
                    icon={Activity}
                    colorClass="bg-purple-50 text-purple-600"
                    subText="Tüm zamanların giriş/çıkış trafiği"
                />
                <StatCard
                    title="Bugünkü İşlemler"
                    value={stats.todayMovementsCount}
                    icon={Calendar}
                    colorClass="bg-emerald-50 text-emerald-600"
                    subText="Son 24 saatte yapılan kayıtlar"
                />
                <StatCard
                    title="Kritik Stok"
                    value={stats.outOfStockAlerts}
                    icon={AlertTriangle}
                    colorClass="bg-rose-50 text-rose-600"
                    subText="Acil takviye gereken ürünler"
                />
            </div>

            {/* ORTA ALAN: Grafik (YENİ EKLENDİ) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Son 7 Günlük Depo Trafiği</h3>
                <div className="h-[350px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                {/* Renkler Operasyon ekranındaki temamıza uyumlu: Yeşil Giriş, Kırmızı Çıkış */}
                                <Bar dataKey="inAmount" name="Mal Kabul (Giriş)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="outAmount" name="Sevkıyat (Çıkış)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            Grafik verisi yükleniyor...
                        </div>
                    )}
                </div>
            </div>

            {/* ALT ALAN: Kritik Stok Tablosu ve Hızlı Menü (Aynen duruyor) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                                                <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${product.currentStock <= 0
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                    }`}>
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

                <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Hızlı Kısayollar</h4>
                        <p className="text-slate-400 text-sm mb-6">Sistemdeki operasyonları hızlıca yönetmek için ilgili sayfalara geçiş yapabilirsiniz.</p>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2 border-b border-slate-700 pb-2 hover:text-white cursor-pointer transition-colors">→ Yeni Mal Kabul Gir</li>
                            <li className="flex items-center gap-2 border-b border-slate-700 pb-2 hover:text-white cursor-pointer transition-colors">→ Yeni Ürün Tanımla</li>
                            <li className="flex items-center gap-2 pb-2 hover:text-white cursor-pointer transition-colors">→ Detaylı Stok Raporu Al</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import apiClient from '../api/axiosClient';
import { Package, Activity, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    // 1. STATE (DURUM) YÖNETİMİ
    // Programlamada State, bir bileşenin o anki hafızasıdır. 
    // API'den veri gelene kadar ekranın boş kalmaması veya hata vermemesi için başlangıç değerleri (0) atıyoruz.
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalMovements: 0,
        todayMovementsCount: 0,
        outOfStockAlerts: 0
    });
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                //Backend'deki Dashboard kapısını çalıyoruz.
                const response = await apiClient.get('/dashboard/summary');
                setStats(response.data);
            } catch (error) {
                console.error("Dashboard verileri yüklenemedi:", error);
            } finally {
                setIsLoading(false); // Veri gelse de gelmese de yükleme animasyonunu kapat.
            }
        };

        fetchDashboardData();
    }, []); // Sondaki boş dizi [], bu işlemin sadece sayfa ilk açıldığında 1 kez yapılmasını sağlar.

    // 3. YARDIMCI BİLEŞEN (StatCard)
    // Kod tekrarını önlemek için (DRY - Don't Repeat Yourself prensibi) küçük bir kart şablonu oluşturuyoruz.
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
            {/* Karşılama Alanı */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Hoş Geldin, Mimar 🚀</h1>
                <p className="text-slate-500 mt-1">İşte AuraStock sistemindeki güncel durumun özeti.</p>
            </div>

            {/* İSTATİSTİK KARTLARI - Grid Yapısı */}
            {/* Tailwind'deki 'grid' yapısı, ekranı sütunlara bölerek düzenli bir yerleşim sağlar. */}
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
                    subText="Takviye gereken ürün sayısı"
                />
            </div>

            {/* ALT ALAN: Grafik ve Detaylar için Yer Tutucu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center text-center">
                    <TrendingUp size={48} className="text-slate-200 mb-4" />
                    <h4 className="text-lg font-semibold text-slate-700">Satış ve Stok Trendi</h4>
                    <p className="text-slate-400 text-sm max-w-xs">İleride buraya Recharts kütüphanesi ile harika grafikler çizeceğiz.</p>
                </div>

                <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold mb-2">Hızlı Operasyon</h4>
                        <p className="text-slate-400 text-sm">Bekleyen mal kabul veya sevkıyat işlemlerini Operasyon ekranından yönetebilirsin.</p>
                    </div>
                    <button className="bg-white text-slate-900 font-bold py-3 px-6 rounded-xl mt-8 hover:bg-blue-50 transition-colors">
                        Sistemi Kontrol Et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
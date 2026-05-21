import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();


    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`;
    };

    return (
        <div className="flex h-screen bg-slate-50">

            {/* Sol Menü (Sidebar) */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        AuraStock
                    </h1>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Yönetim Paneli</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6">
                    <Link to="/" className={getLinkClass('/')}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/products" className={getLinkClass('/products')}>
                        <Package size={20} />
                        <span className="font-medium">Ürün Yönetimi</span>
                    </Link>
                    <Link to="/operations" className={getLinkClass('/operations')}>
                        <ArrowRightLeft size={20} />
                        <span className="font-medium">Stok İşlemleri</span>
                    </Link>
                </nav>
            </aside>

            {/* Sağ İçerik Alanı (Değişen Kısım) */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default MainLayout;
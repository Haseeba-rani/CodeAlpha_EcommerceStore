// admin-app.js
// Admin dashboard — store statistics, inventory table and recent orders.
// Reads GET /api/admin/stats, /api/admin/products and /api/admin/orders.

function StatCard({ icon, label, value, accent }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
                <div className={`${icon} ${accent}`}></div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--secondary-color)]">{value}</p>
        </div>
    );
}

function AdminApp() {
    const [stats, setStats] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [tab, setTab] = React.useState('products');
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState('');

    React.useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                window.location.href = 'login.html';
                return;
            }
            setLoading(true);
            Promise.all([Admin.getStats(), Admin.getProducts(), Admin.getOrders()])
                .then(([s, p, o]) => {
                    setStats(s.data);
                    setProducts(p.data.items || []);
                    setOrders(o.data.items || []);
                })
                .catch((err) => {
                    if (err.status === 401) window.location.href = 'login.html';
                    else if (err.status === 403) setErrorMsg('You do not have admin access to this store.');
                    else setErrorMsg(err.message || 'Failed to load dashboard data.');
                })
                .finally(() => setLoading(false));
        });
        return unsubscribe;
    }, []);

    const money = (n) => `$${Number(n || 0).toFixed(2)}`;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-6">
                    <a href="index.html" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                        <div className="icon-arrow-left mr-1"></div> Back to Home
                    </a>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500 mb-8">Overview of your catalog, stock levels and customer orders.</p>

                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {errorMsg}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading dashboard...</div>
                ) : (
                    <React.Fragment>
                        {stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                                <StatCard icon="icon-package" accent="text-indigo-500" label="Products" value={stats.totalProducts} />
                                <StatCard icon="icon-shopping-bag" accent="text-pink-500" label="Orders" value={stats.totalOrders} />
                                <StatCard icon="icon-dollar-sign" accent="text-green-500" label="Revenue" value={money(stats.revenue)} />
                                <StatCard icon="icon-trending-up" accent="text-amber-500" label="Units Sold" value={stats.unitsSold} />
                            </div>
                        )}

                        <div className="flex gap-2 mb-5">
                            {[['products', 'Inventory'], ['orders', 'Orders']].map(([id, label]) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === id ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[var(--primary-color)]'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {tab === 'products' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="text-left px-6 py-3">Product</th>
                                            <th className="text-left px-6 py-3">Category</th>
                                            <th className="text-right px-6 py-3">Price</th>
                                            <th className="text-right px-6 py-3">Stock</th>
                                            <th className="text-right px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50/60">
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                                        <a href={`product.html?id=${p.id}`} className="font-medium text-gray-900 hover:text-[var(--primary-color)]">{p.title}</a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">{p.category}</td>
                                                <td className="px-6 py-3 text-right font-medium text-gray-900">{money(p.price)}</td>
                                                <td className="px-6 py-3 text-right text-gray-600">{p.stock}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${p.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' : p.stock < 20 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                        {p.stock === 0 ? 'Out of stock' : p.stock < 20 ? 'Low stock' : 'In stock'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {tab === 'orders' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                                {orders.length === 0 ? (
                                    <div className="py-16 text-center text-gray-500">No orders have been placed yet.</div>
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="text-left px-6 py-3">Order</th>
                                                <th className="text-left px-6 py-3">Date</th>
                                                <th className="text-left px-6 py-3">Customer</th>
                                                <th className="text-right px-6 py-3">Items</th>
                                                <th className="text-right px-6 py-3">Total</th>
                                                <th className="text-right px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orders.map((o) => (
                                                <tr key={o.id} className="hover:bg-gray-50/60">
                                                    <td className="px-6 py-3 font-medium text-gray-900">{o.id}</td>
                                                    <td className="px-6 py-3 text-gray-600">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                                                    <td className="px-6 py-3 text-gray-600">{(o.contact && (o.contact.email || o.contact.fullName)) || '—'}</td>
                                                    <td className="px-6 py-3 text-right text-gray-600">{(o.items || []).reduce((n, i) => n + i.quantity, 0)}</td>
                                                    <td className="px-6 py-3 text-right font-semibold text-gray-900">{money(o.total)}</td>
                                                    <td className="px-6 py-3 text-right capitalize text-gray-600">{o.status || 'pending'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                )}
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);

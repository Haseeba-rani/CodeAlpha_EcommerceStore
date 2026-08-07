// orders-app.js
// "My Orders" page — renders the signed-in shopper's order history from
// GET /api/orders/my (order id, date, status, items and totals).

function StatusBadge({ status }) {
    const styles = {
        processing: 'bg-amber-50 text-amber-700 border-amber-200',
        shipped: 'bg-blue-50 text-blue-700 border-blue-200',
        delivered: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    const cls = styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
    return (
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cls}`}>
            {status || 'pending'}
        </span>
    );
}

function OrdersApp() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState('');

    React.useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                window.location.href = 'login.html';
                return;
            }
            setLoading(true);
            Orders.getMyOrders()
                .then((res) => setOrders(res.data.items || res.data || []))
                .catch((err) => {
                    if (err.status === 401) window.location.href = 'login.html';
                    else setErrorMsg(err.message || 'Failed to load your orders.');
                })
                .finally(() => setLoading(false));
        });
        return unsubscribe;
    }, []);

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        return isNaN(date) ? '' : date.toLocaleString();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-6">
                    <a href="index.html" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                        <div className="icon-arrow-left mr-1"></div> Back to Home
                    </a>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-500 mb-8">Track every order you have placed with Hapyshop.</p>

                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {errorMsg}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                        <div className="icon-package text-5xl text-gray-300 mb-4 mx-auto"></div>
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                        <a href="products.html" className="btn-primary inline-flex items-center px-6 py-2.5 rounded-xl">Start Shopping</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-gray-50/70 border-b border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">Order {order.id}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={order.status} />
                                        <span className="font-extrabold text-xl text-[var(--secondary-color)]">
                                            ${Number(order.total || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {(order.items || []).map((item) => (
                                        <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
                                            <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                                            <div className="flex-grow">
                                                <a href={`product.html?id=${item.productId}`} className="font-medium text-gray-900 hover:text-[var(--primary-color)]">
                                                    {item.title}
                                                </a>
                                                <p className="text-sm text-gray-500">
                                                    ${Number(item.price).toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-6 py-4 bg-white border-t border-gray-100 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Payment</span>
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Contact</span>
                                        {order.contact
                                            ? `${order.contact.firstName || ''} ${order.contact.lastName || ''}`.trim() +
                                              (order.contact.email ? ` · ${order.contact.email}` : '') +
                                              (order.contact.phone ? ` · ${order.contact.phone}` : '')
                                            : '—'}
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Shipping to</span>
                                        {order.shippingAddress
                                            ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
                                            : '—'}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<OrdersApp />);

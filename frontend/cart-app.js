function CartApp() {
    const [cart, setCart] = React.useState({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [updatingId, setUpdatingId] = React.useState(null);

    const loadCart = () => {
        setLoading(true);
        setErrorMsg('');

        Cart.get()
            .then((res) => setCart(res.data))
            .catch((err) => {
                if (err.status === 401) {
                    window.location.href = 'login.html';
                } else {
                    setErrorMsg(err.message || 'Failed to load your cart.');
                }
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = (item, newQuantity) => {
        setUpdatingId(item.productId);
        Cart.updateItem(item.productId, Math.max(0, newQuantity))
            .then((res) => {
                setCart(res.data);
                notifyCartUpdated();
            })
            .catch((err) => setErrorMsg(err.message || 'Failed to update item.'))
            .finally(() => setUpdatingId(null));
    };

    const handleRemoveItem = (item) => {
        setUpdatingId(item.productId);
        Cart.removeItem(item.productId)
            .then((res) => {
                setCart(res.data);
                notifyCartUpdated();
            })
            .catch((err) => setErrorMsg(err.message || 'Failed to remove item.'))
            .finally(() => setUpdatingId(null));
    };

    const cartItems = cart.items || [];
    const subtotal = cart.subtotal || 0;
    const tax = cart.tax || 0;
    const shipping = cart.shipping || 0;
    const total = cart.total || 0;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {errorMsg}
                    </div>
                )}
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            {loading ? (
                                <div className="text-center py-12 text-gray-400">Loading your cart...</div>
                            ) : cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="icon-shopping-cart text-5xl text-gray-300 mb-4 mx-auto"></div>
                                    <p className="text-gray-500">Your cart is currently empty.</p>
                                    <a href="products.html" className="text-[var(--primary-color)] mt-2 inline-block">Continue Shopping</a>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-sm text-gray-500 border-b border-gray-100">
                                            <th className="pb-4 font-normal">Product</th>
                                            <th className="pb-4 font-normal text-center">Quantity</th>
                                            <th className="pb-4 font-normal text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {cartItems.map(item => (
                                            <tr key={item.productId} className={updatingId === item.productId ? 'opacity-50' : ''}>
                                                <td className="py-4 flex items-center">
                                                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover mr-4" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.title}</p>
                                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                                        <button
                                                            onClick={() => handleRemoveItem(item)}
                                                            className="text-xs text-red-500 hover:text-red-700 mt-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center justify-center border border-gray-300 rounded w-24 mx-auto">
                                                        <button
                                                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                            disabled={updatingId === item.productId}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            -
                                                        </button>
                                                        <input type="text" value={item.quantity} className="w-8 text-center text-sm focus:outline-none" readOnly />
                                                        <button
                                                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                            disabled={updatingId === item.productId}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right font-medium text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                                <span>Total</span><span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => window.location.href = 'checkout.html'}
                                disabled={cartItems.length === 0}
                                className="w-full btn-primary flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CartApp />);

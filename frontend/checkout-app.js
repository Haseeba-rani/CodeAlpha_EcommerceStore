function CheckoutApp() {
    const [cart, setCart] = React.useState({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [placedOrder, setPlacedOrder] = React.useState(null);

    React.useEffect(() => {
        Cart.get()
            .then((res) => {
                setCart(res.data);
                if (!res.data.items || res.data.items.length === 0) {
                    // Nothing to check out — send the shopper back to browse products.
                    window.location.href = 'products.html';
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    window.location.href = 'login.html';
                } else {
                    setErrorMsg(err.message || 'Failed to load your cart.');
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        const formData = new FormData(e.target);

        const payload = {
            contact: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
            },
            shippingAddress: {
                street: formData.get('street'),
                city: formData.get('city'),
                state: formData.get('state'),
                postalCode: formData.get('postalCode'),
                country: formData.get('country'),
            },
            paymentMethod: formData.get('paymentMethod'),
        };

        setSubmitting(true);
        Orders.create(payload)
            .then((res) => {
                notifyCartUpdated();
                setPlacedOrder(res.data);
            })
            .catch((err) => {
                setErrorMsg(err.message || 'Failed to place order. Please try again.');
            })
            .finally(() => setSubmitting(false));
    };

    const cartItems = cart.items || [];
    const subtotal = cart.subtotal || 0;
    const tax = cart.tax || 0;
    const shipping = cart.shipping || 0;
    const total = cart.total || 0;

    if (placedOrder) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                        <div className="icon-check text-3xl text-green-600"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Order placed successfully!</h1>
                    <p className="text-gray-500 mb-2">Thank you for shopping with Hapyshop.</p>
                    <p className="text-sm text-gray-400 mb-8">Order ID: {placedOrder.id}</p>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left mb-8">
                        <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                        {placedOrder.items.map((item) => (
                            <div key={item.productId} className="flex justify-between text-sm text-gray-600 py-1">
                                <span>{item.title} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 mt-3 pt-3">
                            <span>Total</span>
                            <span>${placedOrder.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <a href="products.html" className="btn-primary inline-flex items-center justify-center px-8 py-3">Continue Shopping</a>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {errorMsg}
                    </div>
                )}
                
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Form Section */}
                    <div className="w-full lg:w-2/3">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            {/* Contact Info */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contact Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input type="text" name="firstName" required className="input-field" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input type="text" name="lastName" required className="input-field" placeholder="Doe" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                        <input type="email" name="email" required className="input-field" placeholder="john@example.com" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input type="tel" name="phone" required className="input-field" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Shipping Address</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                        <input type="text" name="street" required className="input-field" placeholder="123 Main St" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input type="text" name="city" required className="input-field" placeholder="New York" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State / Province *</label>
                                        <input type="text" name="state" required className="input-field" placeholder="NY" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                                        <input type="text" name="postalCode" required className="input-field" placeholder="10001" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                        <select name="country" className="input-field" required defaultValue="United States">
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                                        <input type="radio" name="paymentMethod" value="card" className="h-4 w-4 text-[var(--primary-color)]" defaultChecked />
                                        <span className="ml-3 font-medium text-gray-900 flex items-center">
                                            <div className="icon-credit-card mr-2 text-gray-500"></div> Credit / Debit Card
                                        </span>
                                    </label>
                                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                                        <input type="radio" name="paymentMethod" value="cod" className="h-4 w-4 text-[var(--primary-color)]" />
                                        <span className="ml-3 font-medium text-gray-900 flex items-center">
                                            <div className="icon-truck mr-2 text-gray-500"></div> Cash on Delivery (COD)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            {loading ? (
                                <div className="text-center text-gray-400 py-8">Loading cart...</div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cartItems.map(item => (
                                            <div key={item.productId} className="flex items-center gap-4">
                                                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md object-cover border border-gray-100" />
                                                <div className="flex-grow">
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600 mb-6">
                                        <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-gray-900">${shipping.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Estimated Tax</span><span className="font-medium text-gray-900">${tax.toFixed(2)}</span></div>
                                    </div>
                                    
                                    <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-xl text-[var(--secondary-color)] mb-6">
                                        <span>Total</span><span>${total.toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            <button type="submit" form="checkout-form" disabled={submitting || loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                                <div className="icon-lock"></div> {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                            <div className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
                                <div className="icon-shield-check mr-1"></div> Secure and encrypted checkout
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CheckoutApp />);

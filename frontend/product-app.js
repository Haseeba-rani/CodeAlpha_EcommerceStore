function ProductApp() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || '1';

    const [product, setProduct] = React.useState(null);
    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [activeVariant, setActiveVariant] = React.useState(null);
    const [quantity, setQuantity] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [toast, setToast] = React.useState('');

    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setErrorMsg('');

        Products.getById(productId)
            .then((res) => {
                if (cancelled) return;
                const fetchedProduct = res.data;
                setProduct(fetchedProduct);
                setActiveVariant(fetchedProduct.variants[0]);
                setQuantity(1);

                // Fetch a few related products from the same category.
                return Products.list({ category: fetchedProduct.category, limit: 5 }).then((relatedRes) => {
                    if (cancelled) return;
                    setRelatedProducts(
                        relatedRes.data.items.filter((p) => p.id !== fetchedProduct.id).slice(0, 4)
                    );
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setErrorMsg(err.message || 'Product not found.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [productId]);

    React.useEffect(() => {
        if (!toast) return;
        const timeout = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timeout);
    }, [toast]);

    const addProductToCart = (targetProduct, qty, onSuccess) => {
        Cart.addItem(targetProduct.id, qty)
            .then(() => {
                notifyCartUpdated();
                if (onSuccess) onSuccess();
                else setToast(`Added "${targetProduct.title}" to cart`);
            })
            .catch((err) => {
                if (err.status === 401) {
                    window.location.href = 'login.html';
                } else {
                    setToast(err.message || 'Could not add item to cart.');
                }
            });
    };

    const handleAddToCart = () => addProductToCart(product, quantity);

    const handleBuyNow = () => {
        addProductToCart(product, quantity, () => {
            window.location.href = 'checkout.html';
        });
    };

    const handleRelatedAddToCart = (relatedProduct) => addProductToCart(relatedProduct, 1);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow flex items-center justify-center text-gray-400">Loading product...</div>
                <Footer />
            </div>
        );
    }

    if (errorMsg || !product) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <p className="text-gray-500 mb-4">{errorMsg || 'Product not found.'}</p>
                    <a href="products.html" className="btn-primary">Back to Products</a>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500">
                    <a href="index.html" className="hover:text-[var(--primary-color)]">Home</a>
                    <span className="mx-2">/</span>
                    <a href="products.html" className="hover:text-[var(--primary-color)]">{product.category}</a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.title}</span>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-6">
                    <a href="index.html" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                        <div className="icon-arrow-left mr-1"></div> Back to Home
                    </a>
                </div>
                {/* Product Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-12 flex flex-col md:flex-row gap-10">
                    {/* Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="relative rounded-xl overflow-hidden bg-white aspect-square border border-gray-100">
                            <img src={product.image} style={{ filter: activeVariant.filter }} alt={product.title} className="w-full h-full object-cover" />
                            {product.badge && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--accent-color)] to-purple-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md z-10">
                                    {product.badge}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.variants.map((variant, idx) => (
                                <div key={idx} 
                                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeVariant === variant ? 'border-[var(--primary-color)] shadow-md' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                                    onClick={() => setActiveVariant(variant)}
                                    title={variant.colorName}>
                                    <img src={product.image} style={{ filter: variant.filter }} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium text-gray-500 mt-2 text-center">Selected Color: <span className="text-gray-900 font-bold">{activeVariant.colorName}</span></div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <div className="text-sm font-bold text-[var(--primary-color)] mb-2 uppercase tracking-wider">{product.category}</div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
                        
                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-400">
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star-half fill-current"></div>
                            </div>
                            <span className="text-gray-500 ml-2 font-medium">{product.rating} ({product.reviewsCount} Reviews)</span>
                        </div>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-4xl font-extrabold text-[var(--secondary-color)]">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                            <ul className="space-y-2 text-sm">
                                {product.specs.map((spec, idx) => (
                                    <li key={idx} className="flex"><span className="w-32 text-gray-500">{spec.label}:</span> <span className="font-medium text-gray-900">{spec.value}</span></li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="font-medium text-gray-700">Quantity:</div>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-gray-600">-</button>
                                    <span className="px-4 py-2 font-medium border-x border-gray-300 w-16 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 text-gray-600">+</button>
                                </div>
                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 btn-primary py-3.5 text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    <div className="icon-shopping-cart"></div> Add to Cart
                                </button>
                                <button onClick={handleBuyNow} disabled={!product.inStock} className="flex-1 bg-[var(--secondary-color)] text-white rounded-md py-3.5 text-lg font-medium hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    Buy Now
                                </button>
                                <button className="p-3.5 border-2 border-gray-200 text-gray-500 rounded-md hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors flex items-center justify-center bg-white" title="Add to Wishlist">
                                    <div className="icon-heart text-xl"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod.id} product={prod} view="grid" onAddToCart={handleRelatedAddToCart} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {toast && (
                <div className="fixed bottom-6 right-6 bg-[var(--secondary-color)] text-white text-sm px-5 py-3 rounded-lg shadow-xl z-50">
                    {toast}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProductApp />);

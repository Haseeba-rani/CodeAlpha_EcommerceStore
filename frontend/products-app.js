function ProductsApp() {
    const [products, setProducts] = React.useState([]);
    const [pagination, setPagination] = React.useState({ totalPages: 1, currentPage: 1, totalItems: 0 });
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [toast, setToast] = React.useState('');

    const [viewMode, setViewMode] = React.useState('list');
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [sortBy, setSortBy] = React.useState('featured');
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 6;

    const categories = ['All', 'Electronics', 'Accessories', 'Clothing', 'Home', 'Photography'];

    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setErrorMsg('');

        Products.list({
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            sort: sortBy,
            page: currentPage,
            limit: itemsPerPage,
        })
            .then((res) => {
                if (cancelled) return;
                setProducts(res.data.items);
                setPagination(res.data.pagination);
            })
            .catch((err) => {
                if (cancelled) return;
                setErrorMsg(err.message || 'Failed to load products.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [selectedCategory, sortBy, currentPage]);

    React.useEffect(() => {
        if (!toast) return;
        const timeout = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timeout);
    }, [toast]);

    const handleAddToCart = (product) => {
        Cart.addItem(product.id, 1)
            .then(() => {
                notifyCartUpdated();
                setToast(`Added "${product.title}" to cart`);
            })
            .catch((err) => {
                if (err.status === 401) {
                    window.location.href = 'login.html';
                } else {
                    setToast(err.message || 'Could not add item to cart.');
                }
            });
    };

    const totalPages = pagination.totalPages || 1;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 flex-grow w-full">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                        
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="category"
                                            checked={selectedCategory === cat}
                                            onChange={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                            className="rounded text-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                                        />
                                        <span className="ml-2 text-sm text-gray-600">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                            <input type="range" className="w-full text-[var(--primary-color)]" min="0" max="1000" />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>$0</span>
                                <span>$1000+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-grow">
                    <div className="mb-4">
                        <a href="index.html" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                            <div className="icon-arrow-left mr-1"></div> Back to Home
                        </a>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">All Products {selectedCategory !== 'All' && <span className="text-lg text-gray-500">({selectedCategory})</span>}</h1>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--primary-color)]' : 'text-gray-500 hover:text-gray-900'}`} title="Grid View">
                                    <div className="icon-layout-grid"></div>
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[var(--primary-color)]' : 'text-gray-500 hover:text-gray-900'}`} title="List View">
                                    <div className="icon-list"></div>
                                </button>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-[var(--primary-color)] w-full sm:w-auto"
                            >
                                <option value="featured">Sort by: Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {errorMsg}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-24 text-center text-gray-400">Loading products...</div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                            {products.length > 0 ? products.map(product => (
                                <ProductCard key={product.id} product={product} view={viewMode} onAddToCart={handleAddToCart} />
                            )) : (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    No products found in this category.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 border border-gray-300 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                >
                                    &larr;
                                </button>
                                
                                {Array.from({length: totalPages}).map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 border border-gray-300 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                >
                                    &rarr;
                                </button>
                            </nav>
                        </div>
                    )}
                </main>
            </div>
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
root.render(<ProductsApp />);

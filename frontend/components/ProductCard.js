function ProductCard({ product, view = 'grid', onAddToCart }) {
    const variants = product.variants && product.variants.length > 0 
        ? product.variants 
        : [{ filter: 'none' }];

    const [activeVariant, setActiveVariant] = React.useState(variants[0]);

    const goToProduct = () => {
        window.location.href = `product.html?id=${product.id}`;
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (onAddToCart) onAddToCart(product);
    };
    
    if (view === 'list') {
        return (
            <div onClick={goToProduct} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row group cursor-pointer" data-name="product-card" data-file="components/ProductCard.js">
                {/* Left: Gallery (Main image + Thumbnails) */}
                <div className="w-full md:w-2/5 p-4 flex flex-col gap-3 flex-shrink-0 bg-gray-50/50">
                    <div className="relative h-64 md:h-72 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
                        <img src={product.image} style={{ filter: activeVariant.filter }} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        {product.badge && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--accent-color)] to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                                {product.badge}
                            </div>
                        )}
                    </div>
                    {/* Mini Pictures / Thumbnails */}
                    <div className="flex gap-2 h-16 sm:h-20">
                        {variants.length > 1 && variants.map((variant, idx) => (
                            <div key={idx} 
                                className={`flex-1 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${activeVariant === variant ? 'border-[var(--primary-color)] shadow-md scale-105' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                                onClick={(e) => { e.stopPropagation(); setActiveVariant(variant); }}>
                                <img src={product.image} style={{ filter: variant.filter }} className="w-full h-full object-cover" alt="Color Variant" />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Right: Detailed Info */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-center relative">
                    <div className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors z-10">
                        <div className="icon-heart text-xl"></div>
                    </div>

                    <div className="text-sm font-bold text-[var(--primary-color)] mb-2 uppercase tracking-wider">{product.category}</div>
                    <h3 className="font-bold text-gray-900 mb-3 text-2xl leading-tight pr-10">{product.title}</h3>
                    
                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 text-base drop-shadow-sm">
                            <div className="icon-star fill-current"></div>
                            <div className="icon-star fill-current"></div>
                            <div className="icon-star fill-current"></div>
                            <div className="icon-star fill-current"></div>
                            <div className="icon-star-half fill-current"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-500 ml-2">({product.rating} reviews)</span>
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-3">
                        Experience premium quality with our {product.title}. Designed for both style and functionality, this is a must-have addition to your collection. Discover the perfect blend of modern aesthetics and durable materials.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-auto">
                        <span className="font-extrabold text-3xl text-[var(--secondary-color)]">${product.price.toFixed(2)}</span>
                        
                        <div className="flex-grow"></div>
                        
                        <button onClick={handleAddToCart} className="btn-primary shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 transition-all py-3 px-6 rounded-xl">
                            <div className="icon-shopping-cart"></div> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View Implementation
    return (
        <div onClick={goToProduct} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group relative flex flex-col h-full cursor-pointer" data-name="product-card" data-file="components/ProductCard.js">
            <div className="relative h-64 overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={product.image} style={{ filter: activeVariant.filter }} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <button onClick={handleAddToCart} className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-2.5 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto hover:bg-[var(--primary-color)] hover:text-white flex items-center shadow-xl">
                        <div className="icon-shopping-cart mr-2"></div> Quick Add
                    </button>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white cursor-pointer transition-colors z-10">
                    <div className="icon-heart"></div>
                </div>

                {product.badge && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--accent-color)] to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                        {product.badge}
                    </div>
                )}

                {/* Mini Thumbnails Overlay on hover for Grid View */}
                {variants.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-auto">
                        {variants.slice(0,4).map((variant, idx) => (
                            <div key={idx} 
                                className={`w-10 h-10 rounded-md overflow-hidden cursor-pointer border-2 shadow-sm ${activeVariant === variant ? 'border-[var(--primary-color)]' : 'border-white hover:border-gray-300'}`}
                                onMouseEnter={() => setActiveVariant(variant)}>
                                <img src={product.image} style={{ filter: variant.filter }} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs font-bold text-[var(--primary-color)] mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight flex-grow" title={product.title}>{product.title}</h3>
                
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 text-sm drop-shadow-sm">
                        <div className="icon-star fill-current"></div>
                        <div className="icon-star fill-current"></div>
                        <div className="icon-star fill-current"></div>
                        <div className="icon-star fill-current"></div>
                        <div className="icon-star-half fill-current"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 ml-2">({product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-extrabold text-2xl text-[var(--secondary-color)]">${product.price.toFixed(2)}</span>
                    <button onClick={handleAddToCart} className="bg-indigo-50 text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group-hover:rotate-12" title="Add to Cart">
                        <div className="icon-plus text-xl"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
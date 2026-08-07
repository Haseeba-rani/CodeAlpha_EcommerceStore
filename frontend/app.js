class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Typewriter({ words, delay = 100 }) {
    const [text, setText] = React.useState('');
    const [wordIndex, setWordIndex] = React.useState(0);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        const currentWord = words[wordIndex];
        const timeout = setTimeout(() => {
            if (isDeleting) {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            } else {
                setText(currentWord.substring(0, text.length + 1));
                if (text.length === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            }
        }, isDeleting ? delay / 2 : delay);
        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, words, delay]);

    return (
        <span className="text-[var(--accent-color)] border-r-4 border-[var(--accent-color)] pr-1 animate-pulse">
            {text}
        </span>
    );
}

function App() {
  try {
    const [featuredProducts, setFeaturedProducts] = React.useState([]);
    const [loadingProducts, setLoadingProducts] = React.useState(true);
    const [toast, setToast] = React.useState('');

    React.useEffect(() => {
        Products.list({ sort: 'featured', limit: 4 })
            .then((res) => setFeaturedProducts(res.data.items))
            .catch((err) => console.error('Failed to load featured products:', err))
            .finally(() => setLoadingProducts(false));
    }, []);

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

    return (
      <div className="flex flex-col min-h-screen font-sans" data-name="app" data-file="app.js">
        <Navbar />
        
        <main className="flex-grow">
            {/* Creative Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
                {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 z-10 text-center lg:text-left">
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--secondary-color)] mb-6 leading-tight tracking-tight">
                            Discover Your <br />
                            <Typewriter words={['Next Favorite Thing.', 'Everyday Essentials.', 'Trendy Accessories.', 'Dream Lifestyle.']} />
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
                            Welcome to Hapyshop! Explore a curated collection of premium products designed to elevate your everyday life.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                            <a href="products.html" className="btn-primary shadow-lg shadow-indigo-500/30 text-lg px-8 py-3 rounded-full flex items-center justify-center transform hover:-translate-y-1 transition-all">
                                Shop Collection <div className="icon-arrow-right ml-2"></div>
                            </a>
                            <a href="#featured" className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center">
                                View Offers
                            </a>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-16 lg:mt-10 relative">
                        <div className="relative transform rotate-2 hover:rotate-0 transition-all duration-500 group z-20 mx-4 lg:mx-0">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
                                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Shopping" className="object-cover h-[450px] w-full group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            
                            {/* Decorative Floating Photos */}
                            <div className="absolute -bottom-8 -left-4 lg:-left-10 rounded-2xl border-4 border-white overflow-hidden shadow-2xl animate-bounce z-20 bg-white" style={{animationDuration: '4s'}}>
                                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80" alt="Fashion Accessories" className="w-32 h-32 lg:w-40 lg:h-40 object-cover" />
                            </div>
                            <div className="absolute -top-8 -right-4 lg:-right-8 rounded-2xl border-4 border-white overflow-hidden shadow-2xl animate-pulse z-0 bg-white" style={{animationDuration: '5s'}}>
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="Watch" className="w-24 h-24 lg:w-32 lg:h-32 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-100 pb-4">
                    <div>
                        <span className="text-[var(--accent-color)] font-bold tracking-wider uppercase text-sm">Curated For You</span>
                        <h2 className="text-3xl font-bold text-[var(--secondary-color)] mt-1">Trending Now</h2>
                    </div>
                    <a href="products.html" className="text-[var(--primary-color)] hover:text-indigo-700 font-medium group flex items-center mt-4 md:mt-0">
                        View All Products <div className="icon-arrow-right ml-1 transform group-hover:translate-x-1 transition-transform"></div>
                    </a>
                </div>
                {loadingProducts ? (
                    <div className="py-16 text-center text-gray-400">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                )}
            </div>
        </main>

        <Footer />

        {toast && (
            <div className="fixed bottom-6 right-6 bg-[var(--secondary-color)] text-white text-sm px-5 py-3 rounded-lg shadow-xl z-50">
                {toast}
            </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

function Navbar() {
    const [cartCount, setCartCount] = React.useState(0);
    const [currentUser, setCurrentUser] = React.useState(null);

    const refreshCartCount = () => {
        // Cart count — safe to call even when logged out; Cart.get() will
        // simply fail silently (401) and we just leave the count at 0.
        Cart.get()
            .then((res) => {
                const count = (res.data.items || []).reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            })
            .catch(() => setCartCount(0));
    };

    React.useEffect(() => {
        // Firebase resolves the signed-in/out state asynchronously on page
        // load — we wait for that before deciding whether to fetch the
        // profile/cart, so we don't flash a logged-out state incorrectly.
        const unsubscribe = FirebaseAuth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                Auth.getCurrentUser().then(setCurrentUser);
                refreshCartCount();
            } else {
                setCurrentUser(null);
                setCartCount(0);
            }
        });

        // Refresh the badge instantly when a cart mutation happens elsewhere
        // on the same page (e.g. clicking "Add to Cart" on the products page).
        window.addEventListener('cart-updated', refreshCartCount);
        return () => {
            unsubscribe();
            window.removeEventListener('cart-updated', refreshCartCount);
        };
    }, []);

    const handleUserIconClick = (e) => {
        if (currentUser) {
            e.preventDefault();
            Auth.logout().finally(() => {
                window.location.href = 'index.html';
            });
        }
        // If not logged in, default <a href="login.html"> behavior applies.
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50" data-name="navbar" data-file="components/Navbar.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => window.location.href='index.html'}>
                        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white p-2 rounded-xl mr-2 transform group-hover:rotate-12 transition-transform shadow-md">
                            <div className="icon-shopping-bag text-xl"></div>
                        </div>
                        <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)]">Hapyshop</span>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex space-x-3">
                        <a href="index.html" className="flex items-center px-5 py-2.5 bg-indigo-50 text-[var(--primary-color)] rounded-xl hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md transition-all duration-300 font-medium group">
                            <div className="icon-house mr-2 text-lg group-hover:scale-110 transition-transform"></div> Home
                        </a>
                        <a href="products.html" className="flex items-center px-5 py-2.5 bg-pink-50 text-[var(--accent-color)] rounded-xl hover:bg-[var(--accent-color)] hover:text-white hover:shadow-md transition-all duration-300 font-medium group">
                            <div className="icon-package mr-2 text-lg group-hover:scale-110 transition-transform"></div> Products
                        </a>
                        <a href="cart.html" className="flex items-center px-5 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white hover:shadow-md transition-all duration-300 font-medium group">
                            <div className="icon-shopping-cart mr-2 text-lg group-hover:scale-110 transition-transform"></div> Cart
                        </a>
                        {currentUser && (
                            <a href="orders.html" className="flex items-center px-5 py-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white hover:shadow-md transition-all duration-300 font-medium group">
                                <div className="icon-receipt mr-2 text-lg group-hover:scale-110 transition-transform"></div> My Orders
                            </a>
                        )}
                        {currentUser && currentUser.role === 'admin' && (
                            <a href="admin.html" className="flex items-center px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:shadow-md transition-all duration-300 font-medium group">
                                <div className="icon-layout-dashboard mr-2 text-lg group-hover:scale-110 transition-transform"></div> Admin
                            </a>
                        )}
                    </div>

                    {/* Search & Icons */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex relative">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[var(--primary-color)]"
                            />
                            <div className="icon-search absolute left-2.5 top-2 text-gray-400 text-sm"></div>
                        </div>
                        <a href="cart.html" className="text-gray-600 hover:text-[var(--primary-color)] relative">
                            <div className="icon-shopping-cart text-xl"></div>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--accent-color)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>
                            )}
                        </a>
                        <a href="login.html" onClick={handleUserIconClick} title={currentUser ? `Logout (${currentUser.name})` : 'Login'} className="text-gray-600 hover:text-[var(--primary-color)]">
                            <div className="icon-user text-xl"></div>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
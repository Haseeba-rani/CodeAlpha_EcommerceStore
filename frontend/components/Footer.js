function Footer() {
    return (
        <footer className="bg-[var(--secondary-color)] text-gray-300 py-12" data-name="footer" data-file="components/Footer.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white p-1.5 rounded-lg mr-2">
                            <div className="icon-shopping-bag text-xl"></div>
                        </div>
                        <span className="font-bold text-2xl text-white tracking-wide">Hapyshop</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Your one-stop destination for everything you need. Creative, modern, and affordable.</p>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="index.html" className="hover:text-white">Home</a></li>
                        <li><a href="products.html" className="hover:text-white">Products</a></li>
                        <li><a href="cart.html" className="hover:text-white">Cart</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Customer Service</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
                        <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                    <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers and updates.</p>
                    <div className="flex">
                        <input type="email" placeholder="Email address" className="px-3 py-2 text-gray-900 rounded-l-md w-full focus:outline-none"/>
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-r-md hover:bg-blue-600">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-700 text-sm text-center text-gray-400">
                &copy; 2026 Hapyshop. All rights reserved. CodeAlpha Internship Project.
            </div>
        </footer>
    );
}
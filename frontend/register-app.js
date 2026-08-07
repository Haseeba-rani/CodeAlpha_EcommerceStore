function RegisterApp() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        Auth.register({ name, email, password, confirmPassword })
            .then(() => {
                // Firebase also signs the user in immediately after signup,
                // so we can send them straight to the home page.
                window.location.href = 'index.html';
            })
            .catch((err) => {
                const fieldErrors = (err.errors || []).map((e) => e.message).join(' ');
                setErrorMsg(fieldErrors || err.message || 'Registration failed. Please try again.');
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-4">
                            <div className="icon-user-plus text-2xl text-[var(--accent-color)]"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
                        <p className="text-sm text-gray-500 mt-2">Join Hapyshop today</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        <div className="flex items-center mt-2">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                                I agree to the <a href="#" className="text-[var(--primary-color)] hover:underline">Terms & Conditions</a>
                            </label>
                        </div>

                        <button type="submit" disabled={submitting} className="w-full btn-primary py-2.5 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                            {submitting ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
                        Already have an account? <a href="login.html" className="font-medium text-[var(--primary-color)] hover:text-blue-500">Sign in here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RegisterApp />);

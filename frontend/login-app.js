function LoginApp() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [infoMsg, setInfoMsg] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        setInfoMsg('');
        setSubmitting(true);

        Auth.login({ email, password })
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((err) => {
                setErrorMsg(err.message || 'Login failed. Please try again.');
            })
            .finally(() => setSubmitting(false));
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setErrorMsg('');
        setInfoMsg('');

        if (!email) {
            setErrorMsg('Enter your email address above first, then click "Forgot password?"');
            return;
        }

        firebaseAuth.sendPasswordResetEmail(email)
            .then(() => setInfoMsg(`Password reset email sent to ${email}. Check your inbox.`))
            .catch((err) => setErrorMsg(mapFirebaseAuthError(err)));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                            <div className="icon-user text-2xl text-[var(--primary-color)]"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                        <p className="text-sm text-gray-500 mt-2">Please sign in to your account</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
                            {errorMsg}
                        </div>
                    )}

                    {infoMsg && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-4 py-3">
                            {infoMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" onClick={handleForgotPassword} className="font-medium text-[var(--primary-color)] hover:text-blue-500">Forgot password?</a>
                            </div>
                        </div>
                        <button type="submit" disabled={submitting} className="w-full btn-primary py-2.5 disabled:opacity-60 disabled:cursor-not-allowed">
                            {submitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account? <a href="register.html" className="font-medium text-[var(--primary-color)] hover:text-blue-500">Register here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);

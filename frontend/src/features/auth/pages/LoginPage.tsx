import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../services/auth.api.service";
import { useAuthDispatch } from "../store/hooks";
import { setUserData } from "../store/user.slice";
import { BRAND_LOGO_SRC, BRAND_NAME } from "../../../constants/brand";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setisLoading] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useAuthDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            setisLoading(true);
            const res = await loginService(email, password);
            dispatch(setUserData(res.user));
            queryClient.setQueryData(["auth", "me"], res.user);
            navigate("/", { replace: true });
        } catch {
            setError("Invalid email or password");
        } finally {
            setisLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors duration-300 dark:bg-[#07070c]">
            <div className="pointer-events-none absolute -top-32 left-1/2 hidden h-150 w-150 -translate-x-1/2 rounded-full bg-white/5 blur-[120px] dark:block " />
            <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8 dark:border-white/8 dark:bg-white/3 dark:shadow-black/40">
                <img
                    src={BRAND_LOGO_SRC}
                    alt={BRAND_NAME}
                    className="mx-auto mb-5 h-14 w-14 rounded-xl object-contain"
                />
                <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">Welcome to {BRAND_NAME}</h2>
                <p className="mb-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Sign in to continue to your workspace.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-left text-xs font-medium text-slate-600 dark:text-slate-400">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-left text-xs font-medium text-slate-600 dark:text-slate-400">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </div>
                    {error && (
                        <p className="text-center text-xs font-medium text-red-500">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-slate-800 disabled:opacity-70 dark:border-transparent dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
                <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    No account?{" "}
                    <Link to="/register" className="font-semibold text-slate-800 hover:underline dark:text-slate-200">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

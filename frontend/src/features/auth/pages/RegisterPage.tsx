import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerService } from "../services/auth.api.service";
import { useAuthDispatch } from "../store/hooks";
import { setUserData } from "../store/user.slice";
import { BRAND_LOGO_SRC, BRAND_NAME } from "../../../constants/brand";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setisLoading] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useAuthDispatch();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            setisLoading(true);
            const res = await registerService(name, email, password);
            dispatch(setUserData(res.user));
            queryClient.setQueryData(["auth", "me"], res.user);
            navigate("/", { replace: true });
        } catch (err: unknown) {
            const message =
                err && typeof err === "object" && "response" in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : null;
            setError(message || "Could not create account");
        } finally {
            setisLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors duration-300 dark:bg-[#07070c]">
            <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8 dark:border-white/8 dark:bg-white/3 dark:shadow-black/40">
                <img
                    src={BRAND_LOGO_SRC}
                    alt={BRAND_NAME}
                    className="mx-auto mb-5 h-14 w-14 rounded-xl object-contain"
                />
                <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">Create account</h2>
                <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Register to start building with {BRAND_NAME}.
                </p>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-left text-xs font-medium text-slate-600 dark:text-slate-400">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </div>
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
                            minLength={8}
                            autoComplete="new-password"
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
                        disabled={isLoading}
                        className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        {isLoading ? "Creating account…" : "Create account"}
                    </button>
                </form>
                <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-slate-800 hover:underline dark:text-slate-200">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

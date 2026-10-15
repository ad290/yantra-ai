import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react";
import { useAuthDispatch, useAuthSelector } from "../../../features/auth/store/hooks";
import { useCreateOrderMutation, useVerifyOrderMutation } from "../tanstack-query";
import type { CreateOrderResponseType } from "../types";
import { setUserData } from "../../auth/store/user.slice";
import { BRAND_LOGO_SRC, BRAND_NAME } from "../../../constants/brand";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayCheckoutOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: { name?: string; email?: string };
    handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => void;
    theme: { color: string };
};

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
    }
}

const loadRazorpayScript = () => new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
        resolve();
        return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), { once: true });
        return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
});
const plans = [
    {
        key: "free",
        name: "Free",
        description: "For trying out the AI IDE",
        price: 0,
        period: "month",
        credits: 100,
        popular: false,
        icon: Zap,
        features: [
            "50 AI credits per month",
            "AI Code Generation",
            "Project Editor",
            "HTML/CSS/JS Preview",
            "React Preview",
            "Basic Project Management",
        ],
        button: "Current Plan",
        current: true
    },
    {
        key: "pro",
        name: "Pro",
        description: "For advanced users",
        price: 299,
        period: "month",
        popular: true,
        credits: 500,
        icon: Sparkles,
        features: [
            "500 AI credits per month",
            "Unlimited projects",
            "Every thing is accessible",
            "Advanced AI coding",
            "Priority AI Code Generation",
            "Larger Projects",
            "Priority Support"
        ],
        button: "Upgrade to Pro",
        current: false
    },
    {
        key: "team",
        name: "Team",
        description: "For teams building products together.",
        price: 799,
        period: "month",
        popular: false,
        credits: 1500,
        icon: Crown,
        features: [
            "1500 AI credits/month",
            "Everything in Pro",
            "Team collaboration",
            "Shared projects",
            "Higher AI limits",
            "Priority processing",
            "Team support",
        ],
        button: "Upgrade to Team",
        current: false
    }
]
const PaymentPage = () => {
    const navigate = useNavigate();
    const { userData } = useAuthSelector((state) => state.user);
    const dispatch = useAuthDispatch();

    const [createOrderMutation, verifyOrderMutation] = [useCreateOrderMutation(), useVerifyOrderMutation()];
    const handlePayment = (plan: typeof plans[number]) => {
        if (plan.key === "free" || plan.current) return;

        createOrderMutation.mutate(plan.key as "pro" | "team", {
            onSuccess: async (data: CreateOrderResponseType) => {
                try {
                    await loadRazorpayScript();
                    const Razorpay = window.Razorpay;
                    if (!Razorpay) throw new Error("Unable to load Razorpay checkout.");
                    const options: RazorpayCheckoutOptions = {
                        amount: data.order.amount,
                        currency: data.order.currency,
                        description: data.order.id,
                        key: data.key_id,
                        name: BRAND_NAME,
                        order_id: data.order.id,
                        prefill: {
                            email: userData?.email,
                            name: userData?.name
                        },
                        theme: {
                            color: "#3b82f6"
                        },
                        handler: (response) => {
                            const data = {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            };
                            verifyOrderMutation.mutate(data, {
                                onSuccess: (data) => {
                                    dispatch(setUserData({ ...userData!, credits: data.credits! }))
                                }
                            });
                        }
                    }
                    const razorpay = new Razorpay(options);
                    razorpay.open();
                } catch (error) {
                    console.log("Unable to start Razorpay Checkout: ", error)
                }
            }
        });
    }
    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 dark:bg-[#07070c] dark:text-white">
            <div className="pointer-events-none fixed left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[140px]  " />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-12 flex items-center justify-between">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white.8 dark:bg-white/3 dark:text-slate-300 dark:hover:bg-white/6" onClick={() => navigate(-1)}>
                        <ArrowLeft /> Back
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} className="h-6 w-6 object-contain" />
                        {BRAND_NAME}
                    </div>
                </div>
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                        <Sparkles /> Simple pricing for developers
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Build More
                        <span className="text-indigo-500">{" "} Ship fater.</span>
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Choose a plan that gives you the AI credits you need to build and iterate faster.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {/* card list */}
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -4 }}
                                className={`relative flex flex-col rounded-2xl border p-6 transition ${plan.popular ? "border-indigo-500/40 bg-white shadow-xl shadow-indigo-500/10 dark:bg-white/5" : "border-slate-200 bg-white/70 dark:border-white/8 dark:bg-white/2.5"} `}
                            >
                                {plan.popular && (
                                    <div className="-top-3 absolute left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white">
                                    <Icon size={16} />
                                </div>
                                <h1 className="text-lg font-bold">{plan.name}</h1>
                                <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">{plan.description}</p>
                                <div className="mt-5 flex items-end gap-1">
                                    <span className="text-3xl font-bold tracking-tight">₹{plan.price}</span>
                                    <span className="mb-1 text-xs text-slate-400">/{plan.period}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:bg-white/4 dark:text-slate-200">
                                    <Zap size={14} className="text-indigo-500" fill="currentColor" />
                                    {plan.credits} AI Credits
                                </div>
                                <button
                                    onClick={() => handlePayment(plan)}
                                    disabled={plan.current || createOrderMutation.isPending}
                                    className={`mt-5 w-full rounded-lg py-2.5 text-xs font-semibold transition ${plan.current ? "cursor-default bg-slate-100 text-slate-400 dark:bg-white/6 dark:text-slate-500" : plan.popular ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500" : "bg-slate-900 text-white hover:opacity-90 dark:bg-white dark:text-slate-900"} `}>
                                    {createOrderMutation.isPending ? "Processing..." : plan.button}
                                </button>
                                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/7">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Includes</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
                <div className="mt-10 text-center text-sm text-slate-400 dark:text-slate-600">
                    Credits reset every month. Unused credits do not roll over.
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
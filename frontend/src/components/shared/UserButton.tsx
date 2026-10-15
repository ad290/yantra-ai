import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSelector, useAuthDispatch } from '../../features/auth/store/hooks';
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { clearUserData } from '../../features/auth/store/user.slice';
import { logoutService } from '../../features/auth/services/auth.api.service';
import { queryClient } from '../../app/queryClient';
const UserButton = () => {
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();
    const { userData } = useAuthSelector((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const name = userData?.name || "Guest";
    const initials = name.split(" ").map((word) => word.charAt(0)).join("").slice(0, 2).toUpperCase();
    const handleLogout = async () => {
        await logoutService().then(() => {
            // remove user from cache 
            queryClient.setQueryData(['auth', 'me'], null);
            dispatch(clearUserData());
            setIsMenuOpen(false);
            navigate('/login', { replace: true });
        });
    }
    return (
        <>
            <button onClick={() => setIsMenuOpen(prev => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/6 transition-colors duration-150"
            >
                {/* User icon */}
                <div className="size-8 rounded-full bg-linear-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
                    {userData?.avatar ? (
                        <img src={userData?.avatar} alt='' />
                    ) : (
                        <span className="text-xs font-semibold text-white dark:text-slate-900">
                            {initials}
                        </span>
                    )}
                </div>
                <span className='text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:inline'>{name}</span>
                <FiChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform duration-150 ${isMenuOpen ? "rotate-180" : ""
                    }`} />
            </button>
            {isMenuOpen && (
                <div className='absolute right-0 mt-2 min-w-52 bg-white/95 dark:bg-[#12121c]/95 backdrop-blur-xl border border-slate-200 dark:border-white/8 rounded-xl shadow-xl p-1.5 z-50 animate-[fadeIn_0.15s_ease-out]'>
                    <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/6 px-3.5 py-2.5  ">
                        {/* User icon */}
                        <div className="size-8 rounded-full bg-linear-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
                            {userData?.avatar ? (
                                <img src={userData?.avatar} alt='' />
                            ) : (
                                <span className="text-xs font-semibold text-white dark:text-slate-900">
                                    {initials}
                                </span>
                            )}
                        </div>
                        {/* User info */}
                        <div className='min-w-0'>
                            <p className='text-sm font-medium text-slate-800 dark:text-slate-200 truncate'>{name}</p>
                            <p className='text-xs text-slate-400 dark:text-shadow-taupe-500 truncate'>{userData?.email}</p>
                        </div>

                    </div>
                    {/* Logout buton */}
                    <button className='w-full mt-1 flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 rounded-xl dark:hover:bg-red-500/10 transition-colors duration-150' onClick={handleLogout}>
                        <FiLogOut size={15} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </>
    )
}

export default UserButton
import ThemeToggle from "./ThemeToggle";
import UserButton from "./UserButton";
import BrandLogo from "./BrandLogo";
const Navbar = () => {
  return (
    <div className='w-full h-16 bg-white/70 dark:bg-white/3 backdrop-blur-xl border-b border-slate-200 dark:border-white/70 flex items-center px-6 gap-6 font-sans transition-colors duration-300 '>
      {/* left */}
      <div className="shrink-0">
        <BrandLogo textClassName="text-slate-900 dark:text-white font-bold text-lg tracking-tight" />
      </div>
      <div className="flex-1" />
      {/* right */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle/>
        <div className="relative ml-1">
          <UserButton/>
        </div>
      </div>
    </div>
  )
}

export default Navbar
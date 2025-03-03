import { mont } from "@/app/ui/fonts";
import Logo from "@/app/ui/images/Logo";

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full h-16 fixed top-0 left-0 flex items-center justify-between px-6 shadow-lg">
      <h1 className={`${mont.className} text-white text-lg md:text-xl font-bold`}>
        InvestorBriefs
      </h1>
      <Logo />
    </div>
  );
}
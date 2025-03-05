import { mont } from "@/app/ui/fonts";
import Logo from "@/app/ui/images/Logo";
import Link from "next/link"; 

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full h-16 fixed top-0 left-0 flex items-center justify-between px-6 shadow-lg">
      <Link href="/" passHref>
        <h1 className={`${mont.className} text-white text-lg md:text-xl font-bold cursor-pointer hover:text-sky-200 hover:underline hover:scale-105`}>
          InvestorBriefs
        </h1>
      </Link>
      <Logo />
    </div>
  );
}

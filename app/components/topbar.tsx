import { mont } from "@/app/ui/fonts";
import Logo from "@/app/ui/images/Logo";
import Link from "next/link"; 

export function TopBar() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 w-full h-16 fixed top-0 left-0 flex items-center px-6 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-x-3">
        <Logo /> 
        <h1 className={`defaulttext text-lg md:text-2xl`}>
          InvestorBriefs
        </h1>
      </div>
    </div>
  );
}

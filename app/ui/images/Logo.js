import Image from "next/image";
import Applogo from "@/app/ui/images/outlined.png"; // Import the image properly
import { mont } from "@/app/ui/fonts";

export default function Logo() {
  return (
    <div className={`${mont.className} flex flex-row items-center leading-none text-white`}>
      {/* Corrected Image Usage */}
      <Image src={Applogo} alt="App Logo" width={48} height={48} className="h-12 w-12" />
    </div>
  );
}

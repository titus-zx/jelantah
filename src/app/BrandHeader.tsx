import Image from "next/image";
import { BRAND_LOGO, BRAND_NAME, BRAND_TAGLINE } from "@/brand";

export default function BrandHeader() {
  return (
    <div className="flex flex-col items-center justify-center mb-2 mt-3 ">
      <Image src={BRAND_LOGO} alt="logo" width={70} height={70} priority className="animate-bounce-slow mb-1 rounded-full border-2 border-amber-200 bg-amber-50 p-1 shadow-sm" />
      <div className="text-amber-700 font-extrabold text-xl mt-1 drop-shadow-sm leading-tight">
        {BRAND_NAME}
      </div>
      <div className="text-amber-400 text-sm font-medium italic text-center mb-2">{BRAND_TAGLINE}</div>
    </div>
  );
}

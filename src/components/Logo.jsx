import Image from "next/image";
import logo from "@/images/logo.svg"

export function Logo(props) {
    return (
        <div className="flex items-center ml-5">
            <Image src={logo} alt="logo" className="w-14 h-14 object-contain"/>
            <h6 className="text-xl font-semibold text-black dark:text-white">RedMaster</h6>
        </div>
    )
}

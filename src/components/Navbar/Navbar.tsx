"use client";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import profileImage from "@/assets/profile.jpg";
import Link from "next/link";
import { useGetMeQuery } from "@/redux/api/auth";

export default function Navbar() {
  const { data } = useGetMeQuery("");
  return (
    <nav
      className={`mx-auto border-b border-[#b9b9b9] py-3 flex px-5 md:px-[40px] fixed bg-white z-[9] w-full`}
    >
      <div className="flex justify-between w-full items-center">
        <div className="hidden md:block relative  flex-1">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="Logo"
              className="object-contain h-[50px] w-[50px]"
              priority
            />
          </Link>
        </div>
        <div></div>

        <div className="flex items-center gap-3">
          <Image
            src={profileImage}
            alt="Logo"
            className="h-[45px] w-[45px] rounded-full border-2 border-primaryColor"
            priority
          />
          <div>
            <h1 className="text-[#171717] text-base font-semibold leading-normal">
              {data?.data?.name || "Admin"}
            </h1>
            <h1 className="text-[#747474] text-base font-normal leading-normal text-sm">
              {data?.data?.role || "Admin"}
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
}

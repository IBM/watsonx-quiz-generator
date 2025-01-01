import React from "react";
import Image from "next/image";
import logo from "../../public/logo.png";

function Header() {
  return (
    <div className="flex p-5 flex-wrap items-center  text-white font-bold">
      <Image src={logo} alt="logo" width={160} height={80} className="p-4" />
      <div className="pl-5 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
        AI Based Quiz Generator
      </div>
    </div>
  );
}

export default Header;

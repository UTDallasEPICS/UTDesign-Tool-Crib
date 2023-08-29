import MainNav from "./MainNav";
import logo from '../../src/Styles/logo.svg'
import Image from "next/image";

export default function Header({title}) {
    return (
        <div className="header">
        <div className="title">
          <Image src={logo} alt="" />
          <h1>{title}</h1>
        </div>
        <MainNav />
      </div>
    )
}
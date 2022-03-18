import React from "react";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 px-2 shadow-lg">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Product Market Clone Project
      </a>
      <span className="text-white">{account}</span>
    </nav>
  );
};

export default Navbar;

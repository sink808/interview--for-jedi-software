import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

const SCROLL_DELAY = 300;

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleMenuRef = useRef<HTMLButtonElement | null>(null);

  const visibleClassName = "translate-y-0";
  const hiddenClassName = "-translate-y-full";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        setIsVisible(true);
      }, SCROLL_DELAY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isCollapseMenu =
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        (!toggleMenuRef.current ||
          !toggleMenuRef.current.contains(event.target as Node)); // toggle 另外處理

      if (isCollapseMenu) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 text-2xl font-bold text-center bg-white w-full drop-shadow-xl transition ease-in-out duration-300 ${isVisible ? visibleClassName : hiddenClassName}`}
    >
      <div className="p-4">
        <span>Jedi Software</span>
        <button
          ref={toggleMenuRef}
          onClick={toggleMenu}
          className="absolute left-6"
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="text-lg bg-gray-100 p-4 ">
          <Link href="/" className="px-8">
            Home
          </Link>
          <Link href="/find-the-cheese" className="px-8">
            Find the Cheese
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

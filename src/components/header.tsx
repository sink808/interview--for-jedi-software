import React, { useEffect, useState, useRef } from 'react';

const SCROLL_DELAY = 300

const Header: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const visibleClassName =  'translate-y-0'
  const hiddenClassName =  '-translate-y-full'

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        setVisible(true);
      }, SCROLL_DELAY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <header className={`fixed top-0 z-50 text-2xl font-bold text-center p-4 bg-white w-full drop-shadow transition ease-in-out duration-300 ${visible ? visibleClassName : hiddenClassName}` }>
      Jedi Software
    </header>
  );
};

export default Header;
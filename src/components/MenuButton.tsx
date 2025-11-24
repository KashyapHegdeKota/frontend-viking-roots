import { useEffect } from 'react';

interface MenuButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuButton = ({ isOpen, onClose }: MenuButtonProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-menu-backdrop" onClick={onClose} />
      <div className="mobile-menu">
        

        <nav>
          <ul className="mobile-menu-nav">
            <li><a href="/" onClick={onClose}>Home</a></li>
            <li><a href="/about" onClick={onClose}>About</a></li>
            <li><a href="/gimli-saga" onClick={onClose}>Gimli Saga</a></li>
            <li><a href="/overview" onClick={onClose}>Overview</a></li>
            <li><a href="/partner" onClick={onClose}>Partner</a></li>
            <li><a href="/careers" onClick={onClose}>Careers</a></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MenuButton;

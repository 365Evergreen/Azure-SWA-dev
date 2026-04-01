import { ChevronDown24Regular } from '@fluentui/react-icons';
import './Header.css';
import { useState, useEffect } from 'react';
import { useGlobalNav } from '../../lib/useGlobalNav';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const navItems = useGlobalNav();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (url: string) => {
    if (!url) {
      return;
    }
    // If url is absolute, open in new tab; else, use router
    if (/^https?:\/\//.test(url)) {
      window.open(url, '_blank');
    } else {
      navigate(url);
      setMenuOpen(false);
    }
  };

  const handleSubmenuToggle = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <header className={`header-root${scrolled ? ' header-root--scrolled' : ''}`}>
      <div className="header-container">
        <a href="/" className="header-logo-link">
          <img src="https://365evergreendev.com/wp-content/uploads/2026/02/Evergreen_Logo__100px.webp" alt="365 Evergreen Logo" className="header-logo" />
          <h1 className={`header-title${scrolled ? ' header-title--scrolled' : ''}`}>365 Evergreen</h1>
        </a>
        <nav className={`header-nav${menuOpen ? ' header-nav--open' : ''}`}>
          {navItems.length > 0 ? (
            navItems.map((item, idx) => {
              const hasChildren = (item.children?.length ?? 0) > 0;
              const navKey = item.id && item.id !== '' ? item.id : `nav-${idx}`;
              const isOpen = !!openSubmenus[navKey];
              return (
                <div className="header-nav-item" key={navKey}>
                  <a
                    href={item.url}
                    className="header-nav-btn"
                    onClick={e => {
                      e.preventDefault();
                      handleNav(item.uri || item.url);
                    }}
                    
                  >
                    <span className="header-nav-label">{item.label}</span>
                    {hasChildren && (
                      <ChevronDown24Regular
                        className={`header-chevron-icon${isOpen ? ' header-chevron-icon--open' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                  {hasChildren && (
                    <div className={`header-nav-submenu${isOpen ? ' header-nav-submenu--open' : ''}`}>
                      <button
                        type="button"
                        className="header-submenu-toggle"
                        aria-controls={`submenu-${navKey}`}
                        aria-label={isOpen ? `Collapse submenu for ${item.label}` : `Expand submenu for ${item.label}`}
                        onClick={() => handleSubmenuToggle(navKey)}
                      >
                        <span>{isOpen ? 'Hide' : 'Show'} menu</span>
                      </button>
                      <div id={`submenu-${navKey}`} className="header-nav-submenu-list">
                        {item.children?.map((sub, subIdx) => {
                          const subKey = sub.id && sub.id !== '' ? sub.id : `subnav-${idx}-${subIdx}`;
                          return (
                            <a
                              key={subKey}
                              href={sub.url}
                              className="header-nav-submenu-link"
                              onClick={e => {
                                e.preventDefault();
                                handleNav(sub.uri || sub.url);
                              }}
                            >
                              {sub.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <a href="/" className="header-nav-btn">Home</a>
          )}
          <a href="#contact" className="header-contact-btn">Get in touch</a>
        </nav>
        <button
          className="header-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
        </button>
      </div>
    </header>
  );
}

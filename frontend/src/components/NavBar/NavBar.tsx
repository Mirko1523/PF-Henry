import SesionDesplegable from '../SesionDesplegable/SesionDesplegable';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import Cart from '../Cart/Cart';
import { useState, useRef, useEffect } from 'react';
import { setAdminState } from '../../redux/actions/Actions';
import { useDispatch } from 'react-redux';

interface NavBarProps {
    onItemClick: (item: string) => void;
    toggleMenu: () => void;
    showMenu: boolean;
    auth: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onItemClick, toggleMenu, showMenu, auth }) => {
    const [showMenuAuth, setShowMenuAuth] = useState(false);
    const [showMenuAdmin, setShowMenuAdmin] = useState(false);
    const adminMenuRef = useRef<HTMLDivElement>(null);
    const [userData, setUserData] = useState<any>(null);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();


const toggleMenuHandler = () => {
    setMenuOpen((prevMenuOpen) => {
       
        if (prevMenuOpen && showMenuAdmin) {
            setShowMenuAdmin(false);
        }
    
        return !prevMenuOpen;
    });
};


    useEffect(() => {
        const calcularTotalQuantity = () => {
            const cartItems = localStorage.getItem('cart');
            if (cartItems) {
                const parsedCart = JSON.parse(cartItems);
                const total = parsedCart.reduce((accumulator: number, currentItem: any) => {
                    return accumulator + currentItem.quantity;
                }, 0);
                return total;
            } else {
                return 0;
            }
        };
        const handleStorageChange = () => {
            const total = calcularTotalQuantity();
            setTotalQuantity(total);
        };

        const initialTotal = calcularTotalQuantity();
        setTotalQuantity(initialTotal);

        window.addEventListener('cartChange', handleStorageChange);
        

        return () => {
            window.removeEventListener('cartChange', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const getUserData = () => {
            const userDataString = localStorage.getItem('user');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setUserData(userData);
            }
        };

        const reloadComponentWithDelay = () => {
            setTimeout(() => {
                getUserData();
            }, 1000);
        };

        getUserData();
        window.addEventListener('foto', reloadComponentWithDelay);

        return () => {
            window.removeEventListener('foto', reloadComponentWithDelay);
        };
    }, []);

    useEffect(() => {
        if (userData !== null && userData.admin !== undefined) {
            const isAdmin = (dispatch: any, admin: boolean) => {
                dispatch(setAdminState(admin));
            };
            isAdmin(dispatch, userData.admin);
        }
    }, [userData, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
                setShowMenuAdmin(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1239) {
                setMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const toggleMenuAuth = () => {
        setShowMenuAuth(!showMenuAuth);
    };

    const toggleMenuAdmin = () => {
        setShowMenuAdmin(!showMenuAdmin);
    };

    const handleToggleMenu = () => {
        toggleMenu();
    };

    const handleItemClick = (item: string) => {
        onItemClick(item);
        setMenuOpen(false);
    };
    return (
        <div className={styles.navContainer}>
            <div className={styles.leftContainer}>
                <NavLink to="/" className={styles.parrafo}>
                    <div className={styles.parrafo2}>
                        <img src='https://i.ibb.co/QHgqbVv/dmmngmoawnvsfaxcaz6d-transformed.png' className={styles.interlogo} />
                        <p>INTERFOODS</p>
                    </div>
                </NavLink>
                
              {menuOpen && (
    <div className={`${styles.navLinksContainer} ${styles.open}`}>
        <ul className={styles.navList}>
             {userData && userData.admin && (
                <div ref={adminMenuRef} className={showMenuAdmin ? `${styles.containerAdmins} ${styles.containerAdminOpens}` : styles.containerAdmin}>
                    <button onClick={toggleMenuAdmin} className={styles.navLink}>
                        ADMIN
                    </button>
                 {showMenuAdmin && (
  
                       <div className={styles.adminSubMenu}>
                        <li>
                <NavLink to="/admindashboard/crearplato" className={styles.navLinkAdm} onClick={() => handleItemClick('CREAR PLATO')}>
                  Crear Plato
                  
                </NavLink>
                
                </li>
                <br></br>
                <li>
                <NavLink to="/admindashboard/editar-eliminar" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Editar/Eliminar
                </NavLink>
                </li>
                <br></br>
                 <li>
                <NavLink to="/admindashboard/allReviews" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Reviews
                </NavLink>
                </li>
                 <br></br>
                <li>
                 <NavLink to="/admindashboard" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Graphics
                </NavLink>
                </li>
                
              </div>
                        
                    )}
                </div>
            
            )}
            <li className={styles.navListItem}>
                <NavLink to="/NuestrosPlatos" className={styles.navLink} onClick={() => handleItemClick('MENU DE LA SEMANA')}>
                    NUESTROS PLATOS
                </NavLink>
            </li>
            <li className={styles.navListItem}>
                <NavLink to="/Comofunciona" className={styles.navLink} onClick={() => handleItemClick('COMO FUNCIONA')}>
                    COMO FUNCIONA
                </NavLink>
            </li>
            <li className={styles.navListItem}>
                <NavLink to="/QuienesSomos" className={styles.navLink} onClick={() => handleItemClick('FAQ\'S')}>
                    ¿QUIENES SOMOS?
                </NavLink>
            </li>
            <li className={styles.navListItem}>
                <NavLink to="/Faqs" className={styles.navLink} onClick={() => handleItemClick('FAQ\'S')}>
                    FAQ'S
                </NavLink>
            </li> 
        
             
            </ul>
    </div>   
        
)}

</div>
            <div className={styles.navLinksContainer}>
                <ul className={styles.navList}>
                    <li className={styles.navListItem}>
                        <NavLink to="/NuestrosPlatos" className={styles.navLink} onClick={() => handleItemClick('MENU DE LA SEMANA')}>
                            NUESTROS PLATOS
                        </NavLink>
                    </li>
                    <li className={styles.navListItem}>
                        <NavLink to="/Comofunciona" className={styles.navLink} onClick={() => handleItemClick('COMO FUNCIONA')}>
                            COMO FUNCIONA
                        </NavLink>
                    </li>
                    <li className={styles.navListItem}>
                        <NavLink to="/QuienesSomos" className={styles.navLink} onClick={() => handleItemClick('FAQ\'S')}>
                            ¿QUIENES SOMOS?
                        </NavLink>
                    </li>
                    <li className={styles.navListItem}>
                        <NavLink to="/Faqs" className={styles.navLink} onClick={() => handleItemClick('FAQ\'S')}>
                            FAQ'S
                        </NavLink>
                    </li>
                </ul>
                 {userData && userData.admin && (
         <div ref={adminMenuRef} className={showMenuAdmin ? `${styles.containerAdmin} ${styles.containerAdminOpen}` : styles.containerAdmin}>
            <button onClick={toggleMenuAdmin} className={styles.navLink}>
              ADMIN
            </button>
            {showMenuAdmin && (
              <div className={styles.adminSubMenu}>
                <NavLink to="/admindashboard/crearplato" className={styles.navLinkAdm} onClick={() => handleItemClick('CREAR PLATO')}>
                  Crear Plato
                </NavLink>
                <NavLink to="/admindashboard/editar-eliminar" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Editar/Eliminar
                </NavLink>
                <NavLink to="/admindashboard/allReviews" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Reviews
                </NavLink>
                 <NavLink to="/admindashboard" className={styles.navLinkAdm} onClick={() => handleItemClick('EDITAR/ELIMINAR')}>
                  Graphics
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div> 
            <div className={styles.carritonumero}>
                <div className={styles.ConmenuButton}>
                <button className={styles.menuButton} onClick={toggleMenuHandler}>
                    <div className={styles.menuIcon}>
                        {menuOpen ? (
                            <img src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" alt="Cerrar menú"  className= {styles.imageHamburguer} />
                        ) : (
                            <img src="https://img.icons8.com/ios-glyphs/30/000000/menu.png" alt="Abrir menú" />
                        )}
                    </div>
                </button>  
                </div>
                <button onClick={handleToggleMenu} className={styles.navbtn2}>
                    <p className={totalQuantity === 0 ? styles.numero2 : styles.numero}>{totalQuantity}</p>
                    <div className={styles.carritonumero}>
                        <img src={totalQuantity !== 0 ? "https://i.ibb.co/jzrMVBD/carritoop.png" : "https://static.vecteezy.com/system/resources/previews/019/787/018/original/shopping-cart-icon-shopping-basket-on-transparent-background-free-png.png"} className={totalQuantity !== 0 ? styles.navLogo : styles.navLogo2} />
                    </div>
                </button>
                {auth ? (
                    <button onClick={toggleMenuAuth} className={styles.navbtn}>
                        {userData && userData.foto ? (
                            <img src={userData.foto} alt="Logo 3" className={styles.navUser3} />
                        ) : (
                            <img src="https://media-public.canva.com/ZkY4E/MAEuj5ZkY4E/1/t.png" alt="Logo 2" className={styles.navUser2} />
                        )}
                    </button>
                ) : (
                    <NavLink to="/Login" onClick={() => handleItemClick('LOGIN')}>
                        <img src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2019/png/iconmonstr-door-7.png&r=0&g=0&b=0" alt="Logo 2" className={styles.navUser} />
                    </NavLink>
                )}
            </div>
            {showMenuAuth && <SesionDesplegable toggleMenu={toggleMenuAuth} />}
            {showMenu && <Cart toggleMenu={handleToggleMenu} />}
            
        </div>
        
    );
    
};

export default NavBar;



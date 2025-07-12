import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../contexts/CartContext';

const CartIcon = ({ className, iconSize = 'text-xl', showText = false }) => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <Link to="/cart" className={`text-slate-600 hover:text-indigo-600 relative ${className || ''}`}>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faShoppingCart} className={iconSize} />
        {showText && <span className="ml-2">Giỏ hàng</span>}
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon; 
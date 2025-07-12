import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, variant = null) => {
    if (!product._id) {
      toast.error('Sản phẩm không hợp lệ (thiếu ID)! Không thể thêm vào giỏ hàng.');
      return;
    }

    // Ensure we have a valid price
    const productPrice = variant?.salePrice > 0 
      ? variant.salePrice 
      : (variant?.price || product.price || product.minPrice || 0);
    
    const regularPrice = variant?.price || product.price || product.minPrice || 0;

    if (productPrice <= 0) {
      toast.error('Sản phẩm không có giá hợp lệ! Không thể thêm vào giỏ hàng.');
      return;
    }
    
    setCart(currentCart => {
      // Create a cart item with all necessary details
      const cartItem = {
        _id: product._id,
        id: product._id,
        name: product.name,
        price: productPrice,
        regularPrice: regularPrice,
        image: product.mainImage || product.images?.[0],
        quantity: quantity,
        variant: variant ? {
          id: variant._id,
          name: `${variant.color?.name || ''} ${variant.storage || ''}`.trim(),
          color: variant.color,
          storage: variant.storage
        } : null
      };

      const existingItemIndex = currentCart.findIndex(item => 
        item._id === product._id && 
        ((!item.variant && !variant) || 
         (item.variant?.id === variant?._id))
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success('Đã cập nhật số lượng trong giỏ hàng');
        return updatedCart;
      } else {
        // Add new item
        toast.success('Đã thêm vào giỏ hàng');
        return [...currentCart, cartItem];
      }
    });
  };

  const removeFromCart = (itemId, variantId = null) => {
    setCart(currentCart =>
      currentCart.filter(item => {
        if (!variantId) return item._id !== itemId;
        return !(item._id === itemId && item.variant?.id === variantId);
      })
    );
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (itemId, quantity, variantId = null) => {
    if (quantity < 1) {
      removeFromCart(itemId, variantId);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item => {
        if (item._id === itemId) {
          if ((!variantId && !item.variant) || (item.variant?.id === variantId)) {
            return { ...item, quantity };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Đã xóa giỏ hàng');
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      // Đảm bảo price luôn là số
      const price = Number(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 
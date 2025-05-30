import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setCartItems(items);
    setCartTotal(totalPrice);
    setItemCount(totalItems);
  }, [items, totalPrice, totalItems]);

  const value = {
    items: cartItems,
    totalPrice: cartTotal,
    totalItems: itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaShoppingCart, FaCreditCard, FaPaypal, FaTimes, FaTrash } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';

const StoreContainer = styled.div`
  padding: 6rem 2rem 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  color: #ffffff;
  position: relative;
  z-index: 1;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 30px;
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #00ffff, #ff00ff)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.2);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 450px;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  position: relative;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  padding: 0.5rem;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ProductTitle = styled.h3`
  color: white;
  margin: 0.5rem 0;
  font-size: 1.2rem;
  text-align: center;
  flex-grow: 0;
`;

const ProductPrice = styled.div`
  color: #00ffff;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  text-align: center;
  flex-grow: 0;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: auto;
  flex-grow: 0;

  &:hover {
    opacity: 0.9;
  }
`;

const CartButton = styled.button`
  position: fixed;
  top: 100px;
  right: 30px;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CartCount = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff0066;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, rgba(25, 25, 50, 0.95), rgba(40, 40, 80, 0.95));
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
`;

const CartModal = styled(ModalContent)`
  max-width: 800px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ModalTitle = styled.h2`
  color: #00ffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartItemTitle = styled.h3`
  color: white;
  margin: 0;
`;

const CartItemPrice = styled.div`
  color: #00ffff;
  font-weight: bold;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;

  h3 {
    color: white;
    margin: 0;
  }

  span {
    color: #00ffff;
    font-size: 1.4rem;
    font-weight: bold;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
`;

const PaymentOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.selected ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.selected ? '#00ffff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }

  svg {
    font-size: 1.5rem;
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

const SpaceStore = () => {
  const [activeCategory, setActiveCategory] = useState('books');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const products = {
    books: [
      { id: 1, title: 'Cosmic Journey', price: 29.99, image: '/images/Book1.jpg' },
      { id: 2, title: "Space Explorer's Guide", price: 34.99, image: '/images/Books2.jpg' }
    ],
    tshirts: [
      { id: 3, title: 'Galaxy Explorer Tee', price: 24.99, image: '/images/STS.jpg' },
      { id: 4, title: 'Cosmic Adventure Tee', price: 24.99, image: '/images/STS1.jpg' },
      { id: 5, title: 'Space Voyager Tee', price: 24.99, image: '/images/STS2.jpg' },
      { id: 6, title: 'Astronaut Dreams Tee', price: 24.99, image: '/images/STS3.jpg' }
    ],
    telescopes: [
      { id: 7, title: 'StarGazer Pro', price: 299.99, image: '/images/tele1.jpg' },
      { id: 8, title: 'Cosmos Observer', price: 399.99, image: '/images/tele2.jpg' },
      { id: 9, title: 'Deep Space Explorer', price: 499.99, image: '/images/tele3.jpg' }
    ]
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, { ...product, cartId: Date.now() }]);
  };

  const handleRemoveFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setSelectedPayment(null);
  };

  const handleProceedToPayment = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedPayment) {
      alert('Purchase successful! Thank you for shopping at the Space Store!');
      setCartItems([]);
      handleClosePayment();
    } else {
      alert('Please select a payment method');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <StoreContainer>
      <Title>Space Store</Title>
      {cartItems.length > 0 && (
        <CartButton onClick={() => setShowCart(true)}>
          <FaShoppingCart size={24} color="white" />
          <CartCount>{cartItems.length}</CartCount>
        </CartButton>
      )}
      
      <CategoryTabs>
        <Tab 
          active={activeCategory === 'books'} 
          onClick={() => setActiveCategory('books')}
        >
          Books
        </Tab>
        <Tab 
          active={activeCategory === 'tshirts'} 
          onClick={() => setActiveCategory('tshirts')}
        >
          T-Shirts
        </Tab>
        <Tab 
          active={activeCategory === 'telescopes'} 
          onClick={() => setActiveCategory('telescopes')}
        >
          Telescopes
        </Tab>
      </CategoryTabs>
      <ProductGrid>
        {products[activeCategory].map(product => (
          <ProductCard key={product.id}>
            <ProductImageContainer>
              <ProductImage src={product.image} alt={product.title} />
            </ProductImageContainer>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductPrice>${product.price}</ProductPrice>
            <AddToCartButton onClick={() => handleAddToCart(product)}>
              Add to Cart
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductGrid>

      {showCart && (
        <ModalOverlay>
          <CartModal>
            <CloseButton onClick={handleCloseCart}>
              <FaTimes />
            </CloseButton>
            <ModalTitle>Your Space Cart</ModalTitle>
            {cartItems.map(item => (
              <CartItem key={item.cartId}>
                <CartItemImage src={item.image} alt={item.title} />
                <CartItemDetails>
                  <CartItemTitle>{item.title}</CartItemTitle>
                  <CartItemPrice>${item.price}</CartItemPrice>
                  <DeleteButton onClick={() => handleRemoveFromCart(item.cartId)}>
                    <FaTrash />
                  </DeleteButton>
                </CartItemDetails>
              </CartItem>
            ))}
            <CartTotal>
              <h3>Total:</h3>
              <span>${calculateTotal()}</span>
            </CartTotal>
            <ConfirmButton onClick={handleProceedToPayment}>
              Proceed to Payment
            </ConfirmButton>
          </CartModal>
        </ModalOverlay>
      )}

      {showPayment && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleClosePayment}>
              <FaTimes />
            </CloseButton>
            <ModalTitle>Payment</ModalTitle>
            <div style={{ color: 'white', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Order Summary</h3>
              <p>Total Items: {cartItems.length}</p>
              <p style={{ color: '#00ffff', fontSize: '1.4rem', fontWeight: 'bold' }}>
                Total Amount: ${calculateTotal()}
              </p>
            </div>
            
            <div style={{ color: 'white', marginBottom: '1rem' }}>Select Payment Method:</div>
            <PaymentOptions>
              <PaymentOption 
                selected={selectedPayment === 'card'}
                onClick={() => setSelectedPayment('card')}
              >
                <FaCreditCard />
                <span>Card</span>
              </PaymentOption>
              <PaymentOption 
                selected={selectedPayment === 'paypal'}
                onClick={() => setSelectedPayment('paypal')}
              >
                <FaPaypal />
                <span>PayPal</span>
              </PaymentOption>
              <PaymentOption 
                selected={selectedPayment === 'gpay'}
                onClick={() => setSelectedPayment('gpay')}
              >
                <SiGooglepay />
                <span>Google Pay</span>
              </PaymentOption>
            </PaymentOptions>

            <ConfirmButton onClick={handleConfirmPurchase}>
              Confirm Purchase
            </ConfirmButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </StoreContainer>
  );
};

export default SpaceStore;

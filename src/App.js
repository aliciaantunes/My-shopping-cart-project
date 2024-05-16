import React, { useState } from 'react';
import './App.css';
import cherry from './images/cherry.jpg';
import orange from './images/orange.jpg';
import strawberry from './images/strawberry.jpg';

function App() {
  const [change, setChange] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);  
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const [products] = useState([
        {
          name: "Cherry",
          price: 20,
          quantity: 0,
          productId: 1,
          image: cherry
        },
        {
          name: "Orange",
          price: 10,
          quantity: 0,
          productId: 2,
          image: orange
        },
        {
          name: "Strawberry",
          price: 15,
          quantity: 0,
          productId: 3,
          image: strawberry
        }
      ]);

      const [cart, setCart] = useState([]);

      function addProductToCart (productId) {
        let product = products.find((product) => product.productId === productId);
      
        if (product) {
          // Check if the product is already in the cart
          let cartProduct = cart.find((item) => item.productId === productId);
      
          // If the product is already in the cart, increase the quantity
          if (cartProduct) {
           const newCart = cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1} : item
        );
         setCart(newCart);// Increase the quantity of the product
          } else { // If the product is not in the cart, add it to the cart
            let newProduct = {...product, quantity: 1};  // Increase the quantity of the product
            setCart([...cart, newProduct]);
          }
        }
      } 

      function increaseQuantity(productId) {
        const newCart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
  );
  setCart(newCart);
}

      function decreaseQuantity (productId) {
        const newCart = cart.map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity - 1;
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(item => item.quantity > 0); 
        setCart(newCart);
      }

      function removeProductFromCart (productId) {
        let cartProductIndex = cart.findIndex((item) =>
      item.productId === productId);
      if (cartProductIndex !== -1) {
        let newCart = [...cart];
        newCart.splice(cartProductIndex, 1);
        setCart(newCart);
      }
    }

      function emptyCart() {
        setCart([]);
      
      }

      function cartTotal() {
        const total = cart.reduce((total, item) => total + item.quantity * item.price, 0);
        return convertCurrency(total, currency);
      }

      
      function pay(event) {
        event.preventDefault();
        const amount = parseFloat(event.target.elements.received.value);
        const updatedTotalPaid = totalPaid + amount;
      
        setTotalPaid(updatedTotalPaid);
        setPurchaseSuccess(false);
      
        let remainingBalance = updatedTotalPaid - cartTotal();
      
        if (remainingBalance < 0) {
          setErrorMessage(`The payment is missing ${(Math.abs(remainingBalance)).toFixed(2)} ${currency} to complete.`);
          setChange(0);
        } else {
          emptyCart();
          setChange(remainingBalance);
          setErrorMessage('');
          setTotalPaid(0);
          setPurchaseSuccess(true);
        }
      
        return remainingBalance;
      }

      function convertCurrency(value, currency) {
        const rates = {
          USD: 1,
          EUR: 0.85,
          BRL: 5.25,
          JPY: 110
        };
        return value * rates[currency];
      }

      const currencySymbols = {
        USD: '$',
        EUR: '€',
        BRL: 'R$',
        JPY: '¥'
      };
      
    return (
      <div className="shopping-cart">
        <h1>Alicia's Fruit Stand</h1>
        <div className="currency-selector">
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="BRL">BRL</option>
          <option value="JPY">JPY</option>
        </select>
        </div>
      <div class="layout-container">
        <div className="products-container">
            <h2>Products</h2>
            <div className="products">
            {products.map(product => (
            <div key={product.productId}>
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} />
            <p>Price: {currencySymbols[currency]}{convertCurrency(product.price, currency).toFixed(2)}</p>
            <button onClick={() => addProductToCart(product.productId)}>Add to Cart</button>
          </div>
            ))}
            </div>
        </div>
        <div class="right-container">
        <div className="cart-management-container">
            <h2>Your Shopping Cart</h2>
            <div className="cart">
            {cart.map(item => (
              <div key={item.productId}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <span>Total: ${convertCurrency(item.quantity * item.price, currency).toFixed(2)}</span>
                <button onClick={() => decreaseQuantity(item.productId)}> - </button>
                <button onClick={() => increaseQuantity(item.productId)}> + </button>
                <button onClick={() => removeProductFromCart(item.productId)}>Remove</button>
              </div>
            ))}
            </div>
            <div className="empty-btn">
            <button onClick={() => emptyCart()}> Empty Cart </button>
            </div>
        </div>
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout">
                <div className="cart-total">
                <span>Total: {currencySymbols[currency]}{convertCurrency(cart.reduce((total, item) => total + (item.quantity * item.price), 0), currency).toFixed(2)}</span>
                </div>
                <form onSubmit={pay}>
  <label>Enter Cash Received:</label>
  <input className="received" type="text" name="received"/>
  <button type="submit" className="pay">Submit</button> 
</form>
                <h3>Receipt</h3>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {purchaseSuccess && <p>Thank you for your purchase!</p>}
                <div className="pay-summary">
                <p>Change: {currencySymbols[currency]}{(change).toFixed(2)}</p>
                </div>
            </div>
        </div>
        </div>
        </div>
      </div>
    );
}

export default App;

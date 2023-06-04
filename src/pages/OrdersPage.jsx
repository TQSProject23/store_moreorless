import React, { useState, useEffect } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searching) {
      // Fetch orders data from API
      fetchOrders();
      setSearching(false);
    }
  }, [searching]);

  const fetchOrders = async () => {
    try {
      // Replace with your API endpoint to fetch orders
      const response = await fetch(`http://localhost:8080/api/v1/orders/user/${email}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearching(true);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date Ordered</th>
            <th>Status</th>
            <th>Client Name</th>
            <th>Client Email</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.description}</td>
              <td>{order.price}</td>
              <td>{order.dateOrdered}</td>
              <td>{order.status}</td>
              <td>{order.clientName}</td>
              <td>{order.clientEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;

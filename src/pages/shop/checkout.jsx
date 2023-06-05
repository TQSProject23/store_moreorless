import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../../products";
import { ShopContext } from "../../context/shop-context";
import { useContext } from "react";
// import bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export const Checkout = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [pps, setPps] = useState([]);
  const [selectedPps, setSelectedPps] = useState("");

  useEffect(() => {
    fetch("https://loadconnect.azurewebsites.net/api/v1/pps/all")
      .then((response) => response.json())
      .then((data) => setPps(data));
  }, []);

  const handleSelectPps = (e) => {
    setSelectedPps(e.target.value);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    console.log(
      "Proceeding to checkout with selected pickup point: ",
      selectedPps
    );
    try {
      const response = await fetch("https://loadconnect.azurewebsites.net/api/v1/orders/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        console.log("Order created successfully!");
        window.location.href = `/`;
      } else {
        console.log("Failed to create Order");
        console.log("orderDetails: ", orderDetails);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  let cartDescription = PRODUCTS.map((product) => {
    if (cartItems[product.id] !== 0) {
      return `(${cartItems[product.id]}) ${product.productName}`;
    }
    return null;
  })
    .filter((item) => item !== null)
    .join(", ");
    
    let orderDetails = {
      id: 302, // update this as needed
      description: cartDescription,
      price: totalAmount,
      weight: 1.5,
      dateOrdered: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: null,
      pickup_date: null,
      status: "PENDING",
      clientName: clientName,
      clientEmail: clientEmail,
      pickupPoint: { id: selectedPps }
    };

  return (
    <div className="shop container">
      <h1 className="text-center my-4">Checkout</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((product) => {
                if (cartItems[product.id] !== 0) {
                  return (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{cartItems[product.id]}</td>
                      <td>{product.price * cartItems[product.id]}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <p className="text-center">Total: ${totalAmount}</p>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Pickup Points</label>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {pps.map((pp, index) => (
                  <tr key={pp.id}>
                    <td>
                      <input
                        type="radio"
                        name="pp"
                        value={pp.id}
                        checked={selectedPps === pp.id}
                        onChange={handleSelectPps}
                        className="form-check-input"
                      />
                    </td>
                    <td>{pp.id}</td>
                    <td>{pp.pp_name}</td>
                    <td>{pp.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-primary" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

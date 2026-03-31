import React, { Component } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Admin.css";
import axios from "axios";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      orders: []
    };
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchOrders();
  }

  fetchUsers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user`, { withCredentials: true })
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  fetchOrders = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders`, { withCredentials: true })
      .then((response) => {
        this.setState({ orders: response.data });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  onButtonPressed = (id) => {
    console.log("Attempting to delete user with ID:", id);
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`${process.env.REACT_APP_API_URL}/user/${id}`, { withCredentials: true })
      .then(() => {
        this.setState({
          users: this.state.users.filter((user) => user._id !== id)
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  onDeleteOrder = (id) => {
    console.log("Attempting to delete order with ID:", id);
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    axios
      .delete(`${process.env.REACT_APP_API_URL}/orders/${id}`, { withCredentials: true })
      .then(() => {
        this.setState({
          orders: this.state.orders.filter((order) => order._id !== id)
        });
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };

  renderOrderItems = (items) => {
    if (!items || items.length === 0) return "No items";

    return (
      <div className="order-items-list">
        {items.map((item, index) => (
          <div key={index} className="order-item-row">
            {item.itemName} - {item.weight} kg × ₹{item.price}
          </div>
        ))}
      </div>
    );
  };

  calculateOrderTotal = (items) => {
    if (!items || items.length === 0) return "0.00";

    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.weight);
    }, 0);

    return total.toFixed(2);
  };

  render() {
    const { users, orders } = this.state;
    const currentUser = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="admin-page">
        <div className="table-wrapper">
          <div className="content">
            <h1>Admin Dashboard</h1>
          </div>

          <section className="admin-section">
            <h2>
              <u>Captured User Info:</u>
            </h2>

            <div className="admin-table-scroll">
              <table className="table admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Firm Name</th>
                    <th>Email Id</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id || user.username}>
                        <td>{user.username}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.firmname}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.role}</td>
                        <td>
                          {currentUser?.id === user._id ? (
                                <button className="DeleteButton disabled-btn" disabled>
                                    You
                                </button>
                                ) : (
                                <button
                                    className="DeleteButton"
                                    onClick={() => this.onButtonPressed(user._id)}
                                >
                                    Delete
                                </button>
                                )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-cell">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2>
              <u>Captured Orders:</u>
            </h2>

            <div className="admin-table-scroll">
              <table className="table admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Postcode</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.username}</td>
                        <td>{order.email}</td>
                        <td>
                          {order.address1}
                          {order.address2 ? `, ${order.address2}` : ""}
                        </td>
                        <td>{order.city}</td>
                        <td>{order.postcode}</td>
                        <td>{this.renderOrderItems(order.items)}</td>
                        <td>₹ {this.calculateOrderTotal(order.items)}</td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            className="DeleteButton"
                            onClick={() => this.onDeleteOrder(order._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-cell">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
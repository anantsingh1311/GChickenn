import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { API_URL } from "../config";
import { formatCurrency } from "../utils/formatters";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, { withCredentials: true });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, { withCredentials: true });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const orderCount = orders.length;
  const userCount = users.length;
  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum, order) => {
        return (
          sum +
          (order.items || []).reduce((itemSum, item) => {
            return itemSum + Number(item.price) * Number(item.weight);
          }, 0)
        );
      }, 0),
    [orders]
  );

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/user/${id}`, { withCredentials: true });
      setUsers((current) => current.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/orders/${id}`, { withCredentials: true });
      setOrders((current) => current.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const renderOrderItems = (items) => {
    if (!items?.length) {
      return <span className="text-brand-cream/55">No items</span>;
    }

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item.itemName}-${index}`}
            className="rounded-2xl border border-brand-line bg-white/5 px-3 py-2"
          >
            <span className="font-medium text-white">{item.itemName}</span>
            <span className="text-brand-cream/70"> - {item.weight} kg x {formatCurrency(item.price)}</span>
          </div>
        ))}
      </div>
    );
  };

  const calculateOrderTotal = (items) => {
    return (items || []).reduce((sum, item) => sum + Number(item.price) * Number(item.weight), 0);
  };

  return (
    <div className="page-container space-y-6 pt-4 sm:space-y-8">
      <section className="section-shell">
        <span className="section-eyebrow">Admin dashboard</span>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="section-title">Manage customers and incoming orders with a cleaner control view.</h1>
            <p className="section-copy mt-4">
              This dashboard keeps the same premium visual system as the storefront while making large tables easier to scan on different screen sizes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-brand-line bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-brand-sand">Users</p>
              <p className="mt-3 font-display text-3xl text-white">{userCount}</p>
            </div>
            <div className="rounded-3xl border border-brand-line bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-brand-sand">Orders</p>
              <p className="mt-3 font-display text-3xl text-white">{orderCount}</p>
            </div>
            <div className="rounded-3xl border border-brand-line bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-brand-sand">Revenue</p>
              <p className="mt-3 font-display text-3xl text-white">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow">Customer accounts</span>
            <h2 className="mt-4 font-display text-3xl text-white">Registered users</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brand-cream/70">
            Account data is shown in a horizontally scrollable table to remain readable on narrower viewports.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loadingUsers ? (
            <div className="status-card">Loading users...</div>
          ) : (
            <div className="data-table min-w-[900px]">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Firm name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
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
                            <span className="inline-flex rounded-full border border-dashed border-brand-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream/55">
                              You
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="secondary-button px-4 py-2"
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow">Order management</span>
            <h2 className="mt-4 font-display text-3xl text-white">Captured orders</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brand-cream/70">
            Keep delivery details, product breakdowns, and totals together in a layout that stays legible on desktop and tablet.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loadingOrders ? (
            <div className="status-card">Loading orders...</div>
          ) : (
            <div className="data-table min-w-[1180px]">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Postcode</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Created at</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length ? (
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
                        <td>{renderOrderItems(order.items)}</td>
                        <td>{formatCurrency(calculateOrderTotal(order.items))}</td>
                        <td>
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="secondary-button px-4 py-2"
                            onClick={() => deleteOrder(order._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

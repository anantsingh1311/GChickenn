import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import axios from "axios";

import Order from "./Order";
import { API_URL } from "../config";
import { formatCurrency } from "../utils/formatters";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: { error: jest.fn(), success: jest.fn() }
}));

function getOrderSummary() {
  return within(screen.getByRole("complementary"));
}

test("uses whole-item quantities and keeps the order total in sync", () => {
  render(<Order />);

  const quantity = screen.getByRole("spinbutton", { name: "Quantity for Wireless Headphones" });
  const increase = screen.getByRole("button", { name: "Increase quantity for Wireless Headphones" });
  const decrease = screen.getByRole("button", { name: "Decrease quantity for Wireless Headphones" });

  fireEvent.click(decrease);
  expect(quantity).toHaveValue(0);
  fireEvent.click(increase);
  fireEvent.click(increase);
  expect(quantity).toHaveValue(2);
  expect(getOrderSummary().getAllByText(formatCurrency(6998))).toHaveLength(2);

  fireEvent.change(quantity, { target: { value: "1.5" } });
  expect(quantity).toHaveValue(2);
  fireEvent.change(quantity, { target: { value: "3" } });
  expect(getOrderSummary().getAllByText(formatCurrency(10497))).toHaveLength(2);

  fireEvent.change(quantity, { target: { value: "" } });
  expect(getOrderSummary().getByText(/no items selected yet/i)).toBeInTheDocument();
});

test("submits sample items through the existing order API and resets the cart", async () => {
  axios.post.mockResolvedValueOnce({ data: { message: "Order placed successfully." } });
  render(<Order />);

  fireEvent.click(screen.getByRole("button", { name: "Increase quantity for Wireless Headphones" }));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Demo Customer" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "demo@example.com" } });
  fireEvent.change(screen.getByLabelText("Address line 1"), { target: { value: "123 Sample Street" } });
  fireEvent.change(screen.getByLabelText("Postcode"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/orders/add`,
    expect.objectContaining({
      username: "Demo Customer",
      items: [{ itemName: "Wireless Headphones", price: 3499, weight: 1 }]
    }),
    { withCredentials: true }
  ));
  await waitFor(() => expect(getOrderSummary().getByText(/no items selected yet/i)).toBeInTheDocument());
});

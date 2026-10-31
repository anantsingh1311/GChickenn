import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";

import Products from "./Products";

jest.mock("axios", () => ({ get: jest.fn() }));

test("browses the sample catalog and business bundles without inventory requests", () => {
  render(<Products />);

  expect(screen.getByRole("heading", { name: "Wireless Headphones" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Cotton Throw Blanket" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Business bundles" }));
  expect(screen.getByRole("heading", { name: "Example bundle pricing" })).toBeInTheDocument();
  expect(screen.getByText("Office set of 5")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Sample catalog" }));
  expect(screen.getByRole("heading", { name: "Featured sample products" })).toBeInTheDocument();
  expect(screen.queryByText("Office set of 5")).not.toBeInTheDocument();
  expect(axios.get).not.toHaveBeenCalled();
});

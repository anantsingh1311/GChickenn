import { render, screen } from "@testing-library/react";

import Home from "./components/Home";

jest.mock(
  "react-router-dom",
  () => ({ Link: ({ children }) => children }),
  { virtual: true }
);

test("renders the Ecommerce store home hero", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", {
      name: /a complete ecommerce storefront ready to adapt to your next brand/i
    })
  ).toBeInTheDocument();
});

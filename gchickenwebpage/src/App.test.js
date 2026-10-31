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
      name: /everything you need from one clear, convenient ecommerce store/i
    })
  ).toBeInTheDocument();
});

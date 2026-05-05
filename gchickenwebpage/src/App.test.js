import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders the GChickenn home hero", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /delivering farm-fresh chicken with a calmer, cleaner buying experience/i
    })
  ).toBeInTheDocument();
});

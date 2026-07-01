import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

interface RenderOptions {
  route?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  { route = "/" }: RenderOptions = {}
) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

export function withRouter(children: ReactNode, route = "/") {
  return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
}
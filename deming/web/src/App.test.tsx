import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App.js";

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the agent header", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Deming" })).toBeInTheDocument();
  });

  it("sends a message and renders the agent reply", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ text: "Hello from the agent" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );

    render(<App />);
    fireEvent.change(screen.getByLabelText("message"), { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() =>
      expect(screen.getByText("Hello from the agent")).toBeInTheDocument()
    );
  });

  it("shows an error message when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 500 })
    );

    render(<App />);
    fireEvent.change(screen.getByLabelText("message"), { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
  });
});

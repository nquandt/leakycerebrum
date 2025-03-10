import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";
import "./app.css";
import { useLayoutEffect } from "react";
import { Logo } from "./components/Logo";
import { Container } from "./components/Container";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

let isHooked = false;

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  /**
   * Catch all a-href tags clicks
   */
  useLayoutEffect(() => {
    // need to figure out how to make singleton
    if (!isHooked) {
      document.addEventListener(`click`, (e: any) => {
        const origin = e.target.closest(`a`);

        if (origin) {
          e.preventDefault();
          e.stopPropagation();
          navigate(new URL(origin.href).pathname);
        }
      });
      isHooked = true;
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script type="module" src="/theme.js"></script>
      </head>
      <body className="">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <Container>
      <div className="w-full flex justify-center pt-36">
        <Logo className="w-full active-pulse" />
      </div>
    </Container>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

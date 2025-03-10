import { Outlet } from "react-router";
import { Container } from "~/components/Container";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function Layout() {
  return (
    <main
      id="app"
      className="w-full h-full relative min-h-screen flex flex-col justify-between items-center gap-32"
    >
      <div className="w-full flex flex-col justify-start items-center gap-8">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

import { Container } from "~/components/Container";
import { ThemeButton } from "../ThemeButton";
import { Logo } from "../Logo";
import { useLocation } from "react-router";

const navs = [
  {
    name: "Posts",
    url: "/Posts",
  },
];

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className="py-3 flex w-full justify-between fixed bg-gradient-to-b dark:from-zinc-950 light:from-light !from-50% z-10"
        style={{ height: "80px" }}
      >
        <Container>
          <div
            className="flex w-full h-full items-center justify-between"
            hx-target="#inner"
          >
            {pathname === "/" ? (
              <div></div>
            ) : (
              <a className="h-full flex gap-4 items-center" href="/">
                <Logo size="50px" />
                <span className="font-italic font-serif">leaky</span>
              </a>
            )}
            <div className="flex gap-4 items-center">
              <a href="/posts">Leaks</a>
              <ThemeButton />
            </div>
          </div>
        </Container>
      </div>
      <div
        className="py-3 flex w-full justify-between"
        style={{ minHeight: "80px" }}
      ></div>
    </>
  );
};

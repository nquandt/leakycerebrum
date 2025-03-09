import { Container } from "~/components/Container";
import { ThemeButton } from "../ThemeButton";

const navs = [
  {
    name: "Posts",
    url: "/Posts",
  },
];

export const Header = () => {
  return (
    <>
      <div
        className="py-3 flex w-full justify-between fixed bg-gradient-to-b dark:from-zinc-900 light:from-light !from-50% z-10"
        style={{height: "80px"}}
      >
        <Container>
          <div
            className="flex w-full h-full items-center justify-between"
            hx-target="#inner"
          >
            <a href="/">leaky</a>
            <div className="flex gap-4 items-center">
              <a href="/posts">Posts</a>
              <ThemeButton />              
            </div>
          </div>
        </Container>
      </div>
      <div className="py-3 flex w-full justify-between" style={{minHeight: "80px"}}>
      </div>
    </>
  );
};

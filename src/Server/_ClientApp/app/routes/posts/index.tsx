import { Container } from "~/components/Container";
import { Posts } from "~/components/Posts";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Posts | Leaky Cerebrum" },
    { name: "description", content: "Check out some leaks from my brain." },
  ];
}

export default function Page() {  
  return (
    <Container>
      <Posts />
    </Container>
  );
}

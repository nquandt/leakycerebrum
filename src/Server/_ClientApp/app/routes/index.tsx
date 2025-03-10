import type { Route } from "./+types";
import { Logo } from "~/components/Logo";
import { Container } from "~/components/Container";
import { MarkdownView } from "~/components/markdown-view";
import { Posts } from "~/components/Posts";
import { HR } from "~/components/HR";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leaky Cerebrum" },
    { name: "description", content: "Welcome to my brain dump!" },
  ];
}

export default function Home() {
  return (
    <>
      <Container>
        <div className="w-full flex max-md:flex-col md:gap-16 items-center">
          <a className="flex-1" href="/posts">
            <Logo className="w-full" />
          </a>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <h1 className="font-italic text-6xl font-serif">leaky cerebrum</h1>
            <div className="light:bg-zinc-300/50 dark:bg-zinc-800/50 p-4 rounded-md flex flex-col gap-4">
              <h2 className="font-italic text-4xl font-serif">
                Where ideas spill and knowledge flows.
              </h2>
            </div>
          </div>
        </div>
      </Container>
      <Container className="py-16 text-xl">
        <div className="flex flex-col justify-center gap-16">
          <HR/>
          <MarkdownView
            document={`### **What I want to share**  

Software is more than just code. It's architecture, decision-making, trade-offs, and the people who build it. It's the tension between structure and flexibility, between moving fast and building for the long term. It's the ecosystem of tools, patterns, and methodologies that shape how we work—not just individually, but as teams, organizations, and industries.  

**Leaky Cerebrum** is a collection of thoughts on these complexities. It's about making sense of the challenges we face as software engineers, architects, and product developers. Through these articles, I explore the strategies, principles, and philosophies that help turn chaotic systems into maintainable ones, and how we, as developers, can refine our thinking to make better decisions.  

### **Concepts in my brain**  

- **Architecture & Systems Thinking** - Designing for adaptability, scalability, and sustainability.  
- **Software Development Practices** - Principles and techniques that reduce cognitive load and improve efficiency.  
- **Ecosystem & Tooling** - Understanding how tools shape development, and using them effectively without dependency bloat.  
- **Culture, Communication & Leadership** - How teams align (or don't), and what makes engineering cultures thrive.  

Whether you're an engineer refining your craft, an architect shaping technical strategy, or just someone navigating the ever-changing software landscape, this blog is a place to explore ideas that challenge, clarify, and hopefully resonate.`}
          />
          <HR/>
          <h1 className="text-4xl underline font-italic dark:text-white light:text-black">
            Some Leaks
          </h1>
          <Posts />
          <a className="p-4 px-8 rounded-md border-[1px] border-solid border-zinc-800 hover:bg-zinc-600 mx-auto " href="/posts">Find more</a>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col gap-8 w-full">
        </div>
      </Container>
    </>
  );
}

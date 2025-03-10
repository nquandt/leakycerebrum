import { Container } from "../Container";

export const Footer = () => {
  return (
    <div
      className="w-full flex flex-col justify-end items-center py-3 mt-auto"
      // style={{ minHeight: "400px" }}
    >
      <Container>
        <div className="w-full flex max-sm:flex-col max-sm:justify-center justify-between items-center text-zinc-500">
          <div>I am a footer.</div>
          <div>(and yes i know it says "I am a footer.")</div>
        </div>
      </Container>
    </div>
  );
};

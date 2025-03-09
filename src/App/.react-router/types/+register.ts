import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/": {};
  "/posts": {};
  "/posts/:slug": {
    "slug": string;
  };
};
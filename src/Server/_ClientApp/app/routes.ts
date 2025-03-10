// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;

import { type RouteConfig } from "@react-router/dev/routes";
import { nextRoutes, appRouterStyle } from "rr-next-routes";

const routes = nextRoutes({
  folderName: "routes",
  print:"info",
  extensions:[".tsx"],
  routeFileNameOnly: true,
  layoutFileName: "_layout",
  routeFileNames: ["index"],
});

export default routes satisfies RouteConfig;

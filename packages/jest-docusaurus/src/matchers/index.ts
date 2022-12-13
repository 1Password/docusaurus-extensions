import { toAddRoutes } from "./to-add-routes";
import { toCreateData } from "./to-create-data";
import { toHaveThemePaths } from "./to-have-theme-paths";
import { toLoadClientModules } from "./to-load-client-modules";
import { toSetGlobalData } from "./to-set-global-data";

expect.extend({
  toLoadClientModules,
  toHaveThemePaths,
  toSetGlobalData,
  toCreateData,
  toAddRoutes,
});

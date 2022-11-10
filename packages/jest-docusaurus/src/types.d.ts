/// <reference types="@docusaurus/theme-classic" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toLoadClientModules: (...expectedModules: string[]) => R;
      toHaveThemePaths: (themePath: string, tsThemePath?: string) => R;
      toSetGlobalData: (data: any) => Promise<R>;
      toCreateData: (name: string, data: any) => Promise<R>;
      toAddRoutes: (...routeConfigs: RouteConfig[]) => Promise<R>;
    }
  }
}

export {};

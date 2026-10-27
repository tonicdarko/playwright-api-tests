import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APIlogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";

export type TestOptions = {
  api: RequestHandler;
  config: typeof config
};

export const test = base.extend<TestOptions>({
  api: async ({ request }, use) => {
    const baseUrl = config.apiUrl;
    const logger = new APIlogger();
    setCustomExpectLogger(logger)
    const requestHandler = new RequestHandler(request, baseUrl, logger);
    await use(requestHandler);
  },
  config: async({}, use) => {
    await use(config)
  }
});

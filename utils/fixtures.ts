import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APIlogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";

export type TestOptions = {
  api: RequestHandler;
};

export const test = base.extend<TestOptions>({
  api: async ({ request }, use) => {
    const baseUrl = "https://conduit-api.bondaracademy.com/api";
    const logger = new APIlogger();
    setCustomExpectLogger(logger)
    const requestHandler = new RequestHandler(request, baseUrl, logger);
    await use(requestHandler);
  },
});

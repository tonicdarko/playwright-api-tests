import { test } from "../utils/fixtures";
import { expect } from "@playwright/test";
import { APIlogger } from "../utils/logger";

let authToken: string;

test.beforeAll("Get Auth Token", async ({ api }) => {
  const tokenResponse = await api
    .path("/users/login")
    .body({
      user: {
        email: "testingudemy@testing.com",
        password: "Brljotina12",
      },
    })
    .postRequest(200);

  authToken = "Token " + tokenResponse.user.token;
});

test("Get Articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).toBeLessThanOrEqual(10);
});

test("Get Tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);

  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("Create and delete Article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Playwright Test",
        description: "Testing Udemy",
        body: "Testing body",
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponse.article.title).toEqual("Playwright Test");

  const slugId = createArticleResponse.article.slug;

  const articlesResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(articlesResponse.articles[0].title).toEqual("Playwright Test");

  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);
});

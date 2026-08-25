import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll('Get Auth Token', async ({request}) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user": {"email":	"testingudemy@testing.com", "password":	"Brljotina12"}}
  });
  const tokenResponseJson = await tokenResponse.json();
  authToken = 'Token ' + tokenResponseJson.user.token;
});

test('Get Test Tags', async ({ request }) => {
  const requestResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const requestResponseJson = await requestResponse.json();
  console.log(requestResponseJson);

  expect(requestResponse.status()).toEqual(200);
  expect(requestResponseJson.tags[0]).toEqual('Test');
  expect(requestResponseJson.tags.length).toBeLessThanOrEqual(10)
});


test('Get All Articles', async ({request}) => {
const requestArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
const requestArticlesJson = await requestArticles.json();

console.log(requestArticlesJson);

expect(requestArticles.status()).toEqual(200);
expect(requestArticlesJson.articles.length).toBeLessThanOrEqual(10);
expect(requestArticlesJson.articlesCount).toBeLessThanOrEqual(10);
});

test('Create and Delete Article', async ({request}) => {
  
  const newArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles', { data: {
    "article":{
      "title": "Playwright Test",
      "description": "Testing Udemy",
      "body": "Testing body",
      "tagList": []
    }
  },
    headers: {
      Authorization: authToken
    }
});
const newArticleResponseJson = await newArticle.json();
expect(newArticle.status()).toEqual(201);
expect(newArticleResponseJson.article.title).toEqual('Playwright Test'); 

const slugId = newArticleResponseJson.article.slug;

const requestArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
  headers: {
      Authorization: authToken
    }
});
const requestArticlesJson = await requestArticles.json();
expect(requestArticles.status()).toEqual(200);
expect(requestArticlesJson.articles[0].title).toEqual('Playwright Test');

const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {headers: {
      Authorization: authToken
    }});
expect(deleteArticleResponse.status()).toEqual(204);
});

test('Create and Update and Delete Article', async ({request}) => {
  
  const newArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles', { data: {
    "article":{
      "title": "Playwright Test New Article",
      "description": "Testing Udemy",
      "body": "Testing body",
      "tagList": []
    }
  },
    headers: {
      Authorization: authToken
    }
});
const newArticleResponseJson = await newArticle.json();
expect(newArticle.status()).toEqual(201);
expect(newArticleResponseJson.article.title).toEqual('Playwright Test New Article'); 

const slugId = newArticleResponseJson.article.slug;

const updateArticle = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, { data: {
    "article":{
      "title": "Playwright Test New Article Modified",
      "description": "Testing Udemy",
      "body": "Testing body",
      "tagList": []
    }}
    ,
    headers: {
      Authorization: authToken
    }
    });
const updateArticleJson = await updateArticle.json();

expect(updateArticle.status()).toEqual(200);
expect(updateArticleJson.article.title).toEqual('Playwright Test New Article Modified');


const newSlugId= updateArticleJson.article.slug;

const requestArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
  headers: {
      Authorization: authToken
    }
});
const requestArticlesJson = await requestArticles.json();
expect(requestArticles.status()).toEqual(200);
expect(requestArticlesJson.articles[0].title).toEqual('Playwright Test New Article Modified');

const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {headers: {
      Authorization: authToken
    }});
expect(deleteArticleResponse.status()).toEqual(204);
});
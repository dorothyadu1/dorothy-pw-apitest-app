import { test, expect,} from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async({page}) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://angular.realworld.how');
})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a MOCK test title for DA"
    responseBody.articles[0].description = "This is a MOCK description for DA"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title for DA')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description for DA')
});

// test('delete article', async ({page, request}) => {
//   const response await request.post('https://api.realworld.io/api/users/login', {
//     data: {
//       "user":{"email":"dorothypwtest3@gmail.com","password":"Welcome1"}
//     }
//   })
//   const responseBody = await response.json()
//   console.log(responseBody)

// })

test('delete article2', async ({page, request}) => {
  const response = await request.post('https://api.realworld.io/api/users/login', {
    data: {
      "user":{"email":"dorothypwtest3@gmail.com","password":"Welcome1"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token

  const articleResonse = await request.post('https://api.realworld.how/api/articles/', {
    data: {
      "article":{"title":"This is the article title","description":"This is what the article is about","body":"This is a markdown description of the article.","tagList":[]}
    },
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  expect(articleResonse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('his is the article title').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is the article title')
})

test('create article', async ({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
  await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About Playwright')
  await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use Playwright for automation')
  await page.getByRole('button', {name: 'Publish Article'}).click()
  const articleResponse = await page.waitForResponse('https://api.realworld.io/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugID = articleResponseBody.article.slug
  
  await expect(page.locator('.article-page h1').first()).toContainText('Playwright is awesome')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

  // const response = await request.post('https://api.realworld.io/api/users/login', {
  //   data: {
  //     "user":{"email":"dorothypwtest3@gmail.com","password":"Welcome1"}
  //   }
  // })
  // const responseBody = await response.json()
  // const accessToken = responseBody.user.token

  const deleteArticleResponse = await request.delete(`https://api.realworld.io/api/articles/${slugID}`, {
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
})
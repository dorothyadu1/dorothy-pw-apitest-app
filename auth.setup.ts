import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentication', async({request}) => {
// await page.goto('https://angular.realworld.how');
//   await page.getByText('Sign in').click()
//   await page.getByRole('textbox', {name: 'Email'}).fill('dorothypwtest3@gmail.com')
//   await page.getByRole('textbox', {name: 'Password'}).fill('Welcome1')
//   await page.getByRole('button').click()
//   await page.waitForResponse('https://api.realworld.io/api/tags')

//   await page.context().storageState({path: authFile})        //THESE STEPS ARE USING THE UI

  const response = await request.post('https://api.realworld.io/api/users/login', {
    data: {
      "user":{"email":"dorothypwtest3@gmail.com","password":"Welcome1"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token
  user.origins[0].localStorage[0].value = accessToken
  fs.writeFileSync(authFile, JSON.stringify(user))

  process.env['ACCESS_TOKEN'] = accessToken

})

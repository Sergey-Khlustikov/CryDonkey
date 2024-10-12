async function checkTwitterAuth(page) {
  const cookies = await page.cookies();
  const authToken = cookies.find(cookie => cookie.name === 'auth_token');

  return !!authToken;
}

export default checkTwitterAuth;

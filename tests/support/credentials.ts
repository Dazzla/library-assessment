export function getCredentials() {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing APP_USERNAME or APP_PASSWORD env vars");
  }

  return { username, password };
}
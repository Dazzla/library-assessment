# Books Inventory App – Test Automation (Playwright + TypeScript)

## Overview

This repo contains end-to-end tests for the **Books Inventory Application** using **Playwright** and **TypeScript**.

The tests validate these requirements:

- Only authorised users can access the books catalog and make changes
- Successful user journey from login to adding a book
- Validation is enforced on login and book forms
- Error messages are displayed for invalid inputs
- Logout returns the user to the login page and blocks access to protected pages

## Tech stack

- Node.js
- Playwright
- TypeScript

## Target environment

Default target URL is the hosted app:

- https://frontendui-librarysystem.onrender.com/

## Setup

Install dependencies:

```bash
npm install
```

## Credentials and configuration

This test suite reads the application URL and login credentials from environment variables.

### Local setup (recommended)

* Create a `.env` file in the project 

root:

```bash
BASE_URL=https://frontendui-librarysystem.onrender.com
APP_USERNAME=<username>
APP_PASSWORD=<password>
```

* DO NOT COMMIT.
Add to .gitignore:

```bash 
.env
.env.*
```

## Override without changing .env:

```bash
BASE_URL=http://localhost:3000 APP_USERNAME=<username> APP_PASSWORD=<password> npx playwright test
```

## CI configuration:

Do not store credentials in the repo. In your CI system, add the following environment variables as secrets:

```bash
BASE_URL

APP_USERNAME

APP_PASSWORD
```

The Playwright config will automatically pick these up at runtime.


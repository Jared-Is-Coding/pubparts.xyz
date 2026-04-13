# PubParts.xyz

PubParts.xyz is a website to display a collection of open source or otherwise aftermarket OneWheel parts.

## Code Development Environment Setup
Want to contribute to this repository? Here's some steps to get set up.

1. Install NodeJS version 20.x
2. Clone this repository
3. Navigate to the local clone directory and run `npm install` to install dependencies
4. In the repository root, create a `.env` file containing the contents of the `.env.example` file
5. Start debugging via either:
    - `${workspaceRoot}/node_modules/.bin/gatsby develop`
    - In Visual Studio Code, you can run `Debug: Start Debugging`

### Database Setup with Prisma.

Generate Prisma client and apply the schema to your Postgres DB:

```bash
npm run db:push
```

Use `npm run db:generate` only when the Prisma schema changes or after a fresh install that does not already have a generated client.

### Development Admin Page

A development-only DB admin page is available at:

`/admin`

This page supports add, edit, and delete operations for catalog parts, resources, and shop items, and is only enabled when `NODE_ENV=development`.

It uses the dev-only API endpoint:

`/api/admin-db`

Parts are synced via:
1. Scheduled sync every 15 minutes.
2. Immediate sync trigger when inventory is updated from a admin panel.

## Contributing
Now that you've set up the development environment, be sure to check out the [contributing guidelines](https://github.com/Jared-Is-Coding/pubparts.xyz/blob/master/CONTRIBUTING.md).
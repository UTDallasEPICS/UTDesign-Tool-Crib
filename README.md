# UTDesign Toolcrib Inventory Tracker

## Prerequisites

### auth0

This project uses [auth0](https://auth0.com) for user authentication. You will need a free account and a little bit of setup to start. It is recommended following [this guide](https://auth0.com/docs/quickstart/webapp/nextjs/01-login) to get started. The `.env.local` file mentioned in the guide is explained in a bit more detail in the next section.

### .env.local

There is a `.env.local` file that needs to be configured before running anything. Copy/rename `env.local.example` to `.env.local` and fill in the required auth0 and MySQL database information

## Starting the Database database

To run the database, docker compose needs to be installed. Follow the steps at [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/) if you need help. You can then run the following command to start the MySQL database.

```bash
docker compose up -d
```

## Running the development server

### Installing packages

Before running the server, all packages need to be installed:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Configure Prisma Client

Next, ensure [Prisma](https://www.prisma.io) is configured correctly:

```bash
npm prismaPush
# or
pnpm prismaPush
```

### Start Development Server

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing any of the files and when they are saved, the development server will automatically update them

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# 🚀 KitForStartups - Stacks

The Open Source SvelteKit SaaS boilerplate.

_KitForStartups_ is a starter kit for building and shipping fast, secure, and scalable full-stack SaaS applications with SvelteKit and TypeScript. This particular instance, named **Stacks**, is tailored for payroll and employee management.

If you already found yourself in a situation where you were:

- Trying to set up various authentication systems (email/password, social logins, OAuth, etc.)
- Scratching your head over how to structure your app
- Spending too much time setting up payments for your SvelteKit app either with Stripe or Lemon Squeezy
- Fighting against your email provider for sending emails from your app, and testing them reliably on your local machine
- Doing all the above again and again for every new project

Then _KitForStartups_ is for you 🎉!

## ⚒️ Tech Stack

- SvelteKit
- TypeScript
- Zod
- Drizzle ORM
- Drizzle Kit
- Tailwind CSS
- PostgreSQL
- Lucia Auth
- Resend
- Playwright
- Vitest
- Docker

## 📦 Getting Started

This project uses PostgreSQL as a database.

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- pnpm
- Docker Compose (optional)

### Installation

1.  **Setup**

    - Clone or fork the repository:

    ```bash
    git clone https://github.com/okupter/kitforstartups my-project
    ```

2.  **Install dependencies**

    ```bash
    cd my-project
    pnpm install
    ```

3.  **Setup the environment variables**

    Duplicate the `.env.example` file and rename it to `.env`. Then, fill in the values for the environment variables.

    ```bash
    cp .env.example .env
    ```

4.  **Setup the database**

    For easy local development, there is a `./docker/mysql.yml` file that you can use to spin up a MySQL database in a Docker container. If you don't want to use Docker, you can install MySQL locally and skip this step.

    ```bash
    docker-compose -f docker/mysql.yml up -d
    ```

    Remember to update the `POSTGRES_*` environment variables in the `.env` file with your database credentials.

5.  **Run the migrations**

    We use [`Drizzle Kit`](https://orm.drizzle.team/kit-docs/overview) for automatic SQL migrations and prototyping.

    To run the migrations for PostgreSQL, run the following command:

    ```bash
    pnpm generate-migrations:postgres
    ```

    This will generate the SQL migrations, as well as migrations metadata files in the `./src/lib/drizzle/postgres/migrations/data` directory.

    You can now run the following command to push the migrations to the database:

    ```bash
    pnpm migrate:postgres
    ```

    In the early stage of development or when you're at the prototyping stage, you can directly update the database schema and run the following command to directly push the schema changes to the database:

    ```bash
    pnpm push:postgres
    ```

6.  **Setup MailHog for local email testing**

    We use MailHog to send and test emails locally. The boilerplate is configured to automatically send emails to MailHog when running in development mode.

    Check `./src/lib/emails/send.ts` for more details about the implementation.

    We also provide a Docker Compose file to quickly spin up a MailHog container.

    ```bash
    docker-compose -f docker/mailhog.yml up -d
    ```

    The MailHog server will be available at `http://localhost:8025`.

7.  **Run the app**

    ```bash
    pnpm dev
    ```

### Changing the database

This project is configured to use PostgreSQL. If you want to use a different database, you will need to manually change the drizzle config and schema files.

**PS**: We plan to add a central configuration file for the app and a CLI to generate a starter project with the database of your choice.

## 🚀 Key Features

-   **Authentication:** Built with Lucia for secure user authentication.
-   **Database:** Uses Drizzle ORM for type-safe database interactions with PostgreSQL.
-   **Email:** Integrated with Resend for sending emails, with local testing via MailHog.
-   **Testing:** Includes Playwright for end-to-end testing and Vitest for unit testing.
-   **Styling:** Uses Tailwind CSS for a modern and responsive design.
-   **Components:** Leverages Flowbite Svelte for UI components.
-   **Payroll Management:** Core functionality for managing pay cycles, paystubs, and employee information.
-   **Sales Tracking:** Functionality to import and manage sales data.
-   **Employee Management:** Features for managing employee information, notes, and more.
-   **Client Management:** Functionality to manage clients.
-   **User Management:** Functionality to manage users and their roles.
-   **Theme:** Dark mode support.

## 🗺️ Roadmap

KitForStartups is still in the early stages of development. Here is a list of features that we plan to add in the very near future:

-   [x] PostgreSQL support
-   [x] Proper error handling on the client with toast notifications
-   [ ] A central configuration file for the app
-   [ ] Magic link authentication
-   [x] Authorization logic with load functions and hooks
-   [ ] Stripe integration
-   [ ] Lemon Squeezy integration
-   [ ] Mailgun integration
-   [ ] CLI for generating a starter project

# Supabase Migrations

This directory contains the database schema and migrations for the project.

## What are Migrations?

Migrations are a way to manage your database schema in a structured and version-controlled manner. Think of them like `Git` for your database. Instead of manually writing `SQL` queries to create or alter tables, you create migration files. Each file represents a change to the database schema (e.g., adding a table, altering a column).

**Why are they important?**

*   **Version Control:** Your database schema is now part of your codebase and can be versioned with Git.
*   **Collaboration:** Everyone on the team can run the same migrations to have an identical database schema.
*   **Consistency:** Ensures that your local, staging, and production databases all have the same structure.
*   **Rollbacks:** If something goes wrong, you can roll back to a previous version of your schema.

## How to Use

### Local vs. Remote Development

It's important to understand the workflow between your local environment and your remote Supabase project:

1.  **Local Development (`supabase start`):** When you run `supabase start`, the CLI spins up a local instance of Supabase (using `Docker`). You can connect to this local database and make schema changes freely. These changes **do not** affect your remote (cloud) database.

2.  **Generating Migrations (`supabase db diff`):** After making changes to your local database, you run `supabase db diff -f <migration_name>` to generate a new migration file. This file contains the `SQL` commands needed to replicate your local changes.

3.  **Applying to Remote (`supabase db push`):** The `supabase db push` command is what applies these migration files to your remote Supabase database. It reads the migration files in your `supabase/migrations` directory and executes them in order, bringing your remote database schema in sync with your local changes.

---

1.  **Install the Supabase CLI:**
    If you haven't already, install the Supabase CLI on your local machine.
    ```bash
    npm install -g supabase
    ```

2.  **Link Your Project:**
    Navigate to the `supabase` directory in your terminal and link it to your remote Supabase project. You will need your project reference ID, which you can find in your Supabase project's dashboard URL (`https://app.supabase.com/project/YOUR_PROJECT_ID`).
    ```bash
    supabase link --project-ref YOUR_PROJECT_ID
    ```

3.  **Apply Migrations:**
    To apply all pending migrations to your remote database, run the following command:
    ```bash
    supabase db push
    ```

4.  **Creating New Migrations:**
    When you make changes to your local database schema (e.g., using `supabase start` and modifying the local database), you can create a new migration file by running:
    ```bash
    supabase db diff -f your_migration_name
    ```
    This will generate a new `SQL` file in the `supabase/migrations` directory. You can then commit this file to version control.

## Common Issues and Resolutions

### Migration Conflicts

**Problem:** You run `supabase db push` and get an error message about a conflict. This usually happens if someone has made manual changes to the remote database schema through the Supabase Studio (the web interface).

**Resolution:**

1.  **NEVER** make schema changes directly in the Supabase Studio for a project managed with the CLI.
2.  If a conflict occurs, you'll need to resolve it manually. The safest way is to:
    *   Pull the remote schema changes into a new migration file:
        ```bash
        supabase db remote commit
        ```
    *   This will create a new migration file that represents the changes made in the Studio.
    *   Review this new migration file and decide if you want to keep those changes.
    *   If you want to overwrite the remote changes with your local schema, you can reset the remote database to a specific migration:
        ```bash
        supabase db reset --local
        ```
        Then, push your local migrations again:
        ```bash
        supabase db push
        ```
        **WARNING:** `db reset` can be destructive. Make sure you have backups of your data.

### "Failed to establish a new connection"

**Problem:** You see this error when running a Supabase CLI command.

**Resolution:**

*   Ensure that `Docker` is running on your machine. The Supabase CLI uses `Docker` to run a local instance of `PostgreSQL`.
*   Run `supabase start` to ensure the local Supabase services are running.

## Example Migration

A migration file is simply a `.sql` file with a timestamped name, located in the `supabase/migrations` directory. Here is an example of what a migration to add a `status` column to a `todos` table might look like:

```sql
-- supabase/migrations/20231027123456_add_status_to_todos.sql

ALTER TABLE todos
ADD COLUMN status TEXT NOT NULL DEFAULT 'incomplete';
```

For more detailed information and advanced use cases, please refer to the [official Supabase documentation on migrations](https://supabase.com/docs/guides/database/migrations).
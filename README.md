## Getting Started

1. **Navigate to the project directory**:
   Replace `<path to /cannabizelite-automation-tests folder>` with the actual path to your project folder.

   ```bash
   cd <path to /cannabizelite-automation-testss folder>
   ```

2. **Install Dependencies**:
   Run the following command to install necessary dependencies.

   ```bash
   npm install
   ```

## Running Tests

Use the following commands to open and run your Cypress tests in different environments:

- **To open Cypress in the development environment and run test individually:**

  ```bash
  npm run cy:open_test --env=dev
  ```

- **To open Cypress in the staging environment and run test individually:**

  ```bash
  npm run cy:open_test --env=staging
  ```

- **To run tests in the development environment:**

  ```bash
  npm run cy:run_test --env=dev
  ```

- **To run tests in the staging environment:**

  ```bash
  npm run cy:run_test --env=staging
  ```

  NOTE: The test will run in dev environment by default when env value is not passed

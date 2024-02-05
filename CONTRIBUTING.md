Contributions to ScienceHub are highly encouraged and greatly appreciated. Whether you've found a bug, have a feature in mind, or see a need for documentation improvements, your input is valuable. We will soon add a roadmap covering the most pressing issues to work on, as well as our long-term goals.

## Github Workflow
1. Fork and fetch the repository: https://github.com/TudorOrban/ScienceHub.
2. Create a branch for your work with a suggestive name, eg `feature-add-x`.
3. Make your changes in your branch, keeping commits small and focused. Aim for clear commit messages that explain the "why" behind your changes.
4. Submit a pull request (PR) to the main repository once you're ready to share your contributions. Describe the changes you've made and any additional context that might help the review process.

## Get started developing
1. Ensure you have a newer version of Node.js installed and run from main `npm install`.
3. Still from main: `npm run dev` (development mode) or `npm run build`, `npm run start` (production mode).
3. For certain functionalities, such as creating projects, you will need the .NET backend compiled and running.
4. Until we head into production, there is no need to configure the database connection, the app will directly make calls to Supabase's API. You can check out and work with the schema using the dump in database/schema. If you wish to make changes to the schema, place an sql file in database/migrations/proposals and include it in your pull request.

## Style guides
We aim to maintain a clean and consistent codebase. Detailed style guides will be added soon. In the meantime, please adhere to the following general principles:

- Follow existing code conventions in the project.
- Use clear and descriptive names for variables, functions, and classes.
- Comment your code where necessary to explain complex logic.

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all participants to adhere to our Code of Conduct. Please read [Code of Conduct](link-to-code-of-conduct) to understand what behaviors will not be tolerated.

## Reporting Bugs or Requesting Features

### Bugs
If you encounter a bug, please report it to us by opening an issue. Provide as much detail as possible, including steps to reproduce the bug and any error messages or screenshots.

### Feature Requests
We welcome suggestions for new features. If there's something you'd like to see added to ScienceHub, please open a new issue, describe your idea, and explain how it would benefit users.

## Community and Support

Join our community on [Slack]! It's a place for discussions, questions, and connecting with other contributors. Whether you need help getting started, have a question about a feature, or want to share ideas, our chat server is the place to be.

- [Join our Slack workspace](slack-invite-link)

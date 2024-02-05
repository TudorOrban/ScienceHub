# ScienceHub
ScienceHub is an open-source, non-profit, community-driven project aiming to provide a unified platform for sharing, exploring, managing and discussing scientific research.

# Features
There are three main categories of features: **Research**, **Management** and **Community**.

### Research
**Works** are the basic blocks of scientific research. They can be **Papers**, **Experiments**, **Datasets**, **Data Analyses**, **AI Models** or **Code Blocks**. These can be organized into **Projects**, for unified management and visibility.

### Management
Projects and works are updated through a custom [version control system](https://github.com/TudorOrban/ScienceHub/blob/main/main/version-control-system/README.md) built from scratch to accommodate the needs of the website. **Submissions**, akin to git commits, are blocks holding changes between project or work versions. There are also **Issues** and (Community) **Reviews**.

### Community
This includes real-time **Discussions** and **Chats**, as well as **Team** management.

These features show up throughout the main page directories:
- **Workspace**: A comprehensive space through which the user can manage their work.
- **Browse**: A unified space for browsing ScienceHub data.
- Other: **Profile** pages, **Project** pages, **Resources**

For an in-depth look at these features and our motivations for introducing them, see the Resources pages within the website.

# Information
### Core Stack
- Next.js 14 (with Typescript, App Router), Supabase (PostgreSQL), .NET

### Status
In late stages of development, though significant more work is necessary to bring into production.

### Quickstart
To use the website, run the [Docker Image here](https://hub.docker.com/repository/docker/tudoraorban/sciencehub/general).
To get developing:
1. Fork and fetch the repository
2. Ensure you have Node.js installed and run from main `npm install`
3. Still from main: `npm run dev` (development mode) or `npm run build`, `npm run start` (production mode).

### Contributing
ScienceHub is an open-source project and any community contributions are most welcomed. See [CONTRIBUTING.md](https://github.com/TudorOrban/ScienceHub/blob/main/CONTRIBUTING.md).
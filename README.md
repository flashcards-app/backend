# flashcards-backend

## Getting Started

- [Running the project](.github/docs/running-the-project.md)

## Contributing

Feel free to submit PRs for small issues. For large issues or features, open an issue first.

### Option 1 - Simple Typo Fixes

For small issues, like a typo or broken link, use Github's inline file editor or web editor (open by pressing <kbd>.</kbd> in your fork's code tab) to make the fix and submit a pull request.

### Option 2 - Work on your own Fork

For more complex contributions, like new features, you should work on the project on your local system.

First, follow the steps in [Running the project](.github/docs/running-the-project.md).

```shell
git checkout -b my-fix
# fix some code / add feature...

git commit -m "fix: corrected a typo"
git push origin my-fix
```

Lastly, open a pull request on GitHub. Once merged, your changes will automatically be deployed to the live site via the CI/CD pipeline.
## Scripts

- ```npm run dev```: Run the server in development mode
- ```npm run build```: Build the server for production:
- ```npm run start```: Start the server in production mode:
- ```npm run test```: Run Tests:
- ```npm run docker:prod```: Build and run the docker image for production.
- ```npm run docker:dev```: Build and run the docker image for development - required for development, to have a MongoDB
  server.


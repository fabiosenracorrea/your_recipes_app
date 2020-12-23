[![Netlify Status](https://api.netlify.com/api/v1/badges/5df1d320-d121-4e44-bc97-e96455cd0a3b/deploy-status)](https://app.netlify.com/sites/quirky-panini-58efa6/deploys)

# Your recipes app

This application uses 2 public APIs to gather info about [food recipes](https://www.themealdb.com/) and [cocktails](https://www.thecocktaildb.com/) to serve you a complete "recipe website" experience, where you can browse through every recipe available on these APIs, check their info, start to cook them with an interactive completion screen and favorite and share those that you like!

[Check it out](https://quirky-panini-58efa6.netlify.app/)

## Fake login

As this application is more of a concept, the app has a fake login and register pages, where the user has only the need to type in a valid email and a password with at least 7 characters to 'get in'. The ideia here is to present a design.

## Into de app

The whole application is glued together strongly with React's [context API](https://reactjs.org/docs/context.html) and custom hooks. The main idea here is to develop more and more features tied to these fundamental concepts while still delivering the website in it's minimalist version. Notice how we don't have complex animations or element disposition on screen. The main goal here is to present a simple and working recipes app for your kitchen adventures.

### Typescript support

This application is currently in the process of migration to [Typescript](https://www.typescriptlang.org/). You can check it's pull request to review the code migration. The merge will happen as soon as compatibility between React Scripts, Jest & etc are sorted out to production state.

### Feedback

As this is a project that should be constantly evolving, if you do have any questions or suggestions, please, send them in! I'll be more than happy to correct or improve anything!

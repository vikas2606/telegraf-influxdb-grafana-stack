
# Frontend

React application to showcase the grafana,custom D3 graphs and integration with keycloak


## Technologies used

 - [React](https://reactjs.org/) application
 - Routing done using [React Router](https://www.bing.com/ck/a?!&&p=6dd7ca477e17a956JmltdHM9MTY4MjU1MzYwMCZpZ3VpZD0xY2MzYjI5My0zYTE1LTZkYzYtMzJhZS1hMTkzM2JlMjZjOGImaW5zaWQ9NTE4OQ&ptn=3&hsh=3&fclid=1cc3b293-3a15-6dc6-32ae-a1933be26c8b&psq=react+router&u=a1aHR0cHM6Ly9yZWFjdHJvdXRlci5jb20v&ntb=1)
 - State management via [Redux](https://redux.js.org/)
 - Styling using [Tailwind](https://tailwindcss.com/docs/guides/create-react-app)
 - Popups from [React-hot-toast](https://tailwindcss.com/docs/guides/create-react-app)
- XMLHttpRequests to backend using [axios](https://www.bing.com/ck/a?!&&p=74090056fa73b4cbJmltdHM9MTY4MjU1MzYwMCZpZ3VpZD0xY2MzYjI5My0zYTE1LTZkYzYtMzJhZS1hMTkzM2JlMjZjOGImaW5zaWQ9NTE5OQ&ptn=3&hsh=3&fclid=1cc3b293-3a15-6dc6-32ae-a1933be26c8b&psq=axios&u=a1aHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvYXhpb3M&ntb=1)
- D3 graphs from [Victory](https://formidable.com/open-source/victory/) library
- Websockets from [websocket](https://www.npmjs.com/package/websocket)

- This app was bootstraped based on the template provided by [create-react-app](https://github.com/facebook/create-react-app)
## Deployment

1.clone the repository and change directory to /frontend/myapp/

```bash
  cd /frontend/myapp/
```

2.Install the dependencies

```bash
npm install
```

3.Run the frontend application locally

```bash
npm run start
```

4.For building the application(Optional)
```bash
npm run build
```
## Environment Variables

To run this project, you will need to modify the following environment variables to your .env file

- Backend url : `REACT_APP_GOCLOAK_URL`
- Keycloak realm: `REACT_APP_GOCLOAK_REALM` 
- grafana url: `REACT_APP_GRAFANA_URL`




## Features

- Light/dark mode toggle
- Grafana Dashboard
- D3 graphs with multiaxis brush and zoom
- KeyCloak integration
- Live data stream through websockets





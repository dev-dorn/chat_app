# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
Frontend Chat Application
Overview
This is the frontend part of the chat application built with React. It allows users to connect to a WebSocket server, send and receive public and private messages, and handle user sessions.

Features
User registration and connection to the WebSocket server.

Public chatroom for all users.

Private messaging between users.

User status updates for joining and leaving the chat.

Prerequisites
Node.js(v14 or later)
```
npm or yarn
```
Installation
Clone the repository:
```
sh
git clone https://github.com/dev-dorn/chat_app.git
cd chat_app/frontend
```
Install dependencies:

Using npm:
```
sh
npm install
```
Or using yarn:

```
sh
yarn install
```
Usage
Start the development server:

Using npm:
```
sh
npm start
```
Or using yarn:
```
sh
yarn start
```
Access the application:

Open your browser and go to http://localhost:5173.

Configuration
Ensure that the backend server is running and accessible at http://localhost:8080. The frontend application connects to this backend for WebSocket communication.

File Structure
plaintext
```
frontend/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── MessageArea.jsx
│   ├── App.js
│   ├── index.js
├── package.json
├── README.md
Components
```
MessageArea: Handles the connection, registration, and messaging functionalities.

App: Main component that integrates all the sub-components.

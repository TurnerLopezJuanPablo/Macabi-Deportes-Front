# Macabi-Deportes / Asistencias - Front-End

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
### About the project

The software was developed as the final project for the systems analyst career, involving five people, including myself. The project aimed to create a system for tracking attendance of Macabi's members. The application features a login system and password recovery for secure and proper use by users.
Macabi has sports, each with its own category where different members are registered. In each category, dates and attendance of each member can be managed for better tracking of each student.

> [!TIP]
>  **See the documentation here: [Manual de Usuario - Macabi Asistencias.pdf](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/Manual%20de%20Usuario%20-%20Macabi%20Asistencias.pdf). (Only spanish)**

> [!IMPORTANT]
> The app supports all types and sizes of screens, meaning it is responsive.

> [!NOTE]
> Images of the developed app:

#### Npm packages
- @vitejs/plugin-vue@4.4.0
- axios@1.6.1
-  bootstrap@5.3.2
-  moment@2.29.4
-  pinia@2.1.7
-  vite@4.5.2
-  vue-router@4.2.5
-  vue@3.3.4

### Steps to Set Up and Run the Project:

1. Run `npm i` or `npm install` in the <img alt="Visual Studio Code" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" style="padding: 15px;" /> Visual Studio Code terminal.
2. Navigate to `config/config.js` and set the URL you will use with the project's API: [Macabi-Deportes-API](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-API). For example:
```sh
const apiUrl = 'http://localhost:8080';
export default apiUrl
```
3. Execute `npm run dev` in the terminal to launch the project locally.
4. You will also need to have the other project running on your machine for the application to function properly. [Macabi-Deportes-API](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-API)


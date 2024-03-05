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
# About the project

The software was developed as the final project for the systems analyst career, involving five people, including myself. The project aimed to create a system for tracking attendance of Macabi's members. The application features a login system and password recovery for secure and proper use by users.
Macabi has sports, each with its own category where different members are registered. In each category, dates and attendance of each member can be managed for better tracking of each student.

> [!TIP]
>  **See the documentation here: [Manual de Usuario - Macabi Asistencias.pdf](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/Manual%20de%20Usuario%20-%20Macabi%20Asistencias.pdf). (Only spanish)**

> [!IMPORTANT]
> The app supports all types and sizes of screens, meaning it is responsive.

> [!NOTE]
> Images of the developed app:

### Main Page
![Main Page](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(2).png)

### User Details
![User Details](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(3).png)

### Update Password
![Update Password](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(4).png)

### Users List
![Users List](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(5).png)

### User Details
![User Details](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(6).png)

### Members List
![Members List](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(7).png)

### Member Details 1
![Member Details 1](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(8).png)

### Member Details 2
![Member Details 2](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(9).png)

### Emergency numbers
![Emergency numbers](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(10).png)

### Update Emergency numbers
![Update Emergency numbers](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(11).png)

### Create Emergency numbers
![Create Emergency numbers](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(12).png)

### Sports List
![Sports List](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(13).png)

### Categories Data 1
![Categories Data 1](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(14).png)

### Categories Data 2
![Categories Data 2](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(15).png)

### Category Details 
![Categories Data](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(16).png)

### Category Details - Modifying teachers
![Category Details - Modifying teachers](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(17).png)

### Dates List 1
![Dates List 1](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(18).png)

### Dates List 2
![Dates List 2](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(19).png)

### Create Date
![Create Date](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(20).png)

### Taking attendance
![Taking attendance](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-Front/blob/main/SoftwareMacabiImages/SoftwareMacabi%20(1).png)

## Npm packages
- @vitejs/plugin-vue@4.4.0
- axios@1.6.1
-  bootstrap@5.3.2
-  moment@2.29.4
-  pinia@2.1.7
-  vite@4.5.2
-  vue-router@4.2.5
-  vue@3.3.4

# Steps to Set Up and Run the Project:

1. Run `npm i` or `npm install` in the <img alt="Visual Studio Code" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" style="padding: 15px;" /> Visual Studio Code terminal.
2. Navigate to `config/config.js` and set the URL you will use with the project's API: [Macabi-Deportes-API](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-API). For example:
```sh
const apiUrl = 'http://localhost:8080';
export default apiUrl
```
3. Execute `npm run dev` in the terminal to launch the project locally.
4. You will also need to have the other project running on your machine for the application to function properly. [Macabi-Deportes-API](https://github.com/TurnerLopezJuanPablo/Macabi-Deportes-API)


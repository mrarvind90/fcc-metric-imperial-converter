[![freeCodeCamp Social Banner](https://s3.amazonaws.com/freecodecamp/wide-social-banner.png)](https://www.freecodecamp.org/)

<p style="text-align: center">
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5"><img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/></a>
  <a href="https://www.w3.org/Style/CSS/Overview.en.html"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/></a>
  <a href="https://getbootstrap.com/"><img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="Javascript"/></a>
  <a href="https://nodejs.org/en"><img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" /></a>
  <a href="https://npmjs.com"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="NPM" /></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" /></a>
  <a href="https://mochajs.org"><img src="https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white" alt="Mocha" /></a>
  <a href="https://www.chaijs.com"><img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white" alt="Chai" /></a>
  <a href="https://eslint.org"><img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" /></a>
  <a href="https://prettier.io"><img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" alt="Prettier" /></a>
</p>

# Simple Unit Converter

A full-stack unit converter web application that allows users to convert units between different measurement systems. This application is designed to convert gallons (gal), miles (mi), and pounds (lbs) to liters (L), kilometers (km), and kilograms (kg), and vice versa.

## Technologies Used

- **Client Side:**
    - HTML: Provides the structure of the web pages.
    - CSS with Bootstrap: Adds styling and responsive design to the user interface.
    - Vanilla JavaScript: Implements the client-side functionality for unit conversion.

- **Server Side:**
    - Node.js: Provides the runtime environment for the server.
    - Express.js: A web application framework for handling routes and requests on the server.

- **Testing:**
    - Mocha: A testing framework for writing unit tests.
    - Chai: An assertion library used in conjunction with Mocha for making test assertions.

## Features

- Conversion between different units:
    - Gallons (gal) to Liters (L)
    - Miles (mi) to Kilometers (km)
    - Pounds (lbs) to Kilograms (kg)
    - And vice versa

## Running the application

To run the express application, do follow the following steps

1. Clone the repo:
   ```git
   git clone git@github.com:mrarvind90/fcc-metric-imperial-converter.git
   ```
2. Navigate to the repository:
    ```shell
    cd <repository_directory>
    ```
   Change <repository_directory> to the name of the cloned directory.
3. Install Dependencies:
    ```shell
    npm install
    ```
   This command will install all the necessary dependencies for the application.
4. Configure Environment Variables: Rename the .env.sample file in your project directory to .env and update it with the
   relevant credentials:
    ```shell
     cp .env.example .env
    ```
5. Choose Your Run Mode:<br>
    - Development Mode (with automatic code reload):<br> To run the application in watch mode, enabling seamless source
      code changes without manual server restarts, use the following command:
    ```shell
     npm run dev
    ```
    - Standard Server Mode:<br> If you prefer to simply run the server without automatic code reloading, you can use the
      following command:
    ```shell
     npm run start
    ```
6. Running the tests
   - You can run unit tests for the application using Mocha and Chai. To run the tests, use the following command:
    ```bash
    npm run test
    ```

## Future Improvements

While developing this project, there are several areas I plan to focus on for enhancements and refinements
which can be found on [GitHub](https://github.com/mrarvind90/fcc-metric-imperial-converter/issues).
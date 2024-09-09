# Webflix (A Fullstack entertainment web application)
## Overview
Webflix is a fullstack entertainmet application with a REST API that allows users to browse, search, and manage their favorite and latest movies and TV series. This application provides unique experience to users by enabling them to create their profiles and upload their avatar and also add or remove bookmarks.
## Table of contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Demo
Check out the demo of the app on YouTube: [Webflix App Demo](https://youtu.be/wYcSF2e1Quw?si=jLUfO44nbmQ30Nay)

## Features
- Browse a vast collection of movies and TV series using an infinite scrolling feature.
- Search for movies or TV series by title or genre.
- View details page for cast and website information of the selected movie or TV series.
- User authentication and authorization.
- User-friendly UI and responsive design.
- Secure storage and processing of user data.
- Create and manage a personal watchlist by adding or removing bookmarks.
- RESTful API.

## Tech Stack 

### Frontend
1. React- As The Frontend Library
2. Vite - As The Build Tool For Development And Production Builds
3. Redux/Redux Toolkit - As The State Management Library
4. React-Router-Dom - As The Routing Library For Routing Between Pages In The App
5. Tailwind CSS - For Styling Of Components and Responsive Design

### Backend
1. Node js - Javascript runtime envirnment for backend development.
2. Express js - Node js web framework to design web server application and api.
3. Json Web Token(JWT)- An open standard used to share security information between two parties — a client and a server.

### Database
1. TMDB using API key
2. MongoDB- A NoSQL database to store user related information.

### API
- TMDB through API key.
- MongoDB - A NoSQL database to store user related information.

## Installation

### Clone the repository:
```bash
git clone https://github.com/anurag-developer1/Webflix
cd Webflix
```
### Install dependencies:

#### Install backend dependencies
```bash
cd Webflix-backend
npm install 
```
### Install frontend dependencies
```bash
cd ../Webflix-frontend
npm install  
```
### Set up environment variables:
Create a .env file in the backend directory and add necessary environment variables (e.g., database connection string, API keys).
### Start the application:
#### Start the backend server
```bash
cd ../Webflix-backend
npm start  
```
#### Start the frontend development server
```bash
cd ../Webflix-frontend
npm run dev  
```

## API Documentation
API Documentation Link: [https://documenter.getpostman.com/view/35021063/2sAXjNXqd9](https://documenter.getpostman.com/view/35021063/2sAXjNXqd9)


## Contributing
We welcome contributions to Webflix. If you have any questions or suggestions for improvements, please open an issue or submit a pull request.
## License
This project is currently unlicensed. We are still determining the most appropriate license for this project. For now, all rights are reserved, and the code is not open for general use, modification, or distribution without explicit permission.
## Contact
Anurag - anuraagshrivastav202@gmail.com

Project Link: [https://github.com/anurag-developer1/Webflix](https://github.com/anurag-developer1/Webflix)

For any questions, suggestions, or discussions about the WebFlix App, feel free to reach out or open an issue on GitHub.

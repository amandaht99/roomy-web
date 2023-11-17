# Roomy - Home Swapping Application

![Alt text](/public/images/roomylogo.png)

Roomy is a web application designed to connect individuals who wish to swap their homes for vacation purposes. The idea is simple: instead of spending money on hotels or Airbnb, users can swap their homes with each other, saving costs and immersing themselves in a new culture as locals, not tourists. Our motto is "Travel More, Spend Less".

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Use Cases](#use-cases)

## Project Description

Roomy is a platform where users can swap their homes with others for a specified period. The application aims to provide a cost-effective and authentic travel experience by allowing users to live like locals in a new city or country. It offers global access, a trusted community, and an alternative to expensive rentals.

## Tech Stack

Roomy is built with the following technologies:

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Next.js](https://nextjs.org/) - A React framework for production-grade applications
- [Chakra UI](https://chakra-ui.com/) - A simple, modular and accessible component library for React
- [Framer Motion](https://www.framer.com/api/motion/) - A production-ready motion library for React
- [Axios](https://axios-http.com/) - A promise-based HTTP client for the browser and node.js
- [React Hook Form](https://react-hook-form.com/) - Efficient, flexible and extensible forms with easy-to-use validation
- [React DatePicker](https://reactdatepicker.com/) - A simple and reusable datepicker component for React
- [Clerk](https://clerk.dev/) - User authentication and management for developers

## Architecture

![Roomy web architechture diagram](/public/images/image.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm - Download and install [here](https://nodejs.org/en/download/).

# Installation

## 1. Get a local copy of the project

Run `git clone https://github.com/amandaht99/roomy-web` in the folder where you want to clone the project.

## 1. Setup the Frontend

Duplicate the `.env.example` file and rename it to `.env`

Run `npm i` to install all dependencies

Create a Clerk account and get the publishsble and the secret key and place them in the .env file

## 2. Setup the backend

Run `git clone https://github.com/ZinoM21/roomy` in the folder where you want to setup the backend.

Navigate to the server with `cd server`

Duplicate the `.env.example` file and rename it to `.env`

Run `bun i` to install all dependencies

## 3. Setup the database with a docker container

1. **Check if port 5432 is occupied:**
      1. Check all running ports with `sudo lsof -i :5432`
      2. Kill all ports that are shown with `sudo kill <PID>` </br> </br>
2. Set **up the PostgreSQL Docker container:**
      1. Make sure you have docker installed on your local machine.
      2. Open a terminal or command prompt and run the following command to pull the PostgreSQL Docker image: **`docker pull postgres`**.
      3. Once the image is downloaded, start a new container with the following command: **`docker run --name <DOCKERNAME> -e POSTGRES_PASSWORD=<YOURPASSWORD> -p 5432:5432 -d postgres`** </br> </br>
      4. Check if the container is running using the command: **`docker ps`**.
3. **Update Prisma Client to use the test database:**
      1. Update the **`DATABASE_URL`** value in the backend's `.env` file to point to the new test database: **`DATABASE_URL=postgres://postgres:<YOURPASSWORD>@localhost:5432/postgres`** </br> </br>
      2. Apply the migration to the new defined database: **`bunx prisma migrate dev`**.
         1. this should generate a new prisma client, if it did not run **`npx prisma generate`**
      3. If your server was running before, restart your server to pick up the new **`DATABASE_URL`** value. </br> </br>
4. **_Optional:_ Setting up pgAdmin:**
      1. Under Dashboard, in the “Quick Link” Section, click the "Add New Server" button to create a new server connection.
      2. Enter a name for the server and switch to the "Connection" tab.
      3. In the "Host name/address" field, enter **`localhost`**.
      4. In the "Port" field, enter **`5432`**.
      5. In the "Username" field, enter **`postgres`**.
      6. In the "Password" field, enter the password you used when starting the container.
      7. Click the "Save" button to save the server connection. You should now be able to see the new server listed in the pgAdmin dashboard </br> </br>

## 4. Start the project

1. Make sure your database is running in the docker container. </br> </br>
2. Start the backend Elysia / Bun server by running `bun dev` in `roomy/server`</br> </br>
3. Start the frontend NextJS server by running `npm run dev` in `roomy-web`

## Use Cases

- User registration and authentication
- Listing and browsing of available homes
- Filtered search of possible swaps
- Requesting and managing home swaps
- User profile and preferences management

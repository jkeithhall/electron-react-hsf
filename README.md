# PICASSO - Horizon Simulation Framework builder

## About Picasso

Picasso is an application that allows users to create and manage the parameters for a Horizon Simulation Framework (HSF) simulation.

## About Horizon Simulation Framework

The Horizon Simulation Framework (HSF) is a modeling and simulation framework developed by Eric Mehiel and his merry band of students at Cal Poly, San Luis Obispo. The HSF was originally developed to model and simulate the operation of complex space-based systems for the Aerospace Industry. The HSF takes a model of the system, constraints and dependencies, and a set of tasks as inputs and generates the state data of the system over a given time period. The data generated can be used to analyze the "Day In The Life" (DITL) of the system for system-level requirements verification.

## How to Use PICASSO (Development Mode)

First, check your Node and .NET versions using

### `node --version`
### `dotnet --version`

Make sure you have installed [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) and the latest version of [Node.js](https://nodejs.org/):

Next, pull down the latest changes:

### `git pull origin main`

(Optional: If you have previously run simulations using older versions of the project, you may need to store any previous output data and then delete the contents of /Horizon/output, as the API for the simulation output files may have changed.) Next, install the dependencies:

### `npm install`

A postinstall script will ensure you are using the latest committed version of Horizon and rebuild the simulation output directory (/Horizon/output). To start the app:

### `npm run electron:serve`

# Calendar App (Client and Server)
## Created by Jasraj Singh

This project is a full-stack calendar application with a responsive full-screen monthly view, allowing users to create and manage events. The project is divided into two parts:
- **Client**: Contains HTML, CSS, and JavaScript for the front-end (no dependencies).
- **Server**: An ASP.NET Core 8 API with JWT authentication, handling login, registration, and event CRUD operations. The server stores events in a PostgreSQL database.

## Features
- **Responsive Calendar**: Navigate through a monthly calendar view that adjusts to different screen sizes.
- **Event Creation**: Click on any day to open a modal and add an event.
- **Dynamic Updates**: Events are displayed dynamically in both the modal and calendar view.
- **Event Deletion**: Users can delete events via a delete button, which sends a request to the API and updates the UI.
- **JWT Authentication**: Secures API endpoints.

## Prerequisites
Before you can run this project, ensure you have the following installed on your machine:
- **Visual Studio 2022** (or any compatible version)
- **PostgreSQL**
- **.NET 8 SDK** or higher

## Setting Up the Project

### 1. Cloning the Repository
First, clone the repository from GitHub:

```bash
git clone https://github.com/FrodoWood/CalendarApp.git
```
### 2. Setting Up the Backend (ASP.NET Core API)

#### Opening the Project
- Open the **Server** folder in Visual Studio.
- In Visual Studio, click on `File > Open > Project/Solution`.
- Select the **Server** folder and open the `.csproj` file.

#### Restoring NuGet Packages
When you open the project in Visual Studio, all required NuGet packages (including EF Core, JWT, etc.) will be automatically restored. If not, right-click on the solution and select `Restore NuGet Packages`.

#### Setting Up the Database
1. Open `appsettings.json` inside the **Server** folder.
2. Locate the `ConnectionStrings` section and set the connection string to point to your local PostgreSQL database:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=your_db_name;Username=your_username;Password=your_password"
}
```
Replace `your_db_name`, `your_username`, and `your_password` with your PostgreSQL credentials.

4. Database Migrations: Once the database connection is set up:

- Open the Package Manager Console in Visual Studio (found under `Tools > NuGet Package Manager > Package Manager Console`).
- Run the following commands to create and apply the database migrations:
```bash
update-database
```
5. Running the API: Press F5 or click the Run button in Visual Studio to start the ASP.NET API. The API will be hosted on https://localhost:7271/ by default, with Swagger UI enabled for testing API endpoints.

### 3. Setting Up the Frontend (Client)
The frontend requires no additional setup. You can simply open the calendar.html file in your browser to view the calendar.
- Navigate to the `Client` folder.
- Open the `calendar.html` file in any modern browser.

### 4. Testing the Application
1. Login/Register:

- First, use the login/register forms (located in the `auth.html` file) to authenticate and get a JWT token from the backend API.
- Once logged in, the token will be stored in the browser and used for making authenticated API requests (such as creating, retrieving, or deleting events).
2. Using the Calendar:

- Open the `calendar.html` file in your browser.
- Click on any day to create an event.
- The event will be sent to the API and stored in the PostgreSQL database.
- Events are dynamically displayed in the calendar view and single day view after successful creation.
3. Event Deletion:

- Click the delete button next to any event to remove it. The event will be deleted both from the UI and the PostgreSQL database.
### Project Structure
- Client/: Contains HTML, CSS, and JavaScript for the front-end.
    - calendar.html: Main calendar page.
    - auth.html: Login and registration page.
    - calendar.css: Styles for the calendar and modal.
    - calendar.js: Contains all JavaScript logic for the calendar, modals, and event interactions.
    - auth.js: Contains all JavaScript logic for login and registering as a new user.
- Server/: Contains the ASP.NET Core API project.
    - Controllers/: Contains the EventsController and AccountController for managing events and authentication.
    - Models/: Contains models for Event and User.
    - Data/: Contains the database context.
    - Migrations/: Contains the migrations files.
### Troubleshooting
- Database Connection Issues: Make sure PostgreSQL is running, and that the database connection string in appsettings.json is correct.
- JWT Token Issues: Ensure the API correctly returns the JWT token upon login, and that it is stored in local storage for subsequent authenticated requests.
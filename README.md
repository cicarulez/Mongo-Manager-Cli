# MongoDB User Management and Data Export Script

This Node.js application facilitates MongoDB database operations such as user management and data export. It provides an interactive CLI for creating, deleting, and updating user passwords (which are securely salted and hashed using `bcrypt`), as well as exporting and listing data from a MongoDB collection, including exporting data to Excel using an external API.

---

## Features

### 1. **User Management**
- **Create User**: Add new users to the database. Passwords are securely salted and hashed using `bcrypt` before storage.
- **Delete User**: Remove users from the database.
- **Change Password**: Update passwords for existing users. New passwords are securely salted and hashed using `bcrypt` before being updated in the database.
- **List Users**: Display all registered users.

### 2. **Export Options**
- **Export Data**: Export all documents from a specified collection into a JSON file.
- **Export Data to Excel**: Export all documents from a specified collection to an Excel file using an external API (optional; requires additional repository).
- **Export Data**: Export all documents from a specified collection into a JSON file.
- **Export Data to Excel**: Export all documents from a specified collection to an Excel file using an external API.
- **List Exported Files**: View all previously exported files in the `exports` directory.

### 3. **Settings**
- **Modify User Collection**: Change the name of the MongoDB collection used for user data.
- **Modify Data Collection**: Change the name of the MongoDB collection used for exporting data.

---

## Requirements

- **Node.js**: Version 14 or higher.
- **Excel Export Dependency** (optional): If you want to enable Excel export, ensure you set up the external API from the repository [Excel-JSON-Converter-API](https://github.com/cicarulez/Excel-JSON-Converter-API).
- **MongoDB**: Connection URI with a placeholder `<password>` for secure integration.
- **Environment Variables**:
    - `MONGO_URL`: MongoDB connection URI.
    - `DATA_COLLECTION_NAME`: Name of the data collection to export.
    - `USER_COLLECTION_NAME`: Name of the user collection for user management.
    - `ENABLE_EXCEL_EXPORT`: Enable or disable the Excel export feature (`true`/`false`).
    - `CONVERTER_API_URL`: The API endpoint for converting JSON data to Excel.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cicarulez/mongo-manager/
   cd src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
    - Create a `.env` file in the root of the project with the following variables:
      ```env
      MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
      DATA_COLLECTION_NAME=data_collection_name
      USER_COLLECTION_NAME=user_collection_name
      ENABLE_EXCEL_EXPORT=true
      CONVERTER_API_URL=http://localhost:3000/api/files/convertJsonToExcel
      ```
    - Replace `<username>`, `<password>`, `data_collection_name`, and `user_collection_name` with your MongoDB credentials and collection names.

4. Run the application:
   ```bash
   npm run start:dev
   ```

---

## Docker Setup

### Building and Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t mongo_manager_image .
   ```
2. Run the container:
   ```bash
   docker run --tty --interactive --name mongo_manager_app --rm -v exports:/usr/app/exports --env-file envs/.env mongo_manager_image
   ```

### Using Docker Compose
1. Create or edit the `.env` file as described above.
2. Start the application with Docker Compose:
   ```bash
   docker-compose run --rm mongo_manager_app
   ```
3. Access the application logs:
   ```bash
   docker-compose logs -f
   ```

---

## Usage

### Starting the Application
1. When you start the script, you will be prompted to enter your MongoDB password.
2. If the connection is successful, the main menu will be displayed:
   ```
   =============================
   🌐 Main Menu
   =============================
   1. 👤 User Management
   2. 📂 Export Options
   3. ⚙️ Settings
   4. ❌ Exit
   ```

### User Management
- Select **1** to manage users. Submenu options:
    - **Create User**: Enter a username and password to add a new user. After creation, you can opt to add another user by responding **yes**.
    - **Delete User**: Provide a username to delete a user. After deletion, you can delete another user by responding **yes**.
    - **Change Password**: Update an existing user's password. After updating, you can change another password by responding **yes**.
    - **List Users**: View all registered users.

### Export Options
- Select **2** to access the export options submenu:
    - **Export Data**: Export all documents from the specified collection to a JSON file.
    - **Export Data to Excel**: Export all documents from the specified collection to an Excel file using an external API (only visible if `ENABLE_EXCEL_EXPORT=true` and requires the [Excel-JSON-Converter-API](https://github.com/cicarulez/Excel-JSON-Converter-API)).
    - **List Exported Files**: Display a list of previously exported files.

### Settings
- Select **3** to modify collection names:
    - **Modify User Collection**: Change the name of the user collection used in MongoDB.
    - **Modify Data Collection**: Change the name of the data collection used for export.

### Exit
- Select **4** to safely exit the application.

---

## Application Structure

The project is structured into clear, modular components to ensure scalability and maintainability.

### 1. **Services** (`services/`)

Contains core business logic:

- `user-management.service.js`: Handles user creation, deletion, password updates, and listing.
- `data-management.service.js`: Manages data export and lists exported files.
- `excel-export.service.js`: Handles data export to Excel using an external API.

### 2. **CLI** (`cli/`)

Manages the user interface:

- `main-menu.cli.js`: Displays the main menu and handles navigation.
- `user-management.cli.js`: Implements user management operations via CLI.
- `export-options.cli.js`: Implements data export and listing functionality, including Excel export.
- `settings.cli.js`: Provides options to modify collection names via CLI.
- `prompt-user.cli.js`: Handles reusable CLI prompts for user input.

### 3. **Models** (`models/`)

Defines the database schema:

- `user.model.js`: Mongoose schema for the user collection.

### 4. **Database Connection** (`db/`)

- `db.js`: Handles MongoDB connection setup with password integration.

### 5. **Configuration** (`config/`)

- `config.js`: Provides getter and setter methods for managing environment configurations.

### 6. **Utils** (`utils/`)

- `validator.js`: Validates required environment variables before starting the application.

### 7. **Entry Point**

- `main.js`: Starts the application and initializes the main menu.

---

## Keynotes

- **Password Security**: User passwords are securely hashed using `bcrypt` with a salt to ensure high security before being stored or updated in the database.
- **Excel Export**: Allows exporting data to an Excel file via an external API (requires the repository [Excel-JSON-Converter-API](https://github.com/cicarulez/Excel-JSON-Converter-API)), providing an additional format for data usage.
- **Sequential Actions**: During user creation, deletion, or password updates, users can continue performing the same action sequentially by responding with "yes" or "y" to prompts, streamlining repetitive operations.
- **Error Handling**: Proper validation ensures environment variables are set, and MongoDB connection issues are handled gracefully.
- **Interactive CLI**: Designed for ease of use with structured menus, clear prompts, and streamlined workflows.
- **Graceful Shutdown**: The application ensures proper disconnection from MongoDB during shutdown or when receiving termination signals (e.g., `Ctrl+C`).

---

## Example Workflow

1. Start the script and enter the MongoDB password:
   ```bash
   Enter MongoDB password: ********
   ✅ Connected to MongoDB.
   ```

2. Create a new user:
   ```
   👤 User Management
   =============================
   1. 📓 Create User
   2. 🗑 Delete User
   3. 🔑 Change Password
   4. 📋 List Users
   5. ⬅ Back to Main Menu

   Choose an option: 1
   Enter username for new user: testuser
   Enter password for new user: password123
   ✅ User "testuser" successfully created.
   ```

3. Export data to JSON:
   ```
   📂 Export Options
   =============================
   1. Export Data
   2. Export Data to Excel
   3. List Data
   4. ⬅ Back to Main Menu

   Choose an option: 1
   ✅ Data exported to ./exports/data_collection_name_2024-12-11T12-00-00.json
   ```

4. Export data to Excel:
   ```
   📂 Export Options
   =============================
   1. Export Data
   2. Export Data to Excel
   3. List Data
   4. ⬅ Back to Main Menu

   Choose an option: 2
   ✅ Data successfully sent to the external API for Excel conversion.
   ✅ Excel file saved to: ./exports/data_collection_name_2024-12-11T12-00-00.xlsx
   ```

5. Exit:
   ```
   ✅ Exiting...
   ```

---

## Troubleshooting

1. **Error: Missing environment variables**
    - Ensure all required variables (`MONGO_URL`, `DATA_COLLECTION_NAME`, `USER_COLLECTION_NAME`, `ENABLE_EXCEL_EXPORT`, `CONVERTER_API_URL`) are set in the `.env` file.

2. **Error: Failed to connect to MongoDB**
    - Verify that the `MONGO_URL` is correctly formatted and the database credentials are valid.

3. **Error: Collection name cannot be empty**
    - If using the Settings menu, ensure that you provide a valid collection name when prompted.

4. **Error during data export**
    - Check if the `exports` directory is writable and there is sufficient disk space.

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.


# MongoDB User Management and Data Export Script

This script is a Node.js application that facilitates MongoDB database operations such as user management and data export. It provides an interactive command-line interface (CLI) for creating, deleting, and updating user passwords, as well as exporting data from a MongoDB collection.

---

## Features

### 1. **User Management**
- **Create User**: Add new users to the specified user collection.
- **Delete User**: Remove users from the database.
- **Change Password**: Update passwords for existing users.

### 2. **Data Export**
- Export all documents from the specified data collection into a JSON file.

---

## Requirements

- **Node.js**: Version 14 or higher.
- **MongoDB**: Connection URI with a placeholder `<password>` for secure integration.
- **Environment Variables**:
    - `MONGO_URL`: MongoDB connection URI.
    - `DATA_COLLECTION_NAME`: Name of the data collection to export.
    - `USER_COLLECTION_NAME`: Name of the user collection for user management.

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file in the root of the project with the following variables:
     ```env
     MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
     COLLECTION_NAME=data_collection_name
     USER_COLLECTION_NAME=user_collection_name
     ```
   - Replace only `<username>`, `data_collection_name` and `user_collection_name` with your MongoDB credentials and collection name.
   - Please do not replace `<password>`;


4. Run the script:
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
   docker run -d --name mongo_manager_app --env-file .env mongo_manager_image
   ```

### Using Docker Compose
1. Create or edit the `.env` file as described above.
2. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```
3. Access the application logs:
   ```bash
   docker-compose logs -f
   ```
4. Stop the application:
   ```bash
   docker-compose down
   ```

---

## Usage

### Starting the Application
1. Upon starting, you will be prompted to enter your MongoDB password.
2. If the connection is successful, you will see the main menu:
   ```
   =============================
   🌐 Main Menu
   =============================
   1. 👤 User Management
   2. 📂 Export Data
   3. ❌ Exit
   ```

### User Management
- Select **1** to manage users. Submenu options:
    - **Create User**: Enter a username and password to add a new user.
    - **Delete User**: Provide a username to delete the user.
    - **Change Password**: Provide a username and a new password to update the user's credentials.
    - **Back to Main Menu**: Exit to the main menu.

### Data Export
- Select **2** to export data from the specified collection.
- The data will be saved in the script's directory as a JSON file with a timestamped filename.

### Exit
- Select **3** to safely exit the application.

---

## Key Notes

- **Password Security**: User passwords are securely hashed using `bcrypt` before storing in the database.
- **Error Handling**: Validations ensure that required environment variables are set and MongoDB connection issues are logged.
- **Interactive CLI**: Designed for ease of use with clear prompts and structured menus.

---

## Example Workflow

1. Run the script and connect to MongoDB:
   ```bash
   Enter MongoDB password: ********
   ✅ Connected to MongoDB.
   ```
2. Create a new user:
   ```
   👤 User Management
   =============================
   1. 📚 Create User
   2. 🗑 Delete User
   3. 🔑 Change Password
   4. ⬅ Back to Main Menu

   Choose an option: 1
   Enter username for new user: testuser
   Enter password for new user: password123
   ✅ User created successfully.
   ```
3. Export data:
   ```
   📂 Export Data
   =============================
   ✅ Data exported to ./exports/your_data_collection_2024-12-11T12-00-00.json
   ```
4. Exit:
   ```
   ✅ Exiting...
   ```

---

## License
This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

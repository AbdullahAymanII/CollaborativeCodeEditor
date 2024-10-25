
# Collaborative Code Editor

This project is a collaborative code editor, designed to allow multiple users to edit code simultaneously in a shared environment. The editor supports real-time collaboration, syntax highlighting, and multiple programming languages, making it ideal for team projects, educational purposes, and code review sessions.

## Features
- **Real-time collaborative editing:** Users can see each other's changes live.
- **Multi-language support:** The editor supports multiple programming languages with syntax highlighting.
- **Integrated testing and execution environment:** Allows users to compile and run code directly in the editor.
- **Flexible deployment options:** The editor can be deployed for both development and production with optimized Docker images.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

## Getting Started

### Running the Editor for Development
To run the collaborative code editor in a development environment, a Docker Compose setup is available in the `editor` directory. This setup includes all necessary services and dependencies to get the editor running with full features.

1. **Navigate to the `editor` directory:**
   ```bash
   cd editor
   ```

2. **Start the Docker Compose services:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the Editor:**
   Once the containers are running, you can access the editor by navigating to `http://localhost:<port>` (replace `<port>` with the port number specified in the `docker-compose.yml` file).

4. **Stopping the Development Environment:**
   To stop the running Docker containers, use:
   ```bash
   docker-compose down
   ```

### Running the Editor for Deployment
For a more lightweight setup in the production or deployment stage, use the Docker Compose setup in the `docker-deployment` directory. This setup optimizes the editor for lower memory usage and a smaller image size.

1. **Navigate to the `docker-deployment` directory:**
   ```bash
   cd docker-deployment
   ```

2. **Start the Docker Compose services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the Editor:**
   After deployment, the editor will be accessible at the server’s IP address or domain name on the configured port.

4. **Stopping the Deployment Environment:**
   To stop the running Docker containers, use:
   ```bash
   docker-compose down
   ```

## Additional Information
- **Configuration Options:** Refer to the `.env` files in each directory to customize environment-specific settings, such as port numbers, database configuration, and memory allocation.
- **Logging and Debugging:** Check the Docker container logs to troubleshoot issues. Use the following command to view logs:
  ```bash
  docker-compose logs -f
  ```

## License
This project is licensed under the MIT License.

---

Happy coding!

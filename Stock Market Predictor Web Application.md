# Stock Market Predictor Web Application

This repository contains a web-based stock market prediction application built with Flask (backend) and React (frontend).

## Project Structure

- `src/`: Contains the Flask application code, including routes, and the machine learning model.
- `src/static/`: Contains the built React frontend files (HTML, CSS, JavaScript).
- `venv/`: Python virtual environment.
- `requirements.txt`: List of Python dependencies.

## Deployment Instructions

These instructions provide a general guide for deploying the application on a free hosting service that supports Python/Flask applications. Specific steps might vary slightly depending on your chosen hosting provider (e.g., Heroku, PythonAnywhere, Vercel with a custom build).

### Prerequisites

- A hosting environment with Python 3.11 or higher installed.
- `pip` for package management.
- Git (optional, but recommended for deployment).

### Steps

1.  **Clone the Repository (or Upload Files)**

    If your hosting provider supports Git, clone this repository:
    ```bash
    git clone <repository_url>
    cd stock_prediction_web
    ```
    Otherwise, upload all files and folders from the `stock_prediction_web` directory to your hosting environment.

2.  **Set up a Virtual Environment**

    It's highly recommended to use a virtual environment to manage dependencies.
    ```bash
    python3.11 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies**

    Install all required Python packages using `pip`:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables (if necessary)**

    Some hosting providers might require you to set environment variables for your API keys or other configurations. For this project, ensure your Alpha Vantage API key is correctly set in `src/routes/stock.py` (it's currently hardcoded for simplicity, but for production, consider using environment variables).

5.  **Run the Flask Application**

    Most hosting providers will have a specific way to run your Flask application. Common methods include:

    -   **Using a `Procfile` (e.g., Heroku):** Create a file named `Procfile` in the root directory of your project with the following content:
        ```
        web: python src/main.py
        ```

    -   **Using a WSGI server (e.g., Gunicorn):** First, install Gunicorn:
        ```bash
        pip install gunicorn
        ```
        Then, run your application using Gunicorn:
        ```bash
        gunicorn --bind 0.0.0.0:$PORT src.main:app
        ```
        (Replace `$PORT` with the port provided by your hosting service, usually an environment variable).

    -   **Directly running `main.py`:** Some simpler hosting services might allow you to run the `main.py` file directly.
        ```bash
        python src/main.py
        ```

    Ensure your Flask application is configured to listen on `0.0.0.0` and the correct port as required by your hosting provider.

6.  **Access the Application**

    Once deployed, your application will be accessible via the URL provided by your hosting service.

## Important Notes

-   **API Key:** The Alpha Vantage API key is currently embedded in `src/routes/stock.py`. For a production environment, it is highly recommended to manage this as an environment variable for security.
-   **Model Persistence:** The `stock_prediction_model.pkl` file needs to be present in the `src/` directory for the application to load the trained model.
-   **Scalability:** This is a basic demonstration. For high-traffic applications, consider more robust solutions for data fetching, model serving, and frontend deployment.

## Author

Manus AI



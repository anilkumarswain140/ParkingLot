# Car Parking Lot REST API

## Overview

The Car Parking Lot REST API is a simple, in-memory service designed to manage car parking operations. It allows users to register, authenticate, park and unpark cars, and check slot availability. The parking lot size can be configured, and the application is built with robust features such as rate limiting to prevent abuse.


### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anilkumarswain140/ParkingLot.git
   ```

2. **Navigate to the project directory:**:

    ```bash
    cd car-parking-lot
    ```
  
3. **Install dependencies:**:

    ```bash
    npm install 
    ```

4. **Create a .env file in the root directory and configure your settings:**

    ```bash
    PORT=3000  
    PARKING_LOT_SIZE=5  
    JWT_SECRET=your_jwt_secret_key  
    ```

5. **Start the server:**
    ```bash
    npm start
    ```  
The server will start running on the configured port, and you can begin using the API endpoints.

## App is live on this URL

https://parking-lot-taupe.vercel.app


### Key Features

- **User Management**:
  - **/register**: Allows new users to register by providing a username and password.
  - **/login**: Authenticates users and provides a JWT token for accessing protected routes.

- **Parking Management**:
  - **/park**: Parks a car given its license plate. Returns a JSON response with the license plate and allocated slot if available, or an error message if the parking lot is full.
  - **/slot**: Retrieves information about a specific parking slot, indicating whether it is empty and providing the license plate of the parked car if applicable.
  - **/unpark**: Frees a parking slot by removing the car associated with the provided license plate. Returns a JSON response with the car's information and the freed slot, or an error message if the car is not found.

- **Rate Limiting**:
  - Implemented using `express-rate-limit` to limit the number of requests from a single IP address to prevent abuse.
  - Returns a `429 Too Many Requests` status code with a message when the limit is exceeded.

### Environment Configuration

The application can be configured via a `.env` file. The following environment variables are supported:

- `PORT`: The port on which the server will run (default is `3000`).
- `PARKING_LOT_SIZE`: The maximum number of parking slots available (default is `5`).
- `JWT_SECRET`: A secret key used for signing JWT tokens.

### API Endpoints

| Method | Endpoint              | Description                                                |
|--------|-----------------------|------------------------------------------------------------|
| POST   | `/api/auth/register`  | Register a new user by providing username and password.    |
| POST   | `/api/auth/login`     | Authenticate a user and obtain a JWT token.                |
| POST   | `/api/parking/park`   | Park a car given its license plate.                        |
| GET    | `/api/parking/slot`   | Retrieve information about a specific parking slot.        |
| POST   | `/api/parking/unpark` | Unpark a car given its license plate.                      |

### Endpoint Details

#### 1. Register

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user by providing a username and password. This endpoint does **not** require authentication.
- **Request Body**:
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response**:
    - **201 Created**: Returns a success message upon successful registration.
    ```json
    {
        "message": "User registered successfully"
    }
    ```
    - **400 Bad Request**: If the username already exists or if the input is invalid.
    ```json
    {
        "error": "User already exists"
    }
    ```

#### 2. Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and provides a JWT token for accessing protected routes.
- **Request Body**:
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response**:
    - **200 OK**: Returns a JWT token.
    ```json
    {
        "token": "your_jwt_token"
    }
    ```
    - **400 Bad Request**: If login credentials are invalid.
    ```json
    {
        "error": "Invalid credentials"
    }
    ```

#### 3. Park a Car

- **URL**: `/api/parking/park`
- **Method**: `POST`
- **Headers**:
    ```plaintext
    Authorization: Bearer your_jwt_token
    ```
- **Description**: Parks a car by providing its license plate. Requires authentication.
- **Request Body**:
    ```json
    {
        "license_plate": "ABC123"
    }
    ```
- **Response**:
    - **200 OK**: Returns the parked car's license plate and allocated slot.
    ```json
    {
        "license_plate": "ABC123",
        "slot": 1
    }
    ```
    - **400 Bad Request**: If the parking lot is full.
    ```json
    {
        "error": "Parking lot is full."
    }
    ```

#### 4. Get Slot Information

- **URL**: `/api/parking/slot`
- **Method**: `GET`
- **Headers**:
    ```plaintext
    Authorization: Bearer your_jwt_token
    ```
- **Description**: Retrieves information about a specific parking slot.
- **Query Parameters**:
    - `slot` (integer, required): The slot number to retrieve information for.
- **Example**: `/api/parking/slot/1`
- **Response**:
    - **200 OK**: Returns slot information.
    ```json
    {
        "slot": 1,
        "is_empty": false,
        "license_plate": "ABC123"
    }
    ```
    - **400 Bad Request**: If the slot number is invalid.
    ```json
    {
        "error": "Invalid slot number"
    }
    ```
    - **404 Not Found**: If the slot does not exist.
    ```json
    {
        "error": "Slot not found"
    }
    ```

#### 5. Unpark a Car

- **URL**: `/api/parking/unpark`
- **Method**: `POST`
- **Headers**:
    ```plaintext
    Authorization: Bearer your_jwt_token
    ```
- **Description**: Unparks a car by providing its license plate. Requires authentication.
- **Request Body**:
    ```json
    {
        "license_plate": "ABC123"
    }
    ```
- **Response**:
    - **200 OK**: Returns the information about the unparked car and slot.
    ```json
    {
        "license_plate": "ABC123",
        "slot": 1
    }
    ```
    - **404 Not Found**: If the car is not found.
    ```json
    {
        "error": "Car not found."
    }
    ```

### Making API Calls

You can make API calls to the endpoints using various tools such as **Postman**, **cURL**, or any HTTP client in your preferred programming language.

#### Example Using cURL

1. **Register a New User**:
    ```bash
    curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username": "your_username", "password": "your_password"}'
    ```

2. **Login**:
    ```bash
    curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "your_username", "password": "your_password"}'
    ```
    - **Response**:
        ```json
        {
            "token": "your_jwt_token"
        }
        ```

3. **Park a Car**:
    ```bash
    curl -X POST http://localhost:3000/api/parking/park \
    -H "Authorization: Bearer your_jwt_token" \
    -H "Content-Type: application/json" \
    -d '{"license_plate": "ABC123"}'
    ```
    - **Response**:
        ```json
        {
            "license_plate": "ABC123",
            "slot": 1
        }
        ```

4. **Get Slot Information**:
    ```bash
    curl -X GET "http://localhost:3000/api/parking/slot?slot=1" \
    -H "Authorization: Bearer your_jwt_token"
    ```
    - **Response**:
        ```json
        {
            "slot": 1,
            "is_empty": false,
            "license_plate": "ABC123"
        }
        ```

5. **Unpark a Car**:
    ```bash
    curl -X POST http://localhost:3000/api/parking/unpark \
    -H "Authorization: Bearer your_jwt_token" \
    -H "Content-Type: application/json" \
    -d '{"license_plate": "ABC123"}'
    ```
    - **Response**:
        ```json
        {
            "license_plate": "ABC123",
            "slot": 1
        }
        ```

### Rate Limiting

The API implements rate limiting, allowing a maximum of **100 requests per IP address** within a **15-minute window**. If this limit is exceeded, you will receive a `429 Too Many Requests` response:

```json
{
    "status": 429,
    "error": "Too Many Requests",
    "message": "You have exceeded the number of allowed requests. Please try again later."
}

```


License
This project is licensed under the MIT License. See the LICENSE file for details.






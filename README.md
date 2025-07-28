🧠 Microservices ArchiTecture 

A backend system built using Node.js and Express.js, implementing the Microservices Architecture. This project features a Common API Gateway for centralized request handling and an Identity Service for user authentication and authorization.


📁 Project Structure

Microservices-/
│
├── api-gateway/             # Common API Gateway
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
│
├── identity-service/        # Handles login, registration, JWT auth
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── server.js
│   └── package.json
│
└── README.md




🌐 Services Overview


1. 🔀 Common API Gateway (api-gateway)
Acts as the single entry point for all microservices

Proxies requests to the appropriate service

Implements:
Rate limiting
CORS
Logging
Token forwarding
Request validation

2. 🛂 Identity Service (identity-service)
Responsible for user management

Implements:
User Registration
User Login
JWT-based Authentication
Password Hashing


🛠 Technologies Used

Node.js + Express.js
MongoDB (with Mongoose)
JWT for Authentication
ioredis + rate-limit-redis
Helmet, CORS, dotenv
Winston for logging


🛣️ API Gateway Endpoints
Base URL: http://localhost:3000/v1

Method	    Endpoint	                Description
POST	    /auth/registerUser	       Register new user
POST	    /auth/LoginUser	           Login existing user

📌 Note: These endpoints are proxied via the API Gateway to the Identity Service.


⚙️ Setup Instructions

git clone https://github.com/yourusername/Microservices-Backend.git
cd Microservices-Backend

Start the API Gateway
cd api-gateway
npm install
npm run dev

Start the Identity Service
cd ../identity-service
npm install
npm run dev


🧪 Future Improvements

Add user profile microservice
Integrate API gateway authentication middleware
Dockerize all services
CI/CD pipeline




🧑‍💻 Contributing
Feel free to fork this repo and open pull requests. For major changes, open an issue first to discuss your idea.


📄 License
This project is licensed under the MIT License.





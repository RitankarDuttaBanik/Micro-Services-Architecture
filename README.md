1.🧠 Microservices Architecture 
-----------------------------------

A backend system built using Node.js and Express.js, implementing the Microservices Architecture. This project features a Common API Gateway for centralized request handling and an Identity Service for user authentication and authorization.



2.🌐 Services Overview
----------------------------------------
🔀 Common API Gateway (api-gateway)
    Acts as the single entry point for all microservices
    Proxies requests to the appropriate service

Implements:
   
        Rate limiting
        CORS
        Logging
        Token forwarding
        Request validation

 🛂 Identity Service (identity-service)
      Responsible for user management

Implements:
   
        User Registration
        User Login
        JWT-based Authentication
        Password Hashing

 3.📌 Folder Structure
 --------------------------------

           Microservices-/
        ├── api-gateway/
        │   └── src/
        │       ├── routes/
        │       ├── middleware/
        │       └── server.js
        ├── identity-service/
        │   └── src/
        │       ├── controllers/
        │       ├── routes/
        │       ├── models/
        │       └── server.js
        ├── Post-Service/
        |   └── src/
        │       ├── controllers/
        │       ├── routes/
        │       ├── models/
        │       └── server.js
        |
        └── README.md


4.🛠 Technologies Used
-----------------------------

  Node.js + Express.js
  MongoDB (with Mongoose)
  JWT for Authentication
  ioredis + rate-limit-redis
  Helmet, CORS, dotenv
  Winston for logging


5.🛣️ API Gateway Endpoints
-----------------------------------
  Base URL:   
          
    http://localhost:3000/v1
  
  
    POST	    /auth/registerUser	       Register new user
    POST	    /auth/LoginUser	          Login existing user

📌 Note: These endpoints are proxied via the API Gateway to the Identity Service.


6.⚙️ Setup Instructions
------------------------------

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

  Start the Post Service
  
          cd ../Post-service
          npm install
          npm run dev



7.🧪 Future Improvements
---------------------------------

   Add user profile microservice
  
   Integrate API gateway authentication middleware
  
   Dockerize all services
  
   CI/CD pipeline




8.🧑‍💻 Contributing
---------------------

    Feel free to fork this repo and open pull requests. For major changes, open an issue first to discuss your idea.


9.📄 License
-------------------------
       
    This project is licensed under the MIT License.





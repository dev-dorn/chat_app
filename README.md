# chat_app


Running the Authentication Backend Project
Prerequisites
Java Development Kit (JDK): Ensure you have JDK 21 installed.

MongoDB: Ensure MongoDB is installed and running on localhost:27017.

Steps to Run the Project
Clone the Repository: Clone the project repository from your version control system (e.g., GitHub).
```
sh
git clone https://github.com/dev-dorn/chat_app.git
cd chat_app
```
Configure the Application: Update the application.properties file with the MongoDB connection settings.
```
src/main/resources/application.properties:
```
properties
```
spring.data.mongodb.uri=mongodb://localhost:27017/chatapp_db
spring.main.allow-bean-definition-overriding=true
```
Build the Project: Use Maven to build the project.
```
sh
mvn clean install
```
Run the Application: Run the Spring Boot application.

```
sh
mvn spring-boot:run
```
Endpoints
Signup Endpoint:

Method: POST

URL: http://localhost:8080/signup


Headers: Content-Type: application/json

Body (raw, JSON):
```
json
{
  "username": "testuser",
  "password": "testpassword"
}
```
Login Endpoint:

Method: POST
```

URL: http://localhost:8080/perform_login

Headers: Content-Type: application/json
```
```
Body (raw, JSON):

json
{
  "username": "testuser",
  "password": "testpassword"
}
```

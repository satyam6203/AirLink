# ✈️ AirLink - Airline Reservation System

> A scalable Airline Global Distribution System (GDS) built using Spring Boot Microservices, Kafka, React, Docker, and Microsoft Azure.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Kafka](https://img.shields.io/badge/Apache-Kafka-black)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Azure](https://img.shields.io/badge/Cloud-Microsoft%20Azure-0078D4)
![JWT](https://img.shields.io/badge/Auth-JWT-success)

---

## 📖 Overview

AirLink is a distributed airline booking platform inspired by modern Global Distribution Systems (GDS). The application follows a **Microservices Architecture** with **Domain Driven Design (DDD)** principles, enabling independent deployment, scalability, and fault tolerance.

The system manages airline operations including flight search, booking, payments, seat reservations, authentication, notifications, and more.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 👤 User Registration & Login
- ✈️ Flight Management
- 🔍 Flight Search
- 🎟️ Ticket Booking
- 💺 Real-time Seat Reservation
- 💳 Payment Processing
- 📧 Email Notifications
- 📊 API Gateway
- ⚡ Redis Caching
- 📡 Event-driven Communication using Kafka
- 🔄 Saga Pattern for Distributed Transactions
- 🐳 Dockerized Services
- ☁️ Azure Deployment
- 🔁 CI/CD using GitHub Actions

---

# 🏗️ Architecture

```
                React Frontend
                       │
                 API Gateway
                       │
 ┌──────────────────────────────────────────────┐
 │                                              │
 │ Authentication Service                       │
 │ User Service                                 │
 │ Airline Service                              │
 │ Airport Service                              │
 │ Flight Service                               │
 │ Flight Schedule Service                      │
 │ Flight Instance Service                      │
 │ Booking Service                              │
 │ Payment Service                              │
 │ Notification Service                         │
 │ Search Service                               │
 └──────────────────────────────────────────────┘
                       │
              Apache Kafka Event Bus
                       │
         Saga Pattern for Transactions
                       │
             MySQL + Redis Cache
```

---

# 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Cloud
- Spring Data JPA
- Hibernate
- JWT Authentication
- REST APIs

### Frontend

- React
- Tailwind CSS
- Axios

### Database

- MySQL
- Redis

### Messaging

- Apache Kafka

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- Microsoft Azure

---

# 📦 Microservices

| Service | Description |
|----------|-------------|
| API Gateway | Entry point for all client requests |
| Authentication Service | Login, JWT generation |
| User Service | User management |
| Airline Service | Airline CRUD operations |
| Airport Service | Airport management |
| Flight Service | Flight information |
| Flight Schedule Service | Flight scheduling |
| Flight Instance Service | Daily flight instances |
| Booking Service | Ticket booking workflow |
| Payment Service | Payment processing |
| Notification Service | Email notifications |
| Search Service | Flight search APIs |

---

# 🔄 Booking Workflow

```
User
   │
   ▼
Search Flight
   │
   ▼
Select Flight
   │
   ▼
Booking Service
   │
   ├────────► Seat Reservation
   │
   ├────────► Payment Service
   │
   ├────────► Kafka Events
   │
   └────────► Notification Service
```

The booking process is coordinated using the **Saga Pattern**, ensuring data consistency across multiple microservices.

---

# 📂 Project Structure

```
AirLink
│
├── api-gateway
├── auth-service
├── user-service
├── airline-service
├── airport-service
├── flight-service
├── flight-schedule-service
├── flight-instance-service
├── booking-service
├── payment-service
├── notification-service
├── search-service
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/airlink.git
cd airlink
```

---

## Run using Docker

```bash
docker-compose up --build
```

---

## Run Individual Services

```bash
mvn spring-boot:run
```

---

# 🔑 Environment Variables

Create an `.env` file or configure the following variables:

```
MYSQL_USERNAME=root
MYSQL_PASSWORD=password

JWT_SECRET=your-secret-key

KAFKA_BOOTSTRAP_SERVERS=localhost:9092

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

# 📡 API Documentation

Swagger UI

```
http://localhost:8080/swagger-ui/index.html
```

---

# 🔐 Security

- JWT Authentication
- Spring Security
- Password Encryption (BCrypt)
- API Gateway Authentication
- Role-Based Authorization

---

# 📊 Scalability Features

- Stateless Microservices
- Independent Deployment
- Redis Caching
- Event-Driven Architecture
- Kafka Message Broker
- API Gateway Routing
- Distributed Transactions using Saga Pattern

---

# ☁️ Deployment

The application is containerized using Docker and deployed on **Microsoft Azure**.

CI/CD pipeline is automated using **GitHub Actions**.

---

# 📸 Screenshots

> Add screenshots of:

- Login
- Flight Search
- Booking
- Payment
- Dashboard

---

# 🔮 Future Enhancements

- Kubernetes Deployment
- OpenTelemetry Distributed Tracing
- ELK Stack Logging
- Prometheus Monitoring
- Grafana Dashboards
- Rate Limiting
- Multi-region Deployment

---

# 👨‍💻 Author

**Satyam Kumar Singh**

- GitHub: https://github.com/satyam6203
- LinkedIn: https://www.linkedin.com/in/satyam-kumar-singh-401047358/

---

# ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
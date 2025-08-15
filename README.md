# 🌱 Tivra Platform

A comprehensive B2B marketplace platform for biomass, briquettes, and biodiesel trading, built with React frontend and Django backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

Tivra Platform is a sophisticated B2B marketplace designed specifically for the bioenergy sector. It facilitates trading of biomass, briquettes, and biodiesel between buyers, sellers, and transporters. The platform provides a seamless experience for product discovery, negotiation, order management, and logistics coordination.

### Key Benefits
- **Streamlined Trading**: Direct B2B transactions with built-in negotiation tools
- **Logistics Integration**: Seamless coordination between buyers, sellers, and transporters
- **Secure Transactions**: JWT-based authentication and role-based access control
- **Real-time Communication**: Integrated messaging system for trade discussions
- **Comprehensive Dashboard**: Role-specific dashboards for different user types

## ✨ Features

### 🔐 Authentication & User Management
- JWT-based authentication system
- Role-based access control (Buyer, Seller, Transporter, Admin)
- User verification and KYC support
- Secure password management

### 🛍️ Product Management
- Product catalog with detailed specifications
- Commodity type categorization (Biomass, Briquettes, Biodiesel)
- Quantity and pricing management
- Availability date tracking
- Pickup location specification

### 💼 Trading & Negotiation
- Product enquiry system
- Price negotiation tools
- Order status tracking
- Transaction history
- Invoice generation

### 🚚 Logistics & Transportation
- Route management for transporters
- Order pickup and delivery tracking
- Real-time status updates
- Transportation cost management

### 💬 Communication
- Integrated messaging system
- Enquiry-based conversations
- Real-time notifications
- File sharing capabilities

## 📱 Screenshots

### 🏠 Homepage & Navigation
![Homepage](docs/homepagetivra.png)
*Main landing page with navigation and hero section*

![Browse Products](docs/browseprodtivra.png)
*Product browsing interface with filters and search*

![About Page](docs/aboutpagetivra.png)
*Company information and platform details*

![Contact Page](docs/contacttivra.png)
*Contact form and company information*

### 👤 User Dashboards

#### Buyer Dashboard
![Buyer Dashboard](docs/buyerdashboard.png)
*Comprehensive buyer dashboard with product listings and order management*

![Buyer Orders](docs/orders%20buyer.png)
*Order tracking and management for buyers*

![Buyer Enquiries](docs/reentenquires.png)
*Enquiry management and status tracking*

![Buyer Messages](docs/messgaesbuyer.png)
*Communication center for buyers*

#### Seller Dashboard
![Seller Dashboard](docs/sellerdash.png)
*Seller dashboard with product management and sales analytics*

![Seller Products](docs/addproductseller.png)
*Product addition and management interface*

![Seller Enquiries](docs/sellerenq.png)
*Enquiry management for sellers*

![Seller Messages](docs/sellermessage.png)
*Communication center for sellers*

#### Transporter Dashboard
![Transporter Dashboard](docs/trasnporterdash.png)
*Transportation management and route planning*

![Available Jobs](docs/available%20jobs%20t.png)
*Job opportunities and route management*

![Transporter Routes](docs/routestranposter.png)
*Route planning and optimization*

### 📊 Additional Features
![Buyer Interface](docs/buuerrr.png)
*Enhanced buyer interface elements*

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form management
- **React Query** - Server state management

### Backend
- **Django 5.0** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure token-based auth
- **CORS Headers** - Cross-origin resource sharing
- **Django Filters** - Advanced filtering capabilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Hot Reload** - Development experience

## 🏗️ Project Structure

```
Tivra/
├── tivra-platform-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── tivra_backend/               # Django backend application
│   ├── core/                    # Main application
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # Data serialization
│   │   └── permissions.py      # Access control
│   ├── manage.py               # Django management
│   └── settings.py             # Django configuration
├── docs/                        # Documentation and screenshots
│   └── images/                 # Application screenshots
├── requirements.txt             # Python dependencies
└── README.md                   # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tivra/tivra-platform-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../tivra_backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=postgresql://user:password@localhost:5432/tivra_db
   JWT_SECRET=your-jwt-secret
   CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register/`
User registration endpoint
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "role": "Buyer"
}
```

#### POST `/api/auth/login/`
User login endpoint
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Product Endpoints

#### GET `/api/products/`
Retrieve all products (requires authentication)

#### POST `/api/products/`
Create new product (Seller role required)
```json
{
  "commodity_type": "Biomass",
  "quantity": 100.0,
  "price": "50.00",
  "unit_of_measure": "kg",
  "availability_dates": "2024-01-01 to 2024-01-31",
  "pickup_location": "Mumbai, Maharashtra"
}
```

### Enquiry Endpoints

#### GET `/api/enquiries/`
Retrieve user's enquiries

#### POST `/api/enquiries/`
Create new enquiry (Buyer role required)

### Order Endpoints

#### GET `/api/orders/`
Retrieve user's orders

#### PUT `/api/orders/{id}/`
Update order status

## 👥 User Roles & Permissions

### Buyer
- Browse and search products
- Create enquiries and negotiate prices
- Place orders and track delivery
- Communicate with sellers and transporters
- View transaction history

### Seller
- Add and manage products
- Respond to buyer enquiries
- Track sales and revenue
- Manage inventory
- Communicate with buyers

### Transporter
- View available transportation jobs
- Accept and manage orders
- Plan and optimize routes
- Track delivery status
- Communicate with buyers and sellers

### Admin
- User management and verification
- Platform monitoring and analytics
- Content moderation
- System configuration
- Audit log access

## 🔧 Development

### Code Style
- Frontend: ESLint + Prettier configuration
- Backend: PEP 8 Python style guide
- TypeScript strict mode enabled
- Comprehensive error handling

### Testing
- Frontend: React Testing Library
- Backend: Django test framework
- API testing with Postman/Insomnia

### Database
- PostgreSQL with optimized queries
- Database migrations for schema changes
- Data seeding scripts available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the Tivra Development Team**

*Last updated: August 2024* 
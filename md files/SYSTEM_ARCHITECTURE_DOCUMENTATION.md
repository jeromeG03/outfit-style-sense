# System Architecture Documentation
## Outfit Style Sense - Smart Indian Dress Stylist

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Detailed Component Architecture](#detailed-component-architecture)
4. [Technology Stack](#technology-stack)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Database Architecture](#database-architecture)
8. [Security Architecture](#security-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [API Architecture](#api-architecture)
11. [Data Flow Architecture](#data-flow-architecture)
12. [External Services Integration](#external-services-integration)

---

## Architecture Overview

### System Type
**Three-Tier Web Application Architecture**
- **Presentation Tier**: React-based Single Page Application (SPA)
- **Application Tier**: Spring Boot RESTful API Server
- **Data Tier**: MySQL Relational Database

### Architectural Pattern
**Model-View-Controller (MVC) with Service Layer**
- **Model**: JPA Entities (User, Wardrobe, PasswordResetToken, etc.)
- **View**: React Components (JSX/TSX)
- **Controller**: Spring REST Controllers
- **Service**: Business Logic Layer (OutfitCombinationService, UserService, etc.)

### Communication Protocol
- **Frontend ↔ Backend**: HTTP/HTTPS REST API
- **Backend ↔ Database**: JDBC/JPA (ORM)
- **Backend ↔ Email Service**: SMTP Protocol

### Architectural Principles
1. **Separation of Concerns**: Clear boundaries between layers
2. **Loose Coupling**: Components communicate via interfaces
3. **High Cohesion**: Related functionality grouped together
4. **Scalability**: Stateless API for horizontal scaling
5. **Security**: Authentication, authorization, password hashing
6. **RESTful Design**: Resource-based API endpoints

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Browser)                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │              React 19 Single Page Application                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │  Login   │  │ Wardrobe │  │  Outfit  │  │  Trend   │      │   │
│  │  │   Page   │  │   Page   │  │  Recom.  │  │ Analysis │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │   │
│  │                                                                  │   │
│  │  Technology: TypeScript 5.8 + Tailwind CSS + Framer Motion    │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS REST API
                                    │ JSON Format
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION SERVER LAYER                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │              Spring Boot 3.2.3 Application                      │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────┐    │   │
│  │  │           REST API Controllers                         │    │   │
│  │  │  [UserController] [WardrobeController] [OccasionCtrl] │    │   │
│  │  └───────────────────────────────────────────────────────┘    │   │
│  │                          │                                      │   │
│  │  ┌───────────────────────────────────────────────────────┐    │   │
│  │  │              Business Logic Services                   │    │   │
│  │  │  [UserService] [WardrobeService] [EmailService]       │    │   │
│  │  │  [OutfitCombinationService - AI Engine] ★             │    │   │
│  │  └───────────────────────────────────────────────────────┘    │   │
│  │                          │                                      │   │
│  │  ┌───────────────────────────────────────────────────────┐    │   │
│  │  │           Data Access Layer (JPA Repositories)         │    │   │
│  │  │  [UserRepo] [WardrobeRepo] [PasswordResetTokenRepo]   │    │   │
│  │  └───────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  Technology: Java 17 + Spring Data JPA + Spring Security       │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JDBC Connection
                                    │ SQL Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                    MySQL 8.0 Database                           │   │
│  │                  (outfit_recommendation_db)                     │   │
│  │                                                                  │   │
│  │  [users] [wardrobe] [password_reset_tokens] [occasions]       │   │
│  │  [fashion_trends] [skin_tone_rules] [color_psychology]        │   │
│  │                                                                  │   │
│  │  Technology: MySQL 8.0 + InnoDB Engine                         │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │   EXTERNAL SERVICES         │
                    ├─────────────────────────────┤
                    │  Gmail SMTP Server          │
                    │  (Password Reset Emails)    │
                    └─────────────────────────────┘
```

---

## Detailed Component Architecture

### Component Breakdown

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ARCHITECTURE                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Entry Point (index.tsx)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Root Component (App.tsx)                      │   │
│  │  • React Router Configuration                                    │   │
│  │  • Global State Management                                       │   │
│  │  • Authentication Context Provider                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│          ┌──────────────────────┼──────────────────────┐               │
│          │                      │                       │               │
│          ▼                      ▼                       ▼               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │
│  │ Auth Module  │      │   Wardrobe   │      │Personalization│         │
│  │              │      │    Module    │      │    Module     │         │
│  │ • LoginPage  │      │• WardrobePage│      │• SkinTonePage │         │
│  │ • SignupPage │      │  - My Items  │      │• PsychologyPg │         │
│  │ • ForgotPwd  │      │  - Outfits   │      │• TrendsPage   │         │
│  │   Modal      │      │  - Suggest.  │      │• OccasionPage │         │
│  └──────────────┘      └──────────────┘      └──────────────┘         │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Shared Components                             │   │
│  │  • Header/Navigation • Footer • Loading Spinner • Error Modal   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Utilities & Services                          │   │
│  │  • API Service (fetch wrapper)                                   │   │
│  │  • Auth Service (token management)                               │   │
│  │  • LocalStorage Service (persistence)                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    State Management                              │   │
│  │  • React useState (local state)                                  │   │
│  │  • React useEffect (side effects)                                │   │
│  │  • React useContext (global state)                               │   │
│  │  • localStorage (persistent state)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Styling & Animation                           │   │
│  │  • Tailwind CSS (utility classes)                                │   │
│  │  • Framer Motion (animations)                                    │   │
│  │  • Lucide React (icons)                                          │   │
│  │  • Custom CSS (index.css)                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Build Tool: Vite 6.x                                                    │
│  Dev Server: http://localhost:5173                                       │
│  Production Build: Static files (HTML, CSS, JS)                          │
└──────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Entry Point (Main Application Class)                │   │
│  │  @SpringBootApplication                                          │   │
│  │  com.example.outfit.OutfitRecommendationApplication              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Spring Boot Framework                         │   │
│  │  • Auto-configuration                                            │   │
│  │  • Embedded Tomcat Server (Port 8080)                            │   │
│  │  • Component Scanning                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│          ┌──────────────────────┼──────────────────────┐               │
│          │                      │                       │               │
│          ▼                      ▼                       ▼               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │
│  │ @RestController Layer                                      │         │
│  ├────────────────────────────────────────────────────────────┤         │
│  │ UserController          WardrobeController                 │         │
│  │ • /api/users/login      • /api/wardrobe/user/{id}         │         │
│  │ • /api/users/signup     • /api/wardrobe/suggestions/{id}  │         │
│  │ • /forgot-password      • /api/wardrobe/outfits/{id}      │         │
│  │ • /verify-reset-code    • /api/wardrobe/outfits/smart     │         │
│  │ • /reset-password                                          │         │
│  │                                                            │         │
│  │ OccasionController      ColorPsychologyController         │         │
│  │ SkinToneRuleController  FashionTrendsController           │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      @Service Layer                              │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  UserService                 WardrobeService                    │   │
│  │  • createUser()              • addWardrobeItem()                │   │
│  │  • loginWithEmail()          • getItemsByUserId()               │   │
│  │  • initiatePasswordReset()   • deleteItem()                     │   │
│  │  • verifyResetCode()                                            │   │
│  │  • resetPassword()                                              │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │    OutfitCombinationService (AI ENGINE) ★              │    │   │
│  │  ├────────────────────────────────────────────────────────┤    │   │
│  │  │  Core Algorithms:                                       │    │   │
│  │  │  • getSuggestionsForItem(itemId, userId)               │    │   │
│  │  │  • getCompleteOutfits(userId)                          │    │   │
│  │  │  • calculateCompatibility(item1, item2)                │    │   │
│  │  │  • getStyleTips(color, type, pattern)                  │    │   │
│  │  │                                                         │    │   │
│  │  │  Data Structures:                                       │    │   │
│  │  │  • COLOR_COMBINATIONS (Map<String, List<String>>)      │    │   │
│  │  │  • CLOTH_TYPE_COMBINATIONS                             │    │   │
│  │  │  • PATTERN_COMBINATIONS                                │    │   │
│  │  │  • SEASON_COMBINATIONS                                 │    │   │
│  │  │                                                         │    │   │
│  │  │  Scoring Logic:                                         │    │   │
│  │  │  • Color Match: 40 points                              │    │   │
│  │  │  • Type Compatibility: 30 points                       │    │   │
│  │  │  • Pattern Harmony: 20 points                          │    │   │
│  │  │  • Season Match: 10 points                             │    │   │
│  │  │  • Total: 0-100 score                                  │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  EmailService                                                   │   │
│  │  • sendPasswordResetEmail(email, token)                         │   │
│  │  • sendWelcomeEmail(email, username)                            │   │
│  │  • Mode: Console (dev) or SMTP (prod)                           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  @Repository Layer (JPA)                         │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  UserRepository extends JpaRepository<User, Long>               │   │
│  │  • findByEmail(String email)                                    │   │
│  │  • existsByEmail(String email)                                  │   │
│  │  • existsByUserName(String userName)                            │   │
│  │                                                                  │   │
│  │  WardrobeRepository extends JpaRepository<Wardrobe, Long>       │   │
│  │  • findByUserId(Long userId)                                    │   │
│  │  • deleteByIdAndUserId(Long id, Long userId)                    │   │
│  │                                                                  │   │
│  │  PasswordResetTokenRepository                                   │   │
│  │  • findByToken(String token)                                    │   │
│  │  • findByEmailAndUsedFalse(String email)                        │   │
│  │  • deleteByEmail(String email)                                  │   │
│  │                                                                  │   │
│  │  [Other Repositories: Occasion, SkinToneRule, etc.]            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      @Entity Models (JPA)                        │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  @Entity User                    @Entity Wardrobe               │   │
│  │  • id (Primary Key)              • id (Primary Key)             │   │
│  │  • email (Unique)                • userId (Foreign Key)         │   │
│  │  • userName                      • clothType                    │   │
│  │  • password                      • color                        │   │
│  │  • authProvider                  • pattern                      │   │
│  │  • createdAt                     • season                       │   │
│  │                                  • occasion                     │   │
│  │  @Entity PasswordResetToken      • imageUrl                     │   │
│  │  • id                                                           │   │
│  │  • email                         [Other Entities...]            │   │
│  │  • token                                                        │   │
│  │  • expiryDate                                                   │   │
│  │  • used                                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Configuration Files                           │   │
│  │  • application.properties (DB config, server port, email SMTP)  │   │
│  │  • pom.xml (Maven dependencies)                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Build Tool: Maven 3.x                                                   │
│  Runtime: Java 17 (OpenJDK)                                              │
│  Server: Embedded Tomcat 10.x                                            │
│  API Port: http://localhost:8080                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | 19.x | Component-based UI library |
| **Language** | TypeScript | 5.8.x | Type-safe JavaScript superset |
| **Build Tool** | Vite | 6.x | Fast development server & bundler |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Animation** | Framer Motion | 11.x | Smooth animations & transitions |
| **Icons** | Lucide React | Latest | Modern icon library |
| **Routing** | React Router | 6.x | Client-side routing |
| **HTTP Client** | Fetch API | Native | API communication |
| **State Management** | React Hooks | Built-in | useState, useEffect, useContext |
| **Package Manager** | npm | 10.x | Dependency management |

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Spring Boot | 3.2.3 | Enterprise Java framework |
| **Language** | Java | 17 (LTS) | Core programming language |
| **Web Server** | Embedded Tomcat | 10.x | Servlet container |
| **ORM** | Hibernate (JPA) | 6.x | Object-relational mapping |
| **Security** | Spring Security | 6.x | Authentication & authorization |
| **Password Hashing** | BCrypt | Built-in | Secure password storage |
| **Email** | JavaMailSender | Spring | SMTP email sending |
| **Build Tool** | Maven | 3.x | Dependency & build management |
| **Database Driver** | MySQL Connector/J | 8.x | JDBC driver for MySQL |
| **Logging** | SLF4J + Logback | Built-in | Application logging |

### Database & Storage

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **RDBMS** | MySQL | 8.0.x | Primary data storage |
| **Storage Engine** | InnoDB | Default | Transactional storage engine |
| **Connection Pool** | HikariCP | Built-in | Database connection pooling |
| **Schema Management** | SQL Scripts | Manual | Database migration |

### External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Email** | Gmail SMTP | Password reset emails |
| **OAuth** | Google OAuth 2.0 | Social authentication (planned) |

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Frontend development IDE |
| **IntelliJ IDEA** | Backend development IDE |
| **MySQL Workbench** | Database management |
| **Postman** | API testing |
| **Git** | Version control |
| **PowerShell/Terminal** | Command-line interface |

---

## Frontend Architecture

### Directory Structure
```
src/
├── index.tsx                    # Entry point
├── App.tsx                      # Root component
├── index.css                    # Global styles
├── types.ts                     # TypeScript interfaces
│
├── components/                  # Feature components
│   ├── Login/
│   │   └── LoginPage.tsx        # Authentication
│   ├── Signup/
│   │   └── SignupPage.tsx       # Registration
│   ├── Home/
│   │   └── HomePage.tsx         # Landing page
│   ├── Wardrobe/
│   │   └── WardrobePage.tsx     # Digital closet (3 tabs)
│   ├── Recommendation/
│   │   └── RecommendationPage.tsx
│   ├── SkinTone/
│   │   └── SkinTonePage.tsx     # Skin analysis
│   ├── Psychology/
│   │   └── PsychologyPage.tsx   # Color meanings
│   ├── Trends/
│   │   └── TrendsPage.tsx       # Fashion trends
│   ├── Occasion/
│   │   └── OccasionPage.tsx     # Event styling
│   ├── VirtualTrial/
│   │   └── VirtualTrialRoomPage.tsx
│   └── Flow/
│       └── FlowDiagramPage.tsx
│
├── public/                      # Static assets
│   └── assets/
│       └── images/              # Image files
│
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

### Component Hierarchy
```
App (Root)
│
├── React Router
│   ├── Route "/" → HomePage
│   ├── Route "/login" → LoginPage
│   ├── Route "/signup" → SignupPage
│   ├── Route "/wardrobe" → WardrobePage
│   │   ├── Tab: My Wardrobe
│   │   ├── Tab: Complete Outfits
│   │   └── Tab: Suggestions
│   ├── Route "/recommendations" → RecommendationPage
│   ├── Route "/skin-tone" → SkinTonePage
│   ├── Route "/psychology" → PsychologyPage
│   ├── Route "/trends" → TrendsPage
│   ├── Route "/occasions" → OccasionPage
│   └── Route "/virtual-trial" → VirtualTrialRoomPage
```

### State Management Strategy
```
┌─────────────────────────────────────────┐
│       Component-Level State             │
│  (useState, useEffect)                  │
│                                         │
│  • Form inputs                          │
│  • Loading states                       │
│  • Error messages                       │
│  • Local UI state                       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Application-Level State            │
│  (Context API / localStorage)           │
│                                         │
│  • Authentication token                 │
│  • User ID                              │
│  • User profile                         │
│  • Theme preferences                    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Persistent State                  │
│  (localStorage)                         │
│                                         │
│  • JWT token                            │
│  • User session                         │
│  • Cached data                          │
└─────────────────────────────────────────┘
```

### API Communication Layer
```typescript
// API Service Architecture

class APIService {
  baseURL = "http://localhost:8080"
  
  // Authentication APIs
  login(email, password) → POST /api/users/login
  signup(email, username, password) → POST /api/users/signup
  forgotPassword(email) → POST /api/users/forgot-password
  verifyResetCode(email, token) → POST /api/users/verify-reset-code
  resetPassword(email, token, newPassword) → POST /api/users/reset-password
  
  // Wardrobe APIs
  addWardrobeItem(userId, itemData) → POST /api/wardrobe/user/{userId}
  getWardrobeItems(userId) → GET /api/wardrobe/user/{userId}
  deleteItem(itemId) → DELETE /api/wardrobe/{itemId}
  
  // Recommendation APIs
  getSuggestions(itemId, userId) → GET /api/wardrobe/suggestions/{itemId}/user/{userId}
  getCompleteOutfits(userId) → GET /api/wardrobe/outfits/user/{userId}
  getSmartOutfits(userId, filters) → GET /api/wardrobe/outfits/user/{userId}/smart
  
  // Personalization APIs
  getOccasions() → GET /api/occasions
  getTrends() → GET /api/trends
  getColorPsychology() → GET /api/psychology/colors
  getSkinToneRules() → GET /api/skin-tone/rules
}
```

---

## Backend Architecture

### Package Structure
```
com.example.outfit/
│
├── OutfitRecommendationApplication.java    # Main entry point
│
├── controller/                             # REST Controllers
│   ├── UserController.java                 # Authentication endpoints
│   ├── WardrobeController.java             # Wardrobe CRUD + Recommendations
│   ├── OccasionController.java             # Occasion management
│   ├── ColorPsychologyController.java      # Color data
│   ├── SkinToneRuleController.java         # Skin tone analysis
│   └── FashionTrendsController.java        # Trends management
│
├── service/                                # Business Logic
│   ├── UserService.java                    # User operations
│   ├── WardrobeService.java                # Wardrobe operations
│   ├── OutfitCombinationService.java       # AI Matching Engine ★
│   ├── EmailService.java                   # Email sending
│   ├── OccasionService.java
│   ├── ColorPsychologyService.java
│   ├── SkinToneRuleService.java
│   └── FashionTrendsService.java
│
├── repository/                             # Data Access (JPA)
│   ├── UserRepository.java
│   ├── WardrobeRepository.java
│   ├── PasswordResetTokenRepository.java
│   ├── OccasionRepository.java
│   ├── ColorPsychologyRepository.java
│   ├── SkinToneRuleRepository.java
│   └── FashionTrendsRepository.java
│
├── model/                                  # Entity Classes
│   ├── User.java                           # @Entity
│   ├── Wardrobe.java                       # @Entity
│   ├── PasswordResetToken.java             # @Entity
│   ├── Occasion.java                       # @Entity
│   ├── ColorPsychology.java                # @Entity
│   ├── SkinToneRule.java                   # @Entity
│   └── FashionTrends.java                  # @Entity
│
└── resources/
    └── application.properties              # Configuration
```

### Layered Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                            │
│                  (HTTP POST /api/users/login)                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  @RestController Layer                       │
│  • Receives HTTP requests                                   │
│  • Validates request parameters                             │
│  • Calls service layer methods                              │
│  • Returns HTTP responses (JSON)                            │
│                                                             │
│  Example: UserController.login()                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    @Service Layer                            │
│  • Contains business logic                                  │
│  • Implements complex algorithms                            │
│  • Coordinates between repositories                         │
│  • Handles transactions                                     │
│  • Performs validations                                     │
│                                                             │
│  Example: UserService.loginWithEmail()                      │
│  • Check if email exists                                    │
│  • Verify password with BCrypt                              │
│  • Generate JWT token                                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  @Repository Layer (JPA)                     │
│  • Data access abstraction                                  │
│  • CRUD operations                                          │
│  • Custom queries                                           │
│  • No business logic                                        │
│                                                             │
│  Example: UserRepository.findByEmail()                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Hibernate (JPA Provider)                   │
│  • ORM (Object-Relational Mapping)                          │
│  • SQL query generation                                     │
│  • Entity lifecycle management                              │
│  • Caching                                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    JDBC Connection                           │
│  • Database driver                                          │
│  • Connection pooling (HikariCP)                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│  • Data storage                                             │
│  • Query execution                                          │
│  • Transaction management                                   │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Injection (Spring IoC Container)
```
┌────────────────────────────────────────────────────────────┐
│              Spring IoC Container                          │
│                                                            │
│  ┌──────────────────────────────────────────────┐        │
│  │  Component Scanning                          │        │
│  │  @SpringBootApplication                      │        │
│  │  Scans: com.example.outfit package           │        │
│  └──────────────────────────────────────────────┘        │
│                     │                                     │
│                     ▼                                     │
│  ┌──────────────────────────────────────────────┐        │
│  │  Bean Creation & Management                  │        │
│  │  • Controllers (@RestController)             │        │
│  │  • Services (@Service)                       │        │
│  │  • Repositories (@Repository)                │        │
│  │  • Configurations (@Configuration)           │        │
│  └──────────────────────────────────────────────┘        │
│                     │                                     │
│                     ▼                                     │
│  ┌──────────────────────────────────────────────┐        │
│  │  Dependency Injection                        │        │
│  │  @Autowired                                  │        │
│  │                                              │        │
│  │  Example:                                    │        │
│  │  @RestController                             │        │
│  │  class WardrobeController {                  │        │
│  │    @Autowired                                │        │
│  │    private WardrobeService wardrobeService;  │        │
│  │    @Autowired                                │        │
│  │    private OutfitCombinationService aiServ;  │        │
│  │  }                                           │        │
│  └──────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Database Schema with Relationships
```
┌─────────────────────────────────────────────────────────────────┐
│                     MySQL Database Schema                        │
│                  (outfit_recommendation_db)                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       users          │  PRIMARY TABLE
├──────────────────────┤
│ PK id (BIGINT)       │
│ UK email (VARCHAR)   │───────┐
│    userName (VARCHAR)│       │ Referenced by email
│    password (VARCHAR)│       │
│    authProvider      │       │
│    createdAt         │       │
└──────────────────────┘       │
         │                     │
         │ 1                   │
         │                     │
         │ N                   │ 1
         │                     │
         ▼                     ▼
┌──────────────────────┐  ┌──────────────────────┐
│     wardrobe         │  │password_reset_tokens │
├──────────────────────┤  ├──────────────────────┤
│ PK id (BIGINT)       │  │ PK id (BIGINT)       │
│ FK userId (BIGINT)   │  │ FK email (VARCHAR)   │
│    clothType         │  │    token (CHAR(6))   │
│    color             │  │    expiryDate        │
│    pattern           │  │    used (BOOLEAN)    │
│    season            │  │    createdAt         │
│    occasion          │  └──────────────────────┘
│    imageUrl          │
└──────────────────────┘

╔════════════════════╗
║ MASTER DATA TABLES ║  (No foreign keys, referenced by application)
╚════════════════════╝

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│     occasions        │  │   fashion_trends     │  │   skin_tone_rules    │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ PK id                │  │ PK id                │  │ PK id                │
│    occasionName      │  │    trendName         │  │    toneType          │
│    formalityLevel    │  │    description       │  │    recommendedColors │
│    dressCodes        │  │    popularity        │  │    avoidColors       │
│    description       │  │    season            │  │    description       │
└──────────────────────┘  │    createdAt         │  └──────────────────────┘
                          └──────────────────────┘

┌──────────────────────┐
│  color_psychology    │
├──────────────────────┤
│ PK id                │
│    color             │
│    psychology        │
│    culturalSignific. │
│    mood              │
│    occasions         │
└──────────────────────┘
```

### Indexes for Performance
```sql
-- Primary Keys (Automatically indexed)
users.id
wardrobe.id
password_reset_tokens.id
occasions.id
fashion_trends.id
skin_tone_rules.id
color_psychology.id

-- Unique Indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_username ON users(userName);

-- Foreign Key Indexes
CREATE INDEX idx_wardrobe_userid ON wardrobe(userId);
CREATE INDEX idx_password_reset_email ON password_reset_tokens(email);

-- Query Optimization Indexes
CREATE INDEX idx_wardrobe_clothtype ON wardrobe(clothType);
CREATE INDEX idx_wardrobe_color ON wardrobe(color);
CREATE INDEX idx_wardrobe_season ON wardrobe(season);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_used ON password_reset_tokens(used);
```

### Database Connection Configuration
```
┌─────────────────────────────────────────────────────────────┐
│            Application Server (Spring Boot)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         HikariCP Connection Pool                   │    │
│  │  • Maximum Pool Size: 10 connections              │    │
│  │  • Minimum Idle: 5 connections                    │    │
│  │  • Connection Timeout: 30 seconds                 │    │
│  │  • Idle Timeout: 10 minutes                       │    │
│  │  • Max Lifetime: 30 minutes                       │    │
│  └───────────────────────────────────────────────────┘    │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ JDBC URL:
                           │ jdbc:mysql://localhost:3306/outfit_recommendation_db
                           │ ?useSSL=false&serverTimezone=UTC
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Server                             │
│                      Port: 3306                             │
│                                                             │
│  Database: outfit_recommendation_db                         │
│  Character Set: utf8mb4                                     │
│  Collation: utf8mb4_unicode_ci                              │
│  Storage Engine: InnoDB                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow
```
┌───────────────────────────────────────────────────────────────────┐
│                     Authentication Process                         │
└───────────────────────────────────────────────────────────────────┘

Step 1: User Login
┌─────────┐                  ┌──────────────┐
│ Browser │ ─── email + ──>  │   Backend    │
│         │     password     │              │
└─────────┘                  └──────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ UserService.login()  │
                          │ • Query database     │
                          │ • BCrypt.matches()   │
                          └──────────────────────┘
                                     │
                                     ▼
Step 2: Password Verification
┌─────────────────────────────────────────────────────┐
│  BCrypt Password Hashing                            │
│                                                     │
│  Input: "UserPassword123!"                          │
│  Stored Hash: "$2a$10$N9qo8uLOickgx..."           │
│                                                     │
│  BCrypt.matches(input, storedHash) → true/false    │
└─────────────────────────────────────────────────────┘
                     │
                     ▼ (if valid)
Step 3: JWT Token Generation
┌─────────────────────────────────────────────────────┐
│  JWT Token Structure                                │
│                                                     │
│  Header:                                            │
│  {"alg": "HS256", "typ": "JWT"}                    │
│                                                     │
│  Payload:                                           │
│  {"userId": 3, "email": "user@example.com",        │
│   "exp": 1713312000}                               │
│                                                     │
│  Signature:                                         │
│  HMACSHA256(base64(header) + "." + base64(payload),│
│             secret_key)                            │
│                                                     │
│  Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
Step 4: Token Storage (Frontend)
┌─────────────────────────────────────────────────────┐
│  localStorage.setItem('token', jwt_token)           │
│  localStorage.setItem('userId', 3)                  │
└─────────────────────────────────────────────────────┘

Step 5: Subsequent Requests
┌─────────┐                  ┌──────────────┐
│ Browser │ ──── API ───>    │   Backend    │
│         │   Request +      │              │
│         │   Authorization: │              │
│         │   Bearer token   │              │
└─────────┘                  └──────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ Token Validation     │
                          │ • Verify signature   │
                          │ • Check expiration   │
                          │ • Extract userId     │
                          └──────────────────────┘
```

### Password Security
```
┌─────────────────────────────────────────────────────────────┐
│                     Password Hashing with BCrypt             │
└─────────────────────────────────────────────────────────────┘

Registration Flow:
User Input: "SecurePassword123!"
                │
                ▼
┌──────────────────────────────────────────┐
│  BCrypt.hashpw(password, BCrypt.gensalt())│
│                                           │
│  • Work Factor: 10 (2^10 = 1024 rounds)  │
│  • Random Salt: Generated per password   │
│  • Hash Algorithm: Blowfish              │
└──────────────────────────────────────────┘
                │
                ▼
Database Storage: "$2a$10$N9qo8uLOickgx2ZmmYuYUe..."
                  │    │   │                     │
                  │    │   └─ Salt               └─ Hash
                  │    └─ Work Factor
                  └─ BCrypt Version

Security Features:
✓ Salting: Different salt for each password (prevents rainbow tables)
✓ Slow Algorithm: CPU-intensive (protects against brute force)
✓ Adaptive: Work factor can be increased over time
✓ One-way: Cannot reverse hash to get original password
```

### API Security Headers
```
HTTP Response Headers (Set by Spring Security):

X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains

CORS Configuration:
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Deployment Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKSTATION                         │
│                                                                  │
│  ┌───────────────────────────┐  ┌───────────────────────────┐ │
│  │   Frontend Development    │  │   Backend Development     │ │
│  │   VS Code                 │  │   IntelliJ IDEA          │ │
│  │   Vite Dev Server         │  │   Maven                  │ │
│  │   Port: 5173              │  │   Spring Boot            │ │
│  │   Hot Module Replacement  │  │   Port: 8080             │ │
│  └───────────────────────────┘  └───────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │               MySQL Database (Local)                        ││
│  │               Port: 3306                                    ││
│  │               Database: outfit_recommendation_db            ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

Development URLs:
• Frontend: http://localhost:5173
• Backend API: http://localhost:8080
• Database: localhost:3306
```

### Production Architecture (Recommended)
```
┌─────────────────────────────────────────────────────────────────┐
│                          INTERNET                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Load Balancer / CDN                         │
│  • HTTPS Termination (SSL/TLS)                                  │
│  • Static Asset Caching                                         │
│  • DDoS Protection                                              │
└─────────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Web Server (Nginx)     │  │  Application Server      │
│   • Serves React SPA     │  │  (Spring Boot)           │
│   • Port: 443 (HTTPS)    │  │  • Embedded Tomcat       │
│   • Reverse Proxy to API │  │  • Port: 8080            │
└──────────────────────────┘  │  • Multiple Instances    │
                              │  • Horizontal Scaling    │
                              └──────────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────────┐
                              │  Database Server         │
                              │  (MySQL 8.0)             │
                              │  • Port: 3306            │
                              │  • Replication (Master-  │
                              │    Slave for read scale) │
                              │  • Automated Backups     │
                              └──────────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────────┐
                              │  External Services       │
                              │  • Gmail SMTP Server     │
                              │  • Google OAuth APIs     │
                              └──────────────────────────┘
```

### Containerization (Docker - Optional)
```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Architecture                  │
└─────────────────────────────────────────────────────────────────┘

Container 1: Frontend (Nginx)
┌────────────────────────────────┐
│  nginx:alpine                  │
│  • Serves React build files    │
│  • Port: 80 → 3000             │
│  • Volume: ./dist              │
└────────────────────────────────┘

Container 2: Backend (Java)
┌────────────────────────────────┐
│  openjdk:17-jdk-slim           │
│  • Runs Spring Boot JAR        │
│  • Port: 8080                  │
│  • Environment: DB credentials │
└────────────────────────────────┘

Container 3: Database (MySQL)
┌────────────────────────────────┐
│  mysql:8.0                     │
│  • Port: 3306                  │
│  • Volume: ./mysql-data        │
│  • Init SQL: schema.sql        │
└────────────────────────────────┘

Docker Network: outfit-network
All containers communicate via internal network
```

---

## API Architecture

### RESTful API Design

**Base URL:** `http://localhost:8080`

### Endpoint Categories

#### 1. Authentication Endpoints
```
POST   /api/users/signup
POST   /api/users/login
POST   /api/users/forgot-password
POST   /api/users/verify-reset-code
POST   /api/users/reset-password
POST   /api/users/google-auth
```

#### 2. Wardrobe Management Endpoints
```
POST   /api/wardrobe/user/{userId}              # Add item
GET    /api/wardrobe/user/{userId}              # Get all items
DELETE /api/wardrobe/{itemId}                   # Delete item
PUT    /api/wardrobe/{itemId}                   # Update item
```

#### 3. Outfit Recommendation Endpoints ★
```
GET    /api/wardrobe/suggestions/{itemId}/user/{userId}
       # Get matching suggestions for specific item
       
GET    /api/wardrobe/outfits/user/{userId}
       # Get all outfit combinations
       
GET    /api/wardrobe/outfits/user/{userId}/smart
       ?occasion={occasion}&season={season}&limit={limit}
       # Get filtered outfit combinations
```

#### 4. Personalization Endpoints
```
GET    /api/occasions                    # List all occasions
GET    /api/occasions/{id}               # Get occasion details
GET    /api/trends                       # List fashion trends
GET    /api/psychology/colors            # Get color psychology
GET    /api/skin-tone/rules              # Get skin tone rules
```

### API Request/Response Format

**Example 1: Login Request**
```json
POST /api/users/login
Content-Type: application/json

REQUEST:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

RESPONSE (Success - 200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 3,
  "userName": "john_doe",
  "email": "user@example.com"
}

RESPONSE (Error - 401 Unauthorized):
{
  "error": "Invalid email or password",
  "timestamp": "2026-04-16T10:30:00"
}
```

**Example 2: Get Outfit Suggestions**
```json
GET /api/wardrobe/suggestions/15/user/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (200 OK):
{
  "selectedItem": {
    "id": 15,
    "clothType": "Shirt",
    "color": "White",
    "pattern": "Solid",
    "season": "All Season"
  },
  "suggestions": [
    {
      "item": {
        "id": 16,
        "clothType": "Jeans",
        "color": "Blue",
        "pattern": "Solid",
        "season": "All Season"
      },
      "matchScore": 100,
      "compatibility": "Excellent Match",
      "reasons": [
        "Perfect color match",
        "Suitable clothing type",
        "Pattern complements well"
      ]
    }
  ],
  "styleTips": [
    "White pairs well with almost any color - a versatile wardrobe staple",
    "Tuck in your shirt for a formal look, or leave it untucked for casual"
  ],
  "totalSuggestions": 5
}
```

### HTTP Status Codes
```
200 OK                    - Request successful
201 Created               - Resource created successfully
204 No Content            - Deletion successful
400 Bad Request           - Invalid request data
401 Unauthorized          - Authentication required
403 Forbidden             - Insufficient permissions
404 Not Found             - Resource not found
409 Conflict              - Duplicate email/username
500 Internal Server Error - Server error
```

---

## Data Flow Architecture

### Complete Request-Response Cycle

```
┌───────────────────────────────────────────────────────────────────┐
│  USER ACTION: Click "Find Matching Items" on White Shirt          │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  FRONTEND (React Component)                                        │
│  • WardrobePage.tsx                                               │
│  • Event Handler: handleFindMatchingItems(itemId)                 │
│  • State Update: setLoading(true)                                 │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  API CALL (fetch)                                                  │
│  GET http://localhost:8080/api/wardrobe/suggestions/15/user/3    │
│  Headers: {                                                       │
│    'Authorization': 'Bearer eyJhbGc...',                          │
│    'Content-Type': 'application/json'                             │
│  }                                                                │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS
┌───────────────────────────────────────────────────────────────────┐
│  BACKEND - Tomcat Server (Port 8080)                              │
│  • Receives HTTP request                                          │
│  • Routes to appropriate controller                               │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                                  │
│  @RestController WardrobeController                               │
│  @GetMapping("/api/wardrobe/suggestions/{itemId}/user/{userId}")  │
│  • Extract path variables: itemId=15, userId=3                    │
│  • Validate JWT token                                             │
│  • Call service method                                            │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                                     │
│  @Service OutfitCombinationService                                │
│  getSuggestionsForItem(itemId=15, userId=3)                       │
│                                                                   │
│  Step 1: Fetch selected item from repository                      │
│  Step 2: Fetch all user items from repository                     │
│  Step 3: Calculate match scores using AI algorithm               │
│  Step 4: Filter results (score >= 50)                            │
│  Step 5: Sort by match score (descending)                         │
│  Step 6: Generate style tips                                      │
│  Step 7: Build response DTO                                       │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER (JPA)                                           │
│  @Repository WardrobeRepository                                   │
│  • findById(15) → SELECT * FROM wardrobe WHERE id = 15            │
│  • findByUserId(3) → SELECT * FROM wardrobe WHERE userId = 3      │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ JDBC
┌───────────────────────────────────────────────────────────────────┐
│  DATABASE (MySQL)                                                  │
│  • Execute SQL queries                                            │
│  • Return resultsets                                              │
│  • Transaction management                                         │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Results
┌───────────────────────────────────────────────────────────────────┐
│  AI ALGORITHM EXECUTION                                            │
│  OutfitCombinationService.calculateCompatibility()                │
│                                                                   │
│  For each wardrobe item:                                          │
│    • Color Match:    isColorMatch('White', 'Blue') → 40 pts      │
│    • Type Match:     isTypeMatch('Shirt', 'Jeans') → 30 pts      │
│    • Pattern Match:  isPatternMatch('Solid', 'Solid') → 20 pts   │
│    • Season Match:   isSeasonMatch('All', 'All') → 10 pts        │
│    • Total Score:    100/100                                      │
│    • Rating:         "Excellent Match"                            │
│                                                                   │
│  Result: 5 matching items with scores [100, 100, 100, 85, 75]    │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  RESPONSE BUILDING                                                 │
│  • Create JSON response object                                    │
│  • Include suggestions array                                      │
│  • Include style tips array                                       │
│  • Set HTTP status: 200 OK                                        │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP Response
┌───────────────────────────────────────────────────────────────────┐
│  FRONTEND RECEIVES RESPONSE                                        │
│  • Parse JSON data                                                │
│  • Update component state: setSuggestions(data.suggestions)       │
│  • Update UI state: setActiveTab('suggestions')                   │
│  • setLoading(false)                                              │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  UI RENDERING                                                      │
│  • Switch to Suggestions tab                                      │
│  • Render suggestion cards with Framer Motion animation          │
│  • Display match score badges (color-coded)                       │
│  • Show style tips section                                        │
│  • User sees 5 matching items with 100/100 scores                │
└───────────────────────────────────────────────────────────────────┘
```

---

## External Services Integration

### Email Service (Gmail SMTP)
```
┌────────────────────────────────────────────────────────────────┐
│                  Email Service Architecture                     │
└────────────────────────────────────────────────────────────────┘

CONFIGURATION (application.properties):
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

WORKFLOW:

Backend Service
┌────────────────────────────┐
│  EmailService.java         │
│  @Service                  │
│                            │
│  sendPasswordResetEmail()  │
│    • Generate 6-digit code │
│    • Create email message  │
│    • Call JavaMailSender   │
└────────────────────────────┘
          │
          ▼
┌────────────────────────────┐
│  JavaMailSender            │
│  (Spring Framework)        │
│  • SMTP Connection         │
│  • TLS Encryption          │
└────────────────────────────┘
          │
          ▼ SMTP Protocol (Port 587)
┌────────────────────────────┐
│  Gmail SMTP Server         │
│  smtp.gmail.com            │
│  • Authenticate sender     │
│  • Queue message           │
│  • Deliver to recipient    │
└────────────────────────────┘
          │
          ▼
┌────────────────────────────┐
│  User's Email Inbox        │
│  Subject: Password Reset   │
│  Code: 847362              │
│  Valid for: 15 minutes     │
└────────────────────────────┘

DEVELOPMENT MODE:
• Email service logs to console
• No actual emails sent
• Codes printed in backend terminal
• Useful for testing without SMTP setup
```

### Google OAuth 2.0 (Planned)
```
┌────────────────────────────────────────────────────────────────┐
│                  OAuth Authentication Flow                      │
└────────────────────────────────────────────────────────────────┘

Step 1: User clicks "Continue with Google"
Frontend → Redirect to Google consent screen

Step 2: Google Authorization
• User logs in with Google account
• User grants permissions
• Google returns authorization code

Step 3: Backend exchanges code for token
POST https://oauth2.googleapis.com/token
• Send authorization code
• Receive access token + user profile

Step 4: User profile retrieval
GET https://www.googleapis.com/oauth2/v1/userinfo
• Access token in header
• Receive: email, name, picture

Step 5: Backend creates/retrieves user
• Check if email exists in database
• If yes: Login existing user
• If no: Create new user with authProvider='google'
• Generate JWT token
• Return to frontend

Step 6: Frontend stores token
• Save JWT in localStorage
• Redirect to home page
```

---

## Performance & Optimization

### Backend Performance
```
Optimization Techniques:

1. Database Connection Pooling (HikariCP)
   • Pool Size: 10 connections
   • Reuses connections instead of creating new ones
   • Result: Faster database access

2. JPA Query Optimization
   • Use @Query annotations for custom queries
   • Fetch only required columns (projections)
   • Avoid N+1 query problem

3. Caching (Planned)
   • Spring Cache (@Cacheable)
   • Cache expensive calculations
   • Cache master data (occasions, trends)

4. Async Processing (Planned)
   • @Async for email sending
   • Non-blocking operations
   • Better response times
```

### Frontend Performance
```
Optimization Techniques:

1. Code Splitting
   • React.lazy() for route-based splitting
   • Load components on demand
   • Smaller initial bundle size

2. Production Build
   • Vite production build
   • Minification & tree-shaking
   • Optimized assets

3. Image Optimization
   • Lazy loading images
   • WebP format (planned)
   • Responsive images

4. Caching
   • Browser cache for static assets
   • LocalStorage for user data
   • API response caching (planned)
```

---

## Summary - Architecture Highlights

### Key Architectural Decisions

1. **Three-Tier Architecture**
   - Clear separation: Frontend, Backend, Database
   - Independent scaling of each tier
   - Technology flexibility

2. **RESTful API Design**
   - Resource-based endpoints
   - Standard HTTP methods
   - Stateless communication

3. **Service-Oriented Architecture (Backend)**
   - Business logic in service layer
   - Reusable services
   - Easy to test and maintain

4. **Component-Based UI (Frontend)**
   - React components
   - Reusable UI elements
   - Declarative programming

5. **Security-First Approach**
   - BCrypt password hashing
   - JWT token authentication
   - HTTPS in production

6. **AI-Powered Core**
   - OutfitCombinationService as central engine
   - Sophisticated matching algorithms
   - Real-time recommendations

### Technology Choices Rationale

| Choice | Reason |
|--------|--------|
| **React 19** | Modern, efficient, large ecosystem |
| **TypeScript** | Type safety, better IDE support |
| **Spring Boot** | Enterprise-grade, auto-configuration |
| **MySQL** | Reliable, widely used, good performance |
| **Tailwind CSS** | Rapid development, consistent design |
| **Framer Motion** | Smooth animations, great UX |

---

## Diagram Creation Guide

Use this document to create the following architecture diagrams:

1. **High-Level System Architecture**
   - 3 layers: Client, Application Server, Database
   - External services (Email)
   - Communication protocols

2. **Component Architecture Diagram**
   - Frontend components breakdown
   - Backend packages breakdown
   - Relationships between components

3. **Deployment Architecture Diagram**
   - Development environment
   - Production environment (recommended)
   - Server configurations

4. **Database Schema Diagram**
   - All 7 tables
   - Primary keys, foreign keys
   - Relationships (one-to-many, etc.)

5. **API Architecture Diagram**
   - All REST endpoints
   - Request/response flow
   - Authentication flow

6. **Security Architecture Diagram**
   - Authentication mechanism
   - Password hashing
   - JWT token flow

7. **Data Flow Diagram**
   - Complete request lifecycle
   - From user action to UI update
   - All layers involved

This documentation provides all the details needed to create comprehensive, accurate system architecture diagrams! 🎯

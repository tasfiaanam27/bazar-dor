# বাজার দর | Bazar Dor

### A Smart Grocery Market Price Tracking Platform

**বাজার দর (Bazar Dor)** is a responsive grocery market price tracking web application designed to help users explore and compare the latest prices of essential grocery products in Bangladesh.

The platform provides information about daily price changes, product categories, and market-specific prices through a clean, user-friendly Bengali interface. Users can browse products, identify price increases and decreases, and securely access detailed market information.

## 🚀 Live Website

**Live Link:** Coming soon — Vercel deployment pending.
**Github Link:** 

## ✨ Key Features

### 1. 📊 Real-Time Grocery Price Tracking
- Displays grocery products with their current prices, units, and price changes.
- Highlights the top six products with the highest price increases and decreases.
- Features a continuously scrolling price ticker for quick market updates.

### 2. 🛍️ Category-Based Product Browsing
- Organizes grocery products into eight categories for easy navigation.
- Allows users to explore products based on their selected category.
- Provides sorting options for default order, price low to high, and price high to low.
- Includes responsive product cards and loading skeletons.

### 3. 📈 Detailed Product and Market Price Information
- Provides dedicated product detail pages for authenticated users.
- Displays product descriptions, categories, and measurement units.
- Shows minimum, maximum, and average prices.
- Presents market-wise price information for easier comparison.

### 4. 🔐 Secure Authentication and User Profiles
- Implements authentication using Better Auth.
- Supports email/password registration and login.
- Integrates Google and GitHub social authentication.
- Provides protected routes, logout functionality, and user profile management.
- Allows users to update their profile name.

### 5. 📱 Responsive and User-Friendly Interface
- Responsive design for mobile, tablet, and desktop devices.
- Bengali interface with clear navigation and visual price indicators.
- Interactive notifications using React Hot Toast.
- Custom 404 pages and loading states for an improved user experience.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack React framework and App Router |
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling and layouts |
| Better Auth | Authentication and session management |
| MongoDB Atlas | Cloud database for authentication data |
| Google OAuth | Google account authentication |
| GitHub OAuth | GitHub account authentication |
| React Hot Toast | Success and error notifications |
| Lucide React | Interface icons |
| Vercel | Application deployment |

## 📄 Pages and Routes

| Route | Description |
|---|---|
| `/` | Homepage with grocery products and price trends |
| `/category/[slug]` | Category-specific products and sorting |
| `/products/[id]` | Protected product details and market prices |
| `/signin` | Email/password and social login |
| `/signup` | User registration |
| `/profile` | User profile information |
| `/profile/update` | Update profile name |
| Unknown routes | Custom 404 page |

## ⚙️ Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/tasfiaanam27/bazar-dor.git
cd bazar-dor
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root and add:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Never commit actual credentials or secret values to GitHub.

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit `http://localhost:3000` in your browser.

## 🌐 API Integration

The application uses the Programming Hero Bazar Dor API to retrieve grocery products and category information.

**Base API URL:**

```text
https://openapi.programming-hero.com/api/bazardor
```

**Available endpoints:**

```text
/products
/products/:id
/products?category=chal
/categories
/categories/:slug
```

## 🔒 Authentication

The application uses **Better Auth** with **MongoDB Atlas** for user authentication and account management.

Supported authentication methods include email/password, Google OAuth, and GitHub OAuth. Protected product detail pages require users to sign in.

## 🎯 Project Purpose

Bazar Dor aims to make grocery price information more accessible and understandable for users in Bangladesh. By presenting market prices, daily changes, and product comparisons in one place, the application helps users make more informed shopping decisions.



Developed as part of **Programming Hero — Batch 14, Assignment 7**.

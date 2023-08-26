# PLOTLINE, Backend Development Internship
## Riddhishwar S, 20BDS0001, VIT (Vellore Institute of Technology)
#### College_Email : riddhishwar.s2020@vitstudent.ac.in , personal_Email: riddhishwarmayurie2002@gmail.com

An online billing system is essential for businesses to manage their invoicing, payments, and financial transactions efficiently. Your task is to develop a Node.js server for a billing system that provides seamless functionality and a user-friendly experience.

*Note: Please take the Jwt token when you do the following actions and place it in Headers Authorization(Bearer [Replace it here]) for both User/Admin whenever necessary.*

## Guidence to run the code Locally
### Install npm packages
```
npm install
```
### To run the server in Production phase
```
npm run start
```
### To run the server in Development phase
```
npm run dev
```
## Click each collection name to see the description:

### Collection:
1. [User Authentication](#user-authentication)
2. [Products and Services](#products-and-services)
3. [Order](#order)
4. [Cart](#cart)

## Guidance:

### User Authentication:
#### Signup
**Request Payload:**
- Name
- Email
- Password
- PhoneNumber
- Default: User (If it's Admin, mention it as role:"Admin")

**Response:**
- Jwt (Json web token)

#### Signin
**Request Payload:**
- Email
- Password

**Response:**
- Jwt (Json web token)

### Products and Services

#### Admin
- Add Product/Service
- Update Product/Service
- View the full Product/Services

#### User
- View the full product/Services

### Order
#### User:
- Confirm the order
- View the order

### Cart
#### User
- Adding item to cart
- View the cart (with full amount, including tax)
- Update cart item based on the user_id
- Delete an item from the cart

### Tax Calculation:
The company offers various products and services, each with its own pricing. A user can create his account, add/remove items to/from their cart, and view his total bill during checkout.

**Integrate tax calculation based on the price range of the product using the following rules:**
- Apply Tax PA if the price range of the product is greater than 1000 and less than or equal to 5000. The tax percentage should be 12% of the price.
- Apply Tax PB if the price of the product is above 5000. The tax percentage should be 18% of the price.
- Apply Tax PC to all products with a flat tax amount of 200.

**Integrate tax calculation based on the price range of the services using the following rules:**
- Apply Tax SA if the price range of the service is greater than 1000 and less than or equal to 8000. The tax percentage should be 10% of the price.
- Apply Tax SB if the price of the service is above 8000. The tax percentage should be 15% of the price.
- Apply Tax SC to all services with a flat tax amount of 100.

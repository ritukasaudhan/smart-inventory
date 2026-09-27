\# SmartStock — Inventory \& Sales Analytics Platform



SmartStock is a full-stack inventory and sales analytics web application that helps businesses monitor sales, products, customers, and inventory.



\## Features



\- Dashboard with sales and business metrics

\- Product management and product information

\- Inventory and low-stock monitoring

\- Sales tracking and transaction details

\- Customer information and analysis

\- Sales and category analytics



\## Tech Stack



\- Frontend: React.js, JavaScript, Vite, Recharts

\- Backend: Node.js, Express.js

\- Database: PostgreSQL

\- Tools: Git, GitHub, VS Code



\## System Architecture



Olist Historical Dataset  

↓  

PostgreSQL Database  

↓  

Node.js + Express REST API  

↓  

React Frontend  

↓  

SmartStock Dashboard



\## Data Flow



1\. Data is stored in PostgreSQL.

2\. The Node.js and Express backend receives requests from the frontend.

3\. SQL queries retrieve and calculate the required business data.

4\. The backend sends the results through REST APIs.

5\. React fetches the API data.

6\. The dashboard displays the data using cards, tables, and charts.



\## Database Design



SmartStock uses PostgreSQL as its relational database.



Main tables:



\- `customers` — stores customer information

\- `products` — stores product information

\- `orders` — stores order details

\- `order\_items` — stores products included in each order

\- `payments` — stores payment information

\- `inventory` — stores stock and reorder-level information



\## Analytics



SmartStock provides the following analytics:



\- Total revenue

\- Total orders

\- Total customers

\- Units sold

\- Average order value

\- Monthly sales trends

\- Top products by revenue

\- Category-wise sales performance



\## Inventory Logic



SmartStock includes a project-specific inventory management layer.



It tracks:



\- Current stock

\- Reorder level

\- Last updated time

\- Low-stock products



The Olist dataset does not contain actual historical inventory quantities, so the inventory values are managed separately in the SmartStock inventory table.



\## Dataset



SmartStock uses the Brazilian E-Commerce Public Dataset by Olist.



The dataset contains historical e-commerce data related to:



\- Customers

\- Products

\- Orders

\- Order items

\- Payments

\- Sellers

\- Reviews

\- Geolocation



Dataset source:



https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce



The dataset contains historical data and is not a live data source.



\## Project Structure



```text

smart-inventory/

├── backend/

├── frontend/

├── data/

├── .gitignore

└── README.md



\## API Endpoints



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/` | Check backend status |

| GET | `/api/test-db` | Test PostgreSQL connection |

| GET | `/api/products` | Get product data |

| GET | `/api/customers` | Get customer data |

| GET | `/api/inventory` | Get inventory data |

| GET | `/api/sales` | Get sales data |

| GET | `/api/analytics` | Get analytics data |



\## Getting Started



\### Prerequisites



Make sure you have these installed:



\- Node.js

\- PostgreSQL

\- Git

\- npm



\### Clone the Repository



```bash

git clone https://github.com/ritukasaudhan/smart-inventory.git

cd smart-inventory





\### Start the Backend



Open Command Prompt and run:



```bash

cd backend

npm install

node index.js

```



The backend runs on:



```text

http://localhost:5000

```



\### Start the Frontend



Open another Command Prompt and run:



```bash

cd frontend

npm install

npm run dev

```



The frontend normally runs on:



```text

http://localhost:5173

```



\## Key Technical Highlights



\- Built a full-stack web application

\- Developed REST APIs using Node.js and Express

\- Designed and managed a PostgreSQL database

\- Wrote SQL queries for business analytics

\- Connected React frontend with backend APIs

\- Used Recharts for data visualization

\- Implemented inventory and reorder-level monitoring

\- Used Git and GitHub for version control



\## Business Use Cases



SmartStock can help businesses:



\- Monitor sales performance

\- Identify high-performing products

\- Analyze category-wise sales

\- Monitor inventory levels

\- Identify products that need reordering

\- Understand historical sales trends

\- Support data-driven business decisions



\## Limitations



\- The Olist dataset contains historical data, not real-time transactions.

\- The original dataset does not provide actual inventory quantities.

\- Inventory values are managed separately through the SmartStock inventory table.

\- Product cost information is not available, so profit margin is not calculated.

\- This project is a portfolio application and is not intended to be a production ERP system.



\## Future Improvements



\- User authentication and role-based access

\- Real-time inventory updates

\- Automated low-stock notifications

\- Supplier management

\- Purchase order management

\- Sales forecasting

\- Exportable business reports

\- Cloud deployment

\- Advanced dashboard filtering



\## Learning Outcomes



Through this project, I gained practical experience in:



\- Building a full-stack web application

\- Designing relational databases

\- Writing SQL queries

\- Creating REST APIs

\- Connecting React with a backend

\- Working with real-world datasets

\- Creating business dashboards and data visualizations

\- Using Git and GitHub for version control



\## Author



\*\*Ritu Kasaudhan\*\*



B.Tech — Information Technology  

KIIT University



GitHub: https://github.com/ritukasaudhan



\## License



This project is developed for educational and portfolio purposes.



The Olist dataset used in this project is subject to its original CC BY-NC-SA 4.0 license and attribution requirements.


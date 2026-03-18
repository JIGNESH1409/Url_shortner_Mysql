
# URL Shortener (Node.js + MySQL) -https://url-shortner-mysql.vercel.app/login

A full‑stack URL Shortener application built with **Node.js, Express, EJS, and MySQL**, deployed using **Render** (backend) and **Railway** (database).

This project allows users to generate short URLs for long links and redirect to the original URL using the generated shortcode.

---

## 🚀 Features

* Generate short URLs for long links
* Custom shortcode support
* Automatic unique shortcode generation
* Redirect short URLs to original URLs
* MySQL database with auto‑increment primary keys
* Server‑side rendering using EJS
* Production‑ready deployment

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MySQL (Railway)
* **View Engine:** EJS
* **ORM / Driver:** mysql2 (promise)
* **Deployment:** Render (Backend), Railway (Database)

---

## 📂 Project Structure

```
src/
├── config/
│   ├── db.client.js      # MySQL connection
│   └── env.js            # Environment variable validation
│
├── controllers/
│   ├── PostShortner.controller.js
│   ├── RendertoshortUrl.controller.js
│   └── UpdateShortner.controller.js
│
├── model/
│   └── Shortner.model.js # Database queries
│
├── routes/
│   └── shorturl.routes.js
│
├── views/
│   └── index.ejs         # UI
│
├── app.js                # App entry point
└── package.json
```

---

## 🗄 Database Schema

```sql
CREATE TABLE url_short_link (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shorturl VARCHAR(255) UNIQUE,
  url TEXT NOT NULL
);
```

---

## ⚙️ Environment Variables

Create the following variables in **Render**:

```text
PORT=3000
DATABASE_HOST=<your-db-host>
DATABASE_PORT=<your-db-port>
DATABASE_USER=<your-db-user>
DATABASE_PASSWORD=<your-db-password>
DATABASE_NAME=railway
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🌐 Deployment

* **Backend:** Deployed on Render
* **Database:** Hosted on Railway MySQL
* Database connection uses a public Railway endpoint
* Port configuration handled via environment variables

---

## 🧠 Learnings

* Handling production MySQL connections
* Debugging cloud networking and port issues
* Schema design with AUTO_INCREMENT primary keys
* Environment‑based configuration
* Deploying Node.js apps to Render

---

## 📌 Future Improvements

* URL expiration
* Click analytics
* User authentication
* REST API version
* Rate limiting

---

## 👨‍💻 Author

**Jignesh Pampaniya**

---

⭐ If you like this project, feel free to star the repository!

# 🔗 ChainExplorer | Professional Bitcoin Analytics

**ChainExplorer** is a high-speed, real-time Bitcoin blockchain explorer. It provides deep insights into network activity, including live block discovery, mempool monitoring, and a secure interface for simulating asset transfers.

## ✨ Key Features

* **Real-Time Mempool Monitor**: Watch unconfirmed transactions stream in via WebSockets before they are added to a block.
* **Live Block Feed**: Automatically updates the dashboard as new blocks are mined on the network.
* **Asset Transfer Simulation**: A secure wallet interface for generating public addresses from private keys and initializing transactions.
* **Deep Analytics**: Instant access to BTC Price ($64,231.00), Active Node counts (14,502), and Market Cap ($1.2T).
* **Glassmorphism UI**: A modern, dark-mode interface built with optimized React components and custom Inline CSS.

---

## 🚀 Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) (React)
* **Backend**: Node.js / Express
* **Real-time Data**: [Socket.io](https://socket.io/)
* **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose
* **Styling**: Custom Inline CSS (High-Performance Rendering)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/base_wallet_frontend.git](https://github.com/your-username/base_wallet_frontend.git)
cd base_wallet_frontend

2. Install Dependencies
Ensure you have Node.js installed, then run:

Bash
npm install
3. Environment Variables
Create a .env.local file in the root directory and add your connection strings:

Code snippet
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:3600
4. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 to view the application.

📂 Project Structure
Plaintext
├── components/          # Reusable UI components (Navbar, etc.)
├── pages/
│   ├── api/             # Next.js API routes
│   ├── blocks/          # Block listing and detail pages
│   ├── mempool.js       # Live Mempool monitor
│   ├── sendBTC.js       # Transfer interface
│   └── index.js         # Landing page / Dashboard Dashboard
├── public/              # Static assets (logos, icons)
└── styles/              # Global CSS overrides
🔧 Troubleshooting
Build Fails (Module Not Found):
If the build fails due to missing backend utility files, ensure the Backend folder is correctly linked or moved into the frontend directory to satisfy Webpack's resolution rules.

Images Not Loading:
Ensure all <Image /> components in Navbar.js include defined width and height properties as per Next.js optimization requirements.

📜 License
Distributed under the MIT License. See LICENSE for more information.

Developed with ❤️ by Hassan Ahmed Khan


---

### 💡 How to make it look even better on GitHub:
GitHub renders Markdown automatically. Once you upload this, the headings will be large, the code blocks will be highlighted, and the bullet points will be clean.

**Would you like me to help you write a professional "Commit Message" for when you push all these new files and designs to GitHub?**

# ❤️ Lovereel

A romantic digital gift application to create and share your favorite memories with your valentine.
Create a personalized film reel with photos, music, and animations, and share it via a unique link!

## ✨ Features

- **Personalized Accounts**: Sign up to create your own private reel.
- **Vanity URLs**: Share your reel with a custom link: `localhost:3000/your-name`.
- **Photo Uploads**: Add your favorite memories with captions.
- **Cinematic Slideshow**:
    -   Smooth Ken Burns effect transitions.
    -   Floating hearts and falling rose petals.
    -   Background music.
- **Interactive Proposal**: A surprise ending screen with "Will you be my Valentine?" (or a proposal!).

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a MongoDB Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd Lovereel
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    # Create .env file with:
    # MONGO_URI=mongodb://localhost:27017/lovereel
    # JWT_SECRET=your_secret_key
    npm start
    ```
    Server runs on `http://localhost:5000`.

3.  **Setup Client**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Client runs on `http://localhost:3000`.

## 📖 Usage

1.  **Sign Up**: Create an account with your Name and Email. Your `username` will be auto-generated from your name.
2.  **Add Memories**: Upload photos and add quotes/captions.
3.  **Share**: Click the **Link Icon 🔗** to copy your unique shareable link.
4.  **View**: Send the link to your valentine! They can view the slideshow without logging in.

## 💌 Credits

Made with ❤️ for Valentine's Day.

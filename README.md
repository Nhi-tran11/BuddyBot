# BuddyBot - Learning Made Magical!

BuddyBot is an educational platform designed to make learning fun and interactive for children. It offers features such as engaging lessons, quizzes, and educational games. Parents can create personalized timetables for their children, use AI to generate customized assignments, and track their child’s learning progress. The platform aims to support both kids and parents by providing a structured yet enjoyable learning experience.

## Project Structure

```
/
├── backend/         # Node.js/Express backend (API, DB, AI integration)
├── src/             # React frontend source code
├── public/          # Static assets for frontend
├── build/           # Production build output
├── index.html       # Main HTML entry point
├── package.json     # Frontend dependencies and scripts
└── README.md
```

## Prerequisites

- Node.js (v16+ recommended)
- React v19.1.0
- npm (v8+ recommended)
- MongoDB (local or cloud instance)
- Google Gemini's API key

---

## 1. Start the Backend

1. Open a terminal and navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2. Install backend dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory with the following variables:
    ```
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    API_KEY=your_google_genai_api_key
    ```

4. Start the backend server:
    ```sh
    npm run dev
    ```
    The backend will run on [http://localhost:5000](http://localhost:5000).

---

## 2. Start the Frontend

1. Open a new terminal and navigate to the project root (where `package.json` is located).

2. Install frontend dependencies:
    ```sh
    npm install
    ```

3. Start the React development server:
    ```sh
    npm start
    ```
    The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## 3. Running Unit Tests

### Frontend (React)

From the project root, run:
```sh
npm test
```
This will launch the test runner for the React app (using [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/)).

### Backend (Node.js/Express)

From the `backend` directory, run:
```sh
npm run test
```
This will run backend tests using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest).

---


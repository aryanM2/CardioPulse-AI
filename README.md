# Heart Disease Prediction System

A full-stack web application for assessing heart disease risk using Machine Learning. The system takes clinical patient data (age, blood pressure, cholesterol, ECG, etc.) and predicts heart disease probability along with risk levels and recommendations.

Built with a React frontend, Node.js Express backend, and a Python FastAPI service running a trained Scikit-Learn machine learning model.

## Features

- **Risk Assessment Form**: Interactive form for entering patient health metrics and clinical test results.
- **Real-Time Prediction**: ML microservice processes input data and calculates risk probability (Low, Moderate, High).
- **"What-If" Simulator**: Adjust health metrics dynamically to see how lifestyle changes could reduce predicted risk.
- **Diagnostic Reports**: View and print clinical summary reports.
- **Patient History**: Saves past assessments locally for reference.
- **Docker Support**: Run the entire stack using Docker Compose.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend Gateway**: Node.js, Express
- **ML Microservice**: Python, FastAPI, Scikit-Learn, Pandas, Joblib
- **Containerization**: Docker, Docker Compose

## Project Structure

```
heart-Disease/
├── client/           # React frontend (Vite)
├── server/           # Node.js Express server
├── ml_service/       # Python FastAPI ML microservice & model (.pkl) files
├── docker-compose.yml
└── package.json
```

## How to Run

### Option 1: Using Docker Compose (Recommended)

Make sure Docker and Docker Compose are installed, then run:

```bash
docker-compose up --build
```

- Frontend UI: http://localhost:5173
- Express Server: http://localhost:5000
- FastAPI Docs: http://localhost:8000/docs

---

### Option 2: Running Locally

You will need Node.js and Python installed.

#### 1. ML Service (FastAPI & Training)
```bash
cd ml_service
pip install -r requirements.txt

# To run the prediction service:
python main.py

# To train / retrain the ML model on the dataset:
python train.py                 # Evaluates and trains models (Logistic, RF, GB)
python train.py --model rf      # Trains & exports Random Forest
python train.py --model logistic # Trains & exports Logistic Regression

# To evaluate an existing model on the dataset:
python evaluate_existing.py
```
*(Runs on `http://localhost:8000`)*

#### 2. Express Server (Node.js)
```bash
cd server
npm install
npm start
```
*(Runs on `http://localhost:5000`)*

#### 3. Frontend Client (React + Vite)
```bash
cd client
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## Free Cloud Deployment Guide

You can deploy the entire full-stack project for free using **Render.com** (via the included `render.yaml` Blueprint) or **Vercel + Render**:

### Method 1: 1-Click Blueprint on Render.com (Recommended & 100% Free)
1. Push your project to a GitHub repository.
2. Sign up / Log in to [Render.com](https://render.com/) with GitHub.
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository. Render will automatically read `render.yaml` and provision:
   - **`heart-disease-client`**: React Frontend as a high-speed Static Site (100% free, no sleep).
   - **`heart-disease-server`**: Express API Gateway Web Service (Free tier).
   - **`heart-disease-ml`**: Python FastAPI ML Microservice (Free tier).
5. Click **Apply**. Render will build and deploy all 3 tiers automatically with live HTTPS URLs!

---

## Input Parameters

The model evaluates the following clinical features:
- **Age & Sex**
- **Resting Blood Pressure** (`restingBP`)
- **Serum Cholesterol** (`cholesterol`)
- **Fasting Blood Sugar** (`fastingBS`)
- **Resting ECG** (`Normal`, `ST`, `LVH`)
- **Max Heart Rate** (`maxHR`)
- **Exercise Angina** (`Y` / `N`)
- **Oldpeak** (ST depression)
- **Chest Pain Type** (`TA`, `ATA`, `NAP`, `ASY`)
- **ST Slope** (`Up`, `Flat`, `Down`)

## Disclaimer

This application is built for educational and demonstration purposes. It is not intended for official medical diagnosis or clinical decision-making.

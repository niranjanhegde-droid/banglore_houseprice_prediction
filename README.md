# 🏡 Home Price Prediction Web App (In Bengaluru only)

A machine learning-powered web application built with **Flask** that predicts home prices in Bengaluru based on user input features such as area, location, number of bedrooms and bathrooms, etc. The app also integrates **OpenStreetMap** to allow users to visualize the location of the selected area.

---

## 🛠️ Technologies Used

- 🔮 **Python** – Backend & ML Model
- ⚗️ **Flask** – Lightweight web framework
- 🤖 **Scikit-learn** – For training and saving the prediction model
- 📊 **Pandas & NumPy** – Data manipulation
- 🌐 **HTML/CSS/JavaScript** – Frontend interface
- 🗺️ **OpenStreetMap + Leaflet.js** – Location mapping
- 💾 **Joblib** – For model serialization
- 🔌 **Flask-CORS** – Handling CORS policies

---

## ✨ Features

- 🔍 Predicts the price of a home based on various user inputs
- 📍 OpenStreetMap integration to show property location
- 🎯 Fast and accurate ML model trained on real-world housing data
- 🎨 Clean and responsive user interface
- 🧠 Pre-trained ML model using `LinearRegression` (or customizable)
- 🚀 Easy to set up and run locally

---

## 🧭 How to Run This Project on Your Machine

###  Clone the Repository
```bash
https://github.com/niranjanhegde-droid/banglore_houseprice_prediction
cd banglore_houseprice_prediction
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate 


# Activate (macOS/Linux)
source venv/bin/activate
pip install -r requirements.txt

python server/app.py

Go to: http://127.0.0.1:5000




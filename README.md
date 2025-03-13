# nsp-analysis


# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pandas nltk scikit-learn python-multipart  textblob

pip install fastapi uvicorn pandas numpy nltk scikit-learn textblob python-multipart

# Run the server
uvicorn main:app --reload



# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm start
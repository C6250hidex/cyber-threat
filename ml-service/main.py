from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import joblib
import os
from utils.trainer import train_and_compare

app = FastAPI(title="Cybersecurity ML Service")

MODEL_FILE = "models/best_model.joblib"

@app.get("/")
def read_root():
    return {"status": "ML Service is Online"}

@app.post("/train")
async def train_model(file: UploadFile = File(...)):
    # Save uploaded dataset temporarily
    file_path = f"datasets/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    try:
        results = train_and_compare(file_path)
        return {"message": "Training complete", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(data: dict):
    if not os.path.exists(MODEL_FILE):
        raise HTTPException(status_code=400, detail="No model trained yet.")
    
    model = joblib.load(MODEL_FILE)
    
    # Convert input data to DataFrame for prediction
    input_df = pd.DataFrame([data])
    
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df).max()
    
    return {
        "prediction": str(prediction),
        "confidence": float(probability)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
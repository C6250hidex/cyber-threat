import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import joblib
import os

MODELS_PATH = "models/"

def train_and_compare(data_path):
    # Load dataset
    df = pd.read_csv(data_path)
    
    # Simple Preprocessing (Assume last column is 'label')
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "RandomForest": RandomForestClassifier(),
        "DecisionTree": DecisionTreeClassifier(),
        "SVM": SVC(probability=True)
    }
    
    best_model = None
    best_accuracy = 0
    model_name = ""
    
    results = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        acc = accuracy_score(y_test, predictions)
        results[name] = acc
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            model_name = name

    # Save the best model
    joblib.dump(best_model, os.path.join(MODELS_PATH, "best_model.joblib"))
    
    return {"best_model": model_name, "accuracy": best_accuracy, "all_results": results}
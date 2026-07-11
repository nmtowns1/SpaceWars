
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn.ensemble import RandomForestClassifier

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Snapshot(BaseModel):
    playerX: float
    playerDirection: int
    invaderX: float
    invaderY: float
    result: int

class TrainingData(BaseModel):
    snapshots: List[Snapshot]


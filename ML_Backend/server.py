
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn.ensemble import RandomForestClassifier

app = FastAPI() 


#By default, browsers block cross-origin requests. To allow cross-origin requests, 
# you can use the CORSMiddleware in FastAPI. This middleware allows you to specify 
# which origins are allowed to access your API, as well as which HTTP methods and 
# headers are allowed.
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


#create the Random Forest Classifier model
ai_model = RandomForestClassifier()

#create the endpoint to train the model
@app.post("/train")
def train_model(data: TrainingData):
    #extract the features and labels from the training data
    #Machine learning algorithms need date split into two piles: features and labels.
    #  Features are the input variables that the model uses to make predictions, while 
    # labels are the output variables that the model is trying to predict. In this 
    # case, the features are playerX, playerDirection, invaderX, and invaderY, while 
    # the label is result.
    X = [[snapshot.playerX, snapshot.playerDirection, snapshot.invaderX, snapshot.invaderY] for snapshot in data.snapshots]
    y = [snapshot.result for snapshot in data.snapshots]

    #train the model
    ai_model.fit(X, y)

    return {"message": "Model trained successfully.",
            "accuracy": ai_model.score(X, y),
            "total_snapshots processed": len(data.snapshots)}  #return the accuracy of the model on the training data

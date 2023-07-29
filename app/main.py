from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import re

from app.config import *

# to start app cd to project root directory and run:
# uvicorn app.main:app --reload
# reference: https://fastapi.tiangolo.com/#run-it

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/video")
async def read_item(info: Request):
    data = await info.json()
    # data = data['latexText']


@app.post("/audio")
async def read_item(info: Request):
    pass
from fastapi import FastAPI, Depends, HTTPException
#Allow frontend to talk to backend
from fastapi.middleware.cors import CORSMiddleware
#Database session to add and delete records
from sqlalchemy.orm import Session
import models
import database
from pydantic import BaseModel

#Create the jobs table in jobs.db
models.Base.metadata.create_all(bind=database.engine)

#Create FastAPI app instance
app = FastAPI()

#Allow requests from localhost or github
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://michaelwestern1.github.io",
        "https://michaelwestern1.github.io/job-track/",
        "https://michaelwestern1.github.io"
    ],
    #Allow all methods like GET and Post, and allow all headers
allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Define the fields needed for a job record
class JobBase(BaseModel):
    title: str
    company: str
    date_applied: str
    status: str


class JobCreate(JobBase):
    pass

#Inherit for JobBase, and add id
class Job(JobBase):
    id: int

#Pydantic recieves SQLAlchemy ORM objects
    class Config:
        orm_mode = True


#Returns a DB session
def get_db():
    db = next(database.get_db())
    return db


#Get all job records from the database
@app.get("/api/jobs", response_model=list[Job])
def read_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).all()


@app.post("/api/jobs", response_model=Job)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@app.put("/api/jobs/{job_id}", response_model=Job)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    #Update the SQLAlchemy object fields
    for key, value in job.dict().items():
        setattr(db_job, key, value)

    #Save the changes
    db.commit()
    db.refresh(db_job)
    return db_job


@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://michaelwestern1.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Pydantic schemas
class JobBase(BaseModel):
    title: str
    company: str
    date_applied: str
    status: str


class JobCreate(JobBase):
    pass


class Job(JobBase):
    id: int

    class Config:
        orm_mode = True


# ✅ Dependency
def get_db():
    db = next(database.get_db())
    return db


# ✅ Routes
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

    for key, value in job.dict().items():
        setattr(db_job, key, value)

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

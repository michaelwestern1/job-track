from sqlalchemy import Column, Integer, String
from backend.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    date_applied = Column(String)
    status = Column(String)

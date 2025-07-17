#Import Column, Integer and String for building a table 
from sqlalchemy import Column, Integer, String

from database import Base


class Job(Base):
    #Name the table jobs
    __tablename__ = "jobs"

    #Create the columns for the table
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    date_applied = Column(String)
    status = Column(String)

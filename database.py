#Import create_engine to establish a connection to the database
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
#Import sessionmaker to create new database sessions
from sqlalchemy.orm import sessionmaker

#Create a file named jobs.db in the current directory
SQLALCHEMY_DATABASE_URL = "sqlite:///./jobs.db"

#Create the database engine, allowing multiple threads to use the same connection
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

#Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Create the base class that all models inherit from
Base = declarative_base()

def get_db():
    #Create new session
    db = SessionLocal()
    try:
        #Let the calling route use the session
        yield db
    finally:
        #Ensure the session is closed after request is done
        db.close()

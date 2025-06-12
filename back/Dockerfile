FROM python:3.11-slim

RUN adduser --disabled-password --gecos '' appuser

WORKDIR /app

# Install bash
RUN apt-get update && apt-get install -y bash

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code and wait-for-it.sh
COPY . .
RUN chmod +x wait-for-it.sh

#CMD ["sh", "-c", "python init_db.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- python init_db.py && uvicorn main:app --host 0.0.0.0 --port 8000"]

FROM python:3.14-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY pyproject.toml ./

# Install Python dependencies
RUN pip install --no-cache-dir \
    "fastapi>=0.95.0" \
    "uvicorn[standard]>=0.38.0,<0.39.0" \
    "sqlalchemy>=2.0.44,<3.0.0" \
    "psycopg[binary]>=3.2.12,<4.0.0" \
    "pydantic-settings>=2.11.0,<3.0.0" \
    "alembic>=1.17.1,<2.0.0" \
    "email-validator>=2.3.0,<3.0.0" \
    "argon2-cffi>=23.1.0" \
    "python-jose[cryptography]>=3.5.0,<4.0.0" \
    "python-multipart>=0.0.20,<0.0.21" \
    "httpx>=0.27.0,<1.0.0"

# Copy application code
COPY ./app ./app

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
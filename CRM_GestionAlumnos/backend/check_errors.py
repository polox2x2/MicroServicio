import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

try:
    print("Importing app.models...")
    from app import models
    print("app.models imported successfully.")
except Exception as e:
    print(f"Error importing app.models: {e}")

try:
    print("Importing app.schemas...")
    from app import schemas
    print("app.schemas imported successfully.")
except Exception as e:
    print(f"Error importing app.schemas: {e}")

try:
    print("Importing app.main...")
    from app import main
    print("app.main imported successfully.")
except Exception as e:
    print(f"Error importing app.main: {e}")

print("SUCCESS")

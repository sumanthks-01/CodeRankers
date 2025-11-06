import os
import subprocess
import sys

# Start Django server
print("Starting Django server on 0.0.0.0:8000...")
try:
    subprocess.run([
        sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
    ], cwd=os.path.dirname(os.path.abspath(__file__)))
except KeyboardInterrupt:
    print("Server stopped.")
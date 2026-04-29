FROM python:3.12-slim

# Set up a new user named "user" with user ID 1000 (Required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy only the backend folder contents into the app directory
COPY --chown=user backend/ $HOME/app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Switch to the non-root user
USER user

# Expose port 7860, which is the port Hugging Face Spaces expects
EXPOSE 7860

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

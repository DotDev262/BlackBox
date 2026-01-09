# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Create a non-root user and group
RUN addgroup --system python && adduser --system --ingroup python python

# Set the working directory in the container to the user's home directory
WORKDIR /home/python/app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Change ownership of the /home/python/app directory to the python user
RUN chown -R python:python /home/python/app

# Switch to the non-root user
USER python

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
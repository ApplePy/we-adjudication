# Install project files on top of custom docker image
FROM registry.incode.ca/se3352a/requirements-assignment-2:latest

ENV NODE_ENV="production"

# The app will listen on port 80
EXPOSE 80

# Copy the code into the image
ADD BackEnd/studentsRecords /code

# Set the working directory for npm
WORKDIR "/code"

# Start box
ENTRYPOINT [ "npm", "start" ]
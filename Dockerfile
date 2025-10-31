# Use a lightweight Java 17 image
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy all project files to the container
COPY . .

# Give permission to mvnw (if needed)
RUN chmod +x ./mvnw

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the generated JAR file
CMD ["java", "-jar", "target/sudoku-solver-1.0.0.jar"]

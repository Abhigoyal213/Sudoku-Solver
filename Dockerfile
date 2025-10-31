# Use lightweight Java 17 image
FROM openjdk:17-jdk-slim

# Install Maven (Render doesn’t always include it)
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy project files
COPY . .

# Build the app using Maven (skip tests for faster build)
RUN mvn clean package -DskipTests

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Run the generated JAR file
CMD ["java", "-jar", "target/sudoku-solver-1.0.0.jar"]

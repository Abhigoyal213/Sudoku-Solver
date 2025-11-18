# Use Java 17 (Temurin)
FROM eclipse-temurin:17-jdk-jammy

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build using Maven
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run JAR
CMD ["java", "-jar", "target/sudoku-solver-1.0.0.jar"]

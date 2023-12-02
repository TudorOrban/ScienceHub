# Use an official Rust image
FROM rust:latest

# Set the working directory in the container
WORKDIR /usr/src/rust-microservice

# Copy the entire project, excluding what's listed in .dockerignore
COPY . .

# Build the application (this will create the binary in the debug folder)
RUN cargo build

# Set the startup command to run your binary
CMD ["./target/debug/sciencehub_version_control_system"]

FROM rust:latest as builder
WORKDIR /usr/src/myapp

# Define build-time environment variables if needed
ARG SOME_ENV_VARIABLE
ENV SOME_ENV_VARIABLE=$SOME_ENV_VARIABLE

COPY . .
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /usr/src/myapp/target/release/myapp /usr/local/bin/
CMD ["myapp"]

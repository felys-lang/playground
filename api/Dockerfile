FROM rust:alpine AS builder
RUN apk add --no-cache musl-dev

COPY cli /app/
WORKDIR /app
RUN cargo update && cargo build --release

FROM python:3.12-alpine

COPY --from=builder /app/target/release/cli /app/
COPY main.py requirements.txt /app/
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt

ENV CLI=/app/cli
EXPOSE 8000
CMD ["gunicorn", "main:app", \
    "-k", "uvicorn.workers.UvicornWorker", \
    "--workers", "20", \
    "--bind", "0.0.0.0:8000"]

FROM rust:bookworm AS builder

COPY cli /app/
WORKDIR /app/cli
RUN cargo update && cargo build --release

FROM python:3.12-slim-bookworm

COPY --from=builder /app/cli/target/release/cli /app/
COPY main.py requirements.txt /app/
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt

ENV CLI=/app/cli
CMD gunicorn main:app \
    -k uvicorn.workers.UvicornWorker \
    --workers 20 \
    --bind 0.0.0.0:8000

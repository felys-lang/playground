import subprocess

from fastapi import FastAPI, Request, Response

app = FastAPI()


@app.get("/")
async def root():
    return "exec.felys.dev"


@app.post('/execute')
async def execute(request: Request):
    json = await request.body()
    process = subprocess.Popen(
        ['cli/target/release/cli', json, str(100), str(0.9), str(42)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    try:
        stdout, stderr = process.communicate(timeout=1)
        response = stderr or stdout
    except subprocess.TimeoutExpired:
        process.kill()
        return Response("timeout", status_code=504)
    return response

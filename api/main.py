import os
import subprocess

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

CLI = os.getenv('CLI')
assert CLI
app = FastAPI(root_path='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['GET', 'POST'],
    allow_headers=['*'],
)


@app.get('/')
async def root():
    return 'exec.felys.dev'


@app.post('/execute')
async def execute(request: Request):
    json = await request.body()
    process = subprocess.Popen(
        [CLI, json, str(100), str(0.9), str(42)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    try:
        stdout, stderr = process.communicate(timeout=1)
    except subprocess.TimeoutExpired:
        process.kill()
        return Response(status_code=504)

    if stderr:
        return Response(stderr, status_code=500)
    return Response(stdout, media_type='application/json')

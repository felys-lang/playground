import os
import subprocess
import tempfile

from fastapi import FastAPI, Request, Response, HTTPException
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
    with tempfile.NamedTemporaryFile(delete=False) as f:
        f.write(json)
        f.flush()
        path = f.name

    try:
        process = subprocess.Popen(
            [CLI, path, str(100), str(0.9), str(42)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        try:
            stdout, stderr = process.communicate(timeout=1)
        except subprocess.TimeoutExpired:
            process.kill()
            raise HTTPException(status_code=504)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        if stderr:
            raise HTTPException(status_code=500, detail=stderr)
        return Response(stdout, media_type='application/json')

    finally:
        if os.path.exists(path):
            os.remove(path)

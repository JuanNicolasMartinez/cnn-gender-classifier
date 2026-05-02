#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
MODEL_PATH="$BACKEND_DIR/models/model.keras"
HF_REPO="JNicolasMartinezv/cnn-gender-classifier"
SPACE_REPO="JNicolasMartinezv/cnn-gender-api"
PYTHON="$BACKEND_DIR/venv/bin/python"

if [ ! -f "$MODEL_PATH" ]; then
    echo "Error: model.keras not found at $MODEL_PATH"
    exit 1
fi

echo "Uploading model to HF Hub..."
"$PYTHON" -c "
from huggingface_hub import HfApi
api = HfApi()
api.upload_file(
    path_or_fileobj='$MODEL_PATH',
    path_in_repo='model.keras',
    repo_id='$HF_REPO',
    repo_type='model',
)
print('Model uploaded.')
"

echo "Restarting Space..."
"$PYTHON" -c "
from huggingface_hub import HfApi
HfApi().restart_space('$SPACE_REPO')
print('Space restarting — will be live in ~1 minute.')
print('Check: https://huggingface.co/spaces/$SPACE_REPO')
"

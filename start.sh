#!/bin/bash

cd /home/runner/workspace/laravel-api && php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

sleep 2

cd /home/runner/workspace && npx vite --config vite.config.ts &
VITE_PID=$!

trap "kill $LARAVEL_PID $VITE_PID 2>/dev/null; exit" SIGTERM SIGINT

wait

@echo off
title Start Smart Garden Project

echo Iniciando Client...
cd /d "%~dp0smart-garden\Client"
start cmd /k "npm start"

echo Iniciando Server...
cd /d "%~dp0smart-garden\Server"
start cmd /k "npm start"

echo Iniciando Smart Garden AI...
cd /d "%~dp0smart-garden-ai"
start cmd /k "python main.py"

echo Iniciando Mosquitto Subscriber...
cd /d "%~dp0Mosquitto"
start cmd /k "python sub.py"

echo Todos os processos foram iniciados!
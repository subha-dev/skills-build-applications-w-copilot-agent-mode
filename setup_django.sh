#!/bin/bash
cd /workspaces/skills-build-applications-w-copilot-agent-mode
source octofit-tracker/backend/venv/bin/activate
django-admin startproject octofit_tracker octofit-tracker/backend

#!/usr/bin/env bash
# ============================================
# GCP VM Setup — Install Docker + Docker Compose
# Tested on Ubuntu 22.04 LTS
# ============================================

set -euo pipefail

echo "=== Synapse Judge0 CE — GCP VM Setup ==="
echo ""

# Update system
echo "[1/5] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install prerequisites
echo "[2/5] Installing prerequisites..."
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# Add Docker GPG key and repo
echo "[3/5] Setting up Docker repository..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
echo "[4/5] Installing Docker Engine..."
sudo apt-get update -y
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# Add current user to docker group
echo "[5/5] Configuring Docker..."
sudo usermod -aG docker "$USER"

echo ""
echo "=== Setup complete ==="
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"
echo ""
echo "IMPORTANT: Log out and back in for docker group changes to take effect."
echo ""
echo "Next steps:"
echo "  1. Log out/in (or run: newgrp docker)"
echo "  2. Run: bash download-datasets.sh"
echo "  3. Run: docker compose build && docker compose up -d"
echo "  4. Verify: curl -H 'X-Auth-Token: YOUR_TOKEN' http://localhost:2358/system_info"

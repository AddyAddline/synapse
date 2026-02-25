#!/usr/bin/env bash
# ============================================
# Download Mike X Cohen's neuroscience datasets
# from sincxpress.com for use in Phase 5 exercises
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/datasets"

mkdir -p "$DEST"

echo "Downloading neuroscience datasets to $DEST ..."

# Module 1: Macaque V1 Utah array spike data
echo "[1/4] Spike data (Module 1)..."
curl -fSL -o "$DEST/spike_data.mat" \
  "https://sincxpress.com/datafiles/ANTS_data/spikefield.mat"

# Module 2: Human SSVEP EEG
echo "[2/4] SSVEP EEG data (Module 2)..."
curl -fSL -o "$DEST/ssvep_data.mat" \
  "https://sincxpress.com/datafiles/ANTS_data/ssvep.mat"

# Module 4: Task-based fMRI
echo "[3/4] fMRI data (Module 4)..."
curl -fSL -o "$DEST/fmri_data.mat" \
  "https://sincxpress.com/datafiles/ANTS_data/fmri_data.mat"

# Module 5: Two-photon calcium imaging
echo "[4/4] Calcium imaging data (Module 5)..."
curl -fSL -o "$DEST/calcium_data.mat" \
  "https://sincxpress.com/datafiles/ANTS_data/calcium.mat"

echo ""
echo "All datasets downloaded to $DEST:"
ls -lh "$DEST"/*.mat
echo ""
echo "Done! You can now build the Docker image."

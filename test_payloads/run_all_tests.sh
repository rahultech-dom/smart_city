#!/usr/bin/env bash
# Shell Test Script: Dispatches payloads to all 6 Departmental Agent Webhooks

BASE_URL="${1:-http://localhost:5678/webhook}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================================"
echo " Testing Smart City Departmental AI Agents Webhooks in n8n   "
echo " Base URL: $BASE_URL"
echo "============================================================"

declare -A AGENTS=(
  ["Agent 3: Traffic Management Agent"]="$BASE_URL/traffic-agent:test_traffic.json"
  ["Agent 4: Public Safety Agent"]="$BASE_URL/public-safety-agent:test_safety.json"
  ["Agent 5: Waste Management Agent"]="$BASE_URL/waste-agent:test_waste.json"
  ["Agent 6: Environmental Monitoring Agent"]="$BASE_URL/environment-agent:test_environment.json"
  ["Agent 7: Water Management Agent"]="$BASE_URL/water-agent:test_water.json"
  ["Agent 8: Energy Management Agent"]="$BASE_URL/energy-agent:test_energy.json"
)

for NAME in "${!AGENTS[@]}"; do
  IFS=":" read -r URL FILE <<< "${AGENTS[$NAME]}"
  echo ""
  echo ">>> Dispatching to $NAME..."
  if [ -f "$DIR/$FILE" ]; then
    curl -X POST "$URL" \
      -H "Content-Type: application/json" \
      -d @"$DIR/$FILE" \
      --max-time 15
    echo ""
  else
    echo "Payload file not found: $DIR/$FILE"
  fi
done

echo ""
echo "============================================================"
echo " All agent webhook dispatch tests completed."
echo "============================================================"

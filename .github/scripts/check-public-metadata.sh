#!/usr/bin/env bash
set -euo pipefail
shopt -s nocasematch

blocked_pattern='(^|[[:space:]_./-])(codex|claude|gemini|copilot|cursor|windsurf|aider|devin)([[:space:]_./-]|$)'
failed=0

check_text() {
  local label="$1"
  local value="$2"

  if [[ "$value" =~ $blocked_pattern ]]; then
    printf 'Blocked public metadata in %s:\n%s\n\n' "$label" "$value"
    failed=1
  fi
}

json_value() {
  local expression="$1"

  python - "$expression" <<'PY'
import json
import os
import sys

event_path = os.environ.get("GITHUB_EVENT_PATH")
expression = sys.argv[1].split(".")

if not event_path or not os.path.exists(event_path):
    sys.exit(0)

with open(event_path, encoding="utf-8") as event_file:
    data = json.load(event_file)

current = data
for part in expression:
    if isinstance(current, dict):
        current = current.get(part)
    else:
        current = None
        break

if current is not None:
    print(current)
PY
}

json_push_messages() {
  python - <<'PY'
import json
import os
import sys

event_path = os.environ.get("GITHUB_EVENT_PATH")
if not event_path or not os.path.exists(event_path):
    sys.exit(0)

with open(event_path, encoding="utf-8") as event_file:
    data = json.load(event_file)

for commit in data.get("commits", []):
    message = commit.get("message")
    if message:
        print(message)
PY
}

event_name="${GITHUB_EVENT_NAME:-}"

pr_title="${PUBLIC_METADATA_PR_TITLE:-}"
pr_branch="${PUBLIC_METADATA_PR_HEAD_REF:-}"

if [ -z "$pr_title" ]; then
  pr_title="$(json_value 'pull_request.title')"
fi

if [ -z "$pr_branch" ]; then
  pr_branch="$(json_value 'pull_request.head.ref')"
fi

if [ -n "$pr_title" ]; then
  check_text "pull request title" "$pr_title"
fi

if [ -n "$pr_branch" ]; then
  check_text "pull request branch" "$pr_branch"
fi

commit_range="${PUBLIC_METADATA_COMMIT_RANGE:-}"

if [ -z "$commit_range" ] && [ "$event_name" = "pull_request" ]; then
  base_sha="$(json_value 'pull_request.base.sha')"
  head_sha="$(json_value 'pull_request.head.sha')"
  if [ -n "$base_sha" ] && [ -n "$head_sha" ]; then
    commit_range="${base_sha}..${head_sha}"
  fi
fi

if [ -n "$commit_range" ]; then
  while IFS= read -r message; do
    check_text "commit message in range ${commit_range}" "$message"
  done < <(git log --format=%B "$commit_range")
fi

if [ "$event_name" = "push" ]; then
  while IFS= read -r message; do
    check_text "push commit message" "$message"
  done < <(json_push_messages)
fi

if [ "$failed" -ne 0 ]; then
  printf '%s\n' \
    "Public metadata should describe the product, issue, behavior, or engineering" \
    "change, not the automation used to produce it."
  exit 1
fi

echo "Public metadata guard passed."

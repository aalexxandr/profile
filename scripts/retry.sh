#!/bin/sh
# Runs a command up to ATTEMPTS times, waiting DELAY seconds between attempts.
# Used for CI steps that fail on transient network errors (apt mirrors, CDN).
# Usage: retry.sh ATTEMPTS DELAY command [args...]
attempts=$1
delay=$2
shift 2

attempt=1
while true; do
  "$@" && exit 0
  status=$?

  if [ "$attempt" -ge "$attempts" ]; then
    echo "retry: '$*' failed after $attempt attempts (exit $status)" >&2
    exit "$status"
  fi

  echo "retry: attempt $attempt of $attempts failed (exit $status), retrying in ${delay}s" >&2
  attempt=$((attempt + 1))
  sleep "$delay"
done

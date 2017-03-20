#!/usr/bin/env bash

echo "Checking if README.md has been updated..."
echo
git diff
echo
diff=$(git diff-index HEAD -- README.md)
if [[ -n $diff ]]; then
    echo "README.md needs to be regenerated!"
    echo
    echo "Please run:"
    echo "  $ npm run docs"
    exit 1
fi

exit 0

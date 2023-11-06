#!/bin/bash

# Extract coverage information from the output
COVERAGE_INFO=$(grep 'Statements\|Branches\|Functions\|Lines' output.txt)

# Format the coverage information
FORMATTED_COVERAGE=$(echo "$COVERAGE_INFO" | sed 's/^/    /')

# Replace the placeholder in the README with the updated coverage information
sed -i '/<!-- Coverage Report Placeholder - Start -->/,/<!-- Coverage Report Placeholder - End -->/c\<!-- Coverage Report Placeholder - Start -->\n'"$FORMATTED_COVERAGE"'\n<!-- Coverage Report Placeholder - End -->' README.md

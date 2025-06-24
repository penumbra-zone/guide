#!/bin/bash
# CI script to search the Nextra Markdown source files for broken images.
# Complements the main link checker by specifically validating image paths;
# this approach is necessary because the link checker ignores /images/ paths
# to avoid relative path issues after file reorganization.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$PROJECT_ROOT/public/images"

gum style --foreground 99 --bold "🖼️  Checking image references..."

errors=0
total_images=0

# Create a list of all markdown files
mapfile -t files < <(find "$PROJECT_ROOT/pages" -name "*.md" -o -name "*.mdx")
total_files=${#files[@]}

for i in "${!files[@]}"; do
    file="${files[$i]}"
    rel_file="${file#$PROJECT_ROOT/}"

    # Show progress with carriage return
    printf "\r   Scanning... (%d/%d files)" "$((i+1))" "$total_files"

    # Extract /images/ references from the file
    if grep -q "/images/" "$file" 2>/dev/null; then
        # Get all image references in this file
        while IFS= read -r image_path; do
            if [ -n "$image_path" ]; then
                # Remove the leading /images/ to get just the filename
                filename="${image_path#/images/}"

                # Check if the image file exists
                image_file="$IMAGES_DIR/$filename"
                total_images=$((total_images + 1))

                if [ ! -f "$image_file" ]; then
                    # Clear progress line and show error
                    printf "\r%*s\r" 50 ""
                    gum style --foreground 196 "✗ Missing image: $(gum style --foreground 226 "$filename")"
                    gum style --foreground 240 "  Referenced in: $rel_file"
                    gum style --foreground 240 "  Expected at: public/images/$filename"
                    errors=$((errors + 1))
                fi
            fi
        done < <(grep -o '/images/[^)"[:space:]]*' "$file")
    fi
done

# Clear progress line
printf "\r%*s\r" 50 ""

if [ $errors -eq 0 ]; then
    gum style --foreground 46 --bold "✅ All $total_images image references are valid!"
    exit 0
else
    gum style --foreground 196 --bold "❌ Found $errors missing image(s) out of $total_images total references"
    exit 1
fi

find . -name "*.sh" -exec chmod +x {} +
for file in *.sh; do dos2unix "$file"; done
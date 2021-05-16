# Prepare build
echo "Preparing Build"
rm -rf build/
mkdir build/
# @todo: gRPC binding pulling and building?

# Build Package
echo "Building Library"
npm install > /dev/null
npm run build > /dev/null

# Prepare Publish
echo "Preparing Publish"
cp package.json build/
cp README.md build/

# Publish
echo "Publishing"
npm publish build/
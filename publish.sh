# Prepare build
echo "Preparing Build"
rm -rf build/
rm -rf http/build/
rm -rf grpc/build/
mkdir build/

# Build HTTP Library
echo "Building HTTP Library"
cd http/
npm install > /dev/null
npm run build > /dev/null
cp -R build/ ../build/http
rm -rf build/
cd ..

# Build gRPC Library
echo "Building gRPC Library"
# @todo

# Prepare Publish
echo "Preparing Publish"
cp package.json build/
cp README.md build/

# Publish
echo "Publishing"
npm publish build/
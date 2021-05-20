# Prepare build
echo "Preparing Build"
rm -rf build/
mkdir build/
# @todo: gRPC binding pulling and building?

echo ""
echo "Building Protobuf"
./build-grpc.sh

# Build Package
echo ""
echo "Building Library"
npm install > /dev/null
npm run build > /dev/null

# Prepare Publish
echo ""
echo "Preparing Publish"
cp package.json build/
cp README.md build/
cp -R ./src/grpc/proto/ ./build/grpc/proto

# Copy Proto Files
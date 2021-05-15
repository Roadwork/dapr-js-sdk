#!/bin/bash



OS=$(echo `uname`|tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)


# Proto buf generation

APPCALLBACK="appcallback"
COMMON="common"
DAPR="dapr"
RUNTIME="runtime"

# Path to store output
PROTO_PATH="./dapr/proto"
SRC="src"

# Http request CLI
HTTP_REQUEST_CLI=curl


checkHttpRequestCLI() {
    if type "curl" > /dev/null; then
        HTTP_REQUEST_CLI=curl
    elif type "wget" > /dev/null; then
        HTTP_REQUEST_CLI=wget
    else
        echo "Either curl or wget is required"
        exit 1
    fi
}

downloadFile() {

    FOLDER_NAME=$1
    FILE_NAME=$2
    FILE_PATH="${PROTO_PATH}/${FOLDER_NAME}/v1"

    # URL for proto file
    PROTO_URL="https://raw.githubusercontent.com/dapr/dapr/master/dapr/proto/${FOLDER_NAME}/v1/${FILE_NAME}.proto"

    mkdir -p "${FILE_PATH}"

    echo "Downloading $PROTO_URL ..."
    if [ "$HTTP_REQUEST_CLI" == "curl" ]; then
        cd ${FILE_PATH}
        curl -SsL "$PROTO_URL" -o "${FILE_NAME}.proto"
        cd ../../../..
    else
        wget -q -P "$PROTO_URL" "${FILE_PATH}/${FILE_NAME}.proto"
    fi

   
}

generateGrpc() {

    FOLDER_NAME=$1
    FILE_NAME=$2
    FILE_PATH="${PROTO_PATH}/${FOLDER_NAME}/v1"
    PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
    PROTOC_GEN_GRPC_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"
    #echo $SRC 
    #echo ${FILE_PATH}/${FILE_NAME}.proto
    #echo $(pwd -P)
    protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin=protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH} \
    --js_out="import_style=commonjs,binary:$SRC" \
    --ts_out="service=grpc-node,mode=grpc-js:$SRC" \
    --grpc_out="grpc_js:$SRC" \
    ${FILE_PATH}/${FILE_NAME}.proto

    
}

fail_trap() {
    result=$?
    if [ $result != 0 ]; then
        echo "Failed to generate gRPC interface and proto buf: $ret_val"
    fi
    cleanup
    exit $result
}

cleanup() {
    find $PROTO_PATH -type f -name '*.proto' -delete
    rm -rf protoc
    rm -f protoc.zip
}

generateGrpcSuccess() {
    echo -e "\ngRPC interface and proto buf generated successfully!"
}

# -----------------------------------------------------------------------------
# main
# -----------------------------------------------------------------------------
#trap "fail_trap" EXIT

checkHttpRequestCLI
downloadFile $COMMON $COMMON
generateGrpc $COMMON $COMMON
downloadFile $RUNTIME $DAPR
generateGrpc $RUNTIME $DAPR
downloadFile $RUNTIME $APPCALLBACK
generateGrpc $RUNTIME $APPCALLBACK
#cleanup

generateGrpcSuccess
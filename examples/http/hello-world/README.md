# Examples - Hello World

## Running

```bash
# Install
npm install

# Start a RabbitMQ Container (for the binding example part)
# note: mgmt interface at http://localhost:15672 
docker run -d --rm --hostname my-rabbitmq --name my-rabbitmq \
    -e RABBITMQ_DEFAULT_USER=test-user -e RABBITMQ_DEFAULT_PASS=test-password \
    -p 0.0.0.0:5672:5672 -p 0.0.0.0:15672:15672 \
    rabbitmq:3-management

# Start the Dapr Actor
cd examples/dotnet-actor-demo/DemoActorService
dapr run --app-id=dapr-demo-actor --app-port=10000 --dapr-http-port=10002 -- dotnet run

# Run this Example
cd examples/http/hello-world
dapr run --app-id example-hello-world --dapr-http-port 3500 --app-port 4000 npm run start:dev
```
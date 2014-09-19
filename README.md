# http-websocket-server
A simple command line http-server with websocket routing. Built with socket.io as websocket framework with an added layer for simplified client communication.

Quickly build sites with client communication without writing any server code.


## Install
Install globally with npm:
```
npm install -g http-websocket-server
```

## Usage
### Start server
Start a server with:
```
http-websocket-server
```

### Client
Connect to an application from the client by specifying the applications id.
```javascript
// socket.io library is served by default from the server
<script src="/socket.io/socket.io.js"></script>
<script>
  var appId = 'myApp';
  var socket = io();
  var myConnectionId;
  
  socket.on('connect', function() {
    // This is my id which other clients can reference
    myConnectionId = socket.io.engine.id;
  
    // Connect to the appId you wish to use
    socket.emit('app.connect', {
      appId: appId
    });
  });
  
  socket.on('app.connect', function() {
    console.log('Connected to app: ' + appId);
  });
</script>
```

Broadcasting messages to other clients in the same server-app.
```javascript
socket.on('app.connect', function() {
  socket.emit('app.emit', {
    event: 'hello', // Event name that other clients listen to
    data: {
      name: 'My name'
    }
  });
});

// Listen to "hello" message from other clients
socket.on('hello', function(data) {
  console.log(data.name + ' says hello');
});
```

Sending messages to a specific client
```javascript
socket.on('app.connect', function() {
  socket.emit('app.connections');
});

socket.on('app.connections', function(data) {
  var firstClient = data.connections[0];
  if (firstClient) {
    socket.emit('app.emit', {
      event: 'special hello',
      to: firstClient.id,
      data: {
        message: 'A special hello to you from me'
      }
    });
  }
});

socket.on('special.hello', function(data) {
  console.log('A special message received: ' + data.message);
});
```


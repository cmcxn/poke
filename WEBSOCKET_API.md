# WebSocket Heart Control API

This document describes the WebSocket API for controlling hearts in the Phaser game.

## WebSocket Server

The WebSocket server runs on `ws://localhost:8081` by default.

## Connection

Connect to the WebSocket server using any WebSocket client:

```javascript
const ws = new WebSocket('ws://localhost:8081');
```

## Message Format

All messages are sent as JSON strings with the following structure:

```json
{
  "type": "message-type",
  "data": { /* message-specific data */ }
}
```

## Message Types

### 1. Add Heart

Adds a new heart to the game scene.

**Type:** `add-heart`

**Data:**
```json
{
  "id": "unique-heart-id",
  "x": 512,
  "y": 384,
  "color": "0xff0000"  // Optional: hex color string (with or without '0x' prefix)
}
```

**Example:**
```javascript
ws.send(JSON.stringify({
  type: 'add-heart',
  data: {
    id: 'heart-1',
    x: 300,
    y: 200,
    color: '0xff0000'  // Red color
  }
}));
```

### 2. Move Heart

Moves an existing heart to a new position with smooth animation.

**Type:** `move-heart`

**Data:**
```json
{
  "id": "unique-heart-id",
  "x": 600,
  "y": 400,
  "duration": 1000  // Optional: animation duration in ms
}
```

**Example:**
```javascript
ws.send(JSON.stringify({
  type: 'move-heart',
  data: {
    id: 'heart-1',
    x: 600,
    y: 400,
    duration: 500
  }
}));
```

### 3. Remove Heart

Removes a heart from the game scene with fade-out animation.

**Type:** `remove-heart`

**Data:**
```json
{
  "id": "unique-heart-id"
}
```

**Example:**
```javascript
ws.send(JSON.stringify({
  type: 'remove-heart',
  data: {
    id: 'heart-1'
  }
}));
```

## Multi-User Simulation

The WebSocket server broadcasts all messages to all connected clients, simulating a multi-user environment where multiple people can control hearts simultaneously.

Each client should use unique heart IDs to prevent conflicts:
- Client 1: `user1-heart-1`, `user1-heart-2`, etc.
- Client 2: `user2-heart-1`, `user2-heart-2`, etc.

## Running the Application

1. Start the WebSocket server:
```bash
npm run ws-server
```

2. In a new terminal, start the dev server:
```bash
npm run dev
```

3. Open the application in your browser at `http://localhost:8080`

4. Navigate to the "Game" scene using the "Change Scene" button

5. Use the "Add New Heart ❤️" button to add hearts

6. Use the "Move Random Heart" button to move hearts randomly

## Example: External Client

You can control hearts from external clients (e.g., Node.js, Python, etc.):

**Node.js Example:**
```javascript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8081');

ws.on('open', () => {
  // Add a heart
  ws.send(JSON.stringify({
    type: 'add-heart',
    data: {
      id: 'external-heart-1',
      x: 400,
      y: 300
    }
  }));
  
  // Move the heart after 2 seconds
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'move-heart',
      data: {
        id: 'external-heart-1',
        x: 700,
        y: 500,
        duration: 1000
      }
    }));
  }, 2000);
});
```

**Python Example:**
```python
import websocket
import json
import time

ws = websocket.WebSocket()
ws.connect("ws://localhost:8081")

# Add a heart
ws.send(json.dumps({
    'type': 'add-heart',
    'data': {
        'id': 'python-heart-1',
        'x': 450,
        'y': 350
    }
}))

# Move the heart
time.sleep(2)
ws.send(json.dumps({
    'type': 'move-heart',
    'data': {
        'id': 'python-heart-1',
        'x': 650,
        'y': 450,
        'duration': 800
    }
}))

ws.close()
```

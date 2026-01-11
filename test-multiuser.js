#!/usr/bin/env node

// Multi-user simulation test script
// This script simulates multiple users controlling hearts via WebSocket

import WebSocket from 'ws';

const WS_URL = 'ws://localhost:8081';

// Simulate User 1
function simulateUser1() {
    const ws1 = new WebSocket(WS_URL);
    
    ws1.on('open', () => {
        console.log('User 1 connected');
        
        // User 1 adds a heart
        setTimeout(() => {
            const message = {
                type: 'add-heart',
                data: {
                    id: 'user1-heart-1',
                    x: 200,
                    y: 200,
                    color: '0xff0000' // Red
                }
            };
            ws1.send(JSON.stringify(message));
            console.log('User 1: Added red heart at (200, 200)');
        }, 1000);
        
        // User 1 moves their heart
        setTimeout(() => {
            const message = {
                type: 'move-heart',
                data: {
                    id: 'user1-heart-1',
                    x: 400,
                    y: 300,
                    duration: 1500
                }
            };
            ws1.send(JSON.stringify(message));
            console.log('User 1: Moved heart to (400, 300)');
        }, 3000);
    });
    
    ws1.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type !== 'connected') {
            console.log('User 1 received:', msg.type, msg.data?.id);
        }
    });
}

// Simulate User 2
function simulateUser2() {
    const ws2 = new WebSocket(WS_URL);
    
    ws2.on('open', () => {
        console.log('User 2 connected');
        
        // User 2 adds a heart
        setTimeout(() => {
            const message = {
                type: 'add-heart',
                data: {
                    id: 'user2-heart-1',
                    x: 600,
                    y: 400,
                    color: '0x00ff00' // Green
                }
            };
            ws2.send(JSON.stringify(message));
            console.log('User 2: Added green heart at (600, 400)');
        }, 1500);
        
        // User 2 adds another heart
        setTimeout(() => {
            const message = {
                type: 'add-heart',
                data: {
                    id: 'user2-heart-2',
                    x: 700,
                    y: 200,
                    color: '0x0000ff' // Blue
                }
            };
            ws2.send(JSON.stringify(message));
            console.log('User 2: Added blue heart at (700, 200)');
        }, 2500);
        
        // User 2 moves their second heart
        setTimeout(() => {
            const message = {
                type: 'move-heart',
                data: {
                    id: 'user2-heart-2',
                    x: 300,
                    y: 500,
                    duration: 2000
                }
            };
            ws2.send(JSON.stringify(message));
            console.log('User 2: Moved second heart to (300, 500)');
        }, 4000);
    });
    
    ws2.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type !== 'connected') {
            console.log('User 2 received:', msg.type, msg.data?.id);
        }
    });
}

// Simulate User 3
function simulateUser3() {
    const ws3 = new WebSocket(WS_URL);
    
    ws3.on('open', () => {
        console.log('User 3 connected');
        
        // User 3 adds a heart
        setTimeout(() => {
            const message = {
                type: 'add-heart',
                data: {
                    id: 'user3-heart-1',
                    x: 800,
                    y: 600,
                    color: '0xffff00' // Yellow
                }
            };
            ws3.send(JSON.stringify(message));
            console.log('User 3: Added yellow heart at (800, 600)');
        }, 2000);
        
        // User 3 continuously moves their heart
        const MAX_MOVES = 3;
        let moveCount = 0;
        const moveInterval = setInterval(() => {
            if (moveCount >= MAX_MOVES) {
                clearInterval(moveInterval);
                return;
            }
            const message = {
                type: 'move-heart',
                data: {
                    id: 'user3-heart-1',
                    x: Math.floor(Math.random() * 900 + 100),
                    y: Math.floor(Math.random() * 600 + 100),
                    duration: 1000
                }
            };
            ws3.send(JSON.stringify(message));
            console.log('User 3: Moved heart randomly');
            moveCount++;
        }, 3500);
    });
    
    ws3.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type !== 'connected') {
            console.log('User 3 received:', msg.type, msg.data?.id);
        }
    });
}

console.log('Starting multi-user simulation...\n');
console.log('Make sure the WebSocket server is running (npm run ws-server)');
console.log('And the dev server is running (npm run dev)\n');

// Start all users
setTimeout(() => {
    simulateUser1();
    simulateUser2();
    simulateUser3();
}, 500);

// Exit after 15 seconds
setTimeout(() => {
    console.log('\nSimulation complete!');
    process.exit(0);
}, 15000);

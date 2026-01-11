<script setup>
import Phaser from 'phaser';
import { ref, toRaw, onMounted, onUnmounted } from 'vue';
import PhaserGame from './PhaserGame.vue';
import { EventBus } from './game/EventBus';
import { wsClient } from './websocket';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const spritePosition = ref({ x: 0, y: 0 });
const wsConnected = ref(false);
const heartIdCounter = ref(0);

// Connect to WebSocket on mount
onMounted(async () => {
    try {
        await wsClient.connect();
        wsConnected.value = true;
        
        // Handle incoming WebSocket messages
        wsClient.onMessage((message) => {
            handleWebSocketMessage(message);
        });
    } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        wsConnected.value = false;
    }
});

// Disconnect on unmount
onUnmounted(() => {
    wsClient.disconnect();
});

const handleWebSocketMessage = (message) => {
    const { type, data } = message;
    
    switch (type) {
        case 'add-heart':
            EventBus.emit('ws-add-heart', data);
            break;
        case 'move-heart':
            EventBus.emit('ws-move-heart', data);
            break;
        case 'remove-heart':
            EventBus.emit('ws-remove-heart', data);
            break;
        case 'connected':
            console.log('WebSocket connection confirmed:', message.message);
            break;
        default:
            console.log('Unknown message type:', type);
    }
};

const changeScene = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
        scene.changeScene();
    }

}

const moveSprite = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Call the `moveLogo` method in the `MainMenu` Scene and capture the sprite position
        scene.moveLogo(({ x, y }) => {

            spritePosition.value = { x, y };

        });
    }

}

const addSprite = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene && scene.scene.key === 'Game')
    {
        // Generate unique heart ID
        const heartId = `heart-${heartIdCounter.value++}-${Date.now()}`;
        
        // Random position
        const x = Phaser.Math.Between(100, scene.scale.width - 100);
        const y = Phaser.Math.Between(100, scene.scale.height - 100);
        
        // Send WebSocket message to add heart
        const message = {
            type: 'add-heart',
            data: {
                id: heartId,
                x: x,
                y: y
            }
        };
        
        wsClient.send(message);
    }
    else if (scene)
    {
        // Fallback to original behavior for other scenes
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        const star = scene.add.sprite(x, y, 'star');

        scene.add.tween({
            targets: star,
            duration: 500 + Math.random() * 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
    }

}

const moveRandomHeart = () => {
    const scene = toRaw(phaserRef.value.scene);
    
    if (scene && scene.scene.key === 'Game' && scene.hearts.size > 0) {
        // Get a random heart ID
        const heartIds = Array.from(scene.hearts.keys());
        const randomId = heartIds[Math.floor(Math.random() * heartIds.length)];
        
        // Random new position
        const x = Phaser.Math.Between(100, scene.scale.width - 100);
        const y = Phaser.Math.Between(100, scene.scale.height - 100);
        
        // Send WebSocket message to move heart
        const message = {
            type: 'move-heart',
            data: {
                id: randomId,
                x: x,
                y: y,
                duration: 1000
            }
        };
        
        wsClient.send(message);
    }
};

//  This event is emitted from the PhaserGame component:
const currentScene = (scene) => {

    canMoveSprite.value = (scene.scene.key !== 'MainMenu');

}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <div>
        <div class="ws-status" :style="{ color: wsConnected ? '#00ff00' : '#ff0000' }">
            WebSocket: {{ wsConnected ? 'Connected' : 'Disconnected' }}
        </div>
        <div>
            <button class="button" @click="changeScene">Change Scene</button>
        </div>
        <div>
            <button :disabled="canMoveSprite" class="button" @click="moveSprite">Toggle Movement</button>
        </div>
        <div class="spritePosition">Sprite Position:
            <pre>{{ spritePosition }}</pre>
        </div>
        <div>
            <button class="button" @click="addSprite">Add New Heart ❤️</button>
        </div>
        <div>
            <button class="button" @click="moveRandomHeart">Move Random Heart</button>
        </div>
    </div>
</template>

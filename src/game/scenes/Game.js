import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.hearts = new Map(); // Store hearts by ID
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff69b4);

        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.add.text(512, 50, 'WebSocket Heart Control', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#ff1493', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Listen for WebSocket events from Vue
        EventBus.on('ws-add-heart', this.addHeart, this);
        EventBus.on('ws-move-heart', this.moveHeart, this);
        EventBus.on('ws-remove-heart', this.removeHeart, this);

        EventBus.emit('current-scene-ready', this);
    }

    addHeart(data) {
        const { id, x, y, color } = data;
        
        // Create a heart sprite (using star as heart)
        const heart = this.add.sprite(x || 512, y || 384, 'star');
        heart.setScale(0.8);
        
        // Set color tint if provided
        if (color) {
            // Handle both '0xff0000' and 'ff0000' formats
            const colorValue = color.startsWith('0x') ? parseInt(color, 16) : parseInt(color, 16);
            heart.setTint(colorValue);
        } else {
            // Random tint for visual variety
            const colors = [0xff0000, 0xff69b4, 0xff1493, 0xdc143c, 0xff6347];
            heart.setTint(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        // Store heart with its ID
        this.hearts.set(id, heart);
        
        // Add a floating animation
        this.tweens.add({
            targets: heart,
            y: heart.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    moveHeart(data) {
        const { id, x, y, duration } = data;
        const heart = this.hearts.get(id);
        
        if (heart) {
            // Move heart to new position with smooth animation
            this.tweens.add({
                targets: heart,
                x: x,
                y: y,
                duration: duration || 500,
                ease: 'Power2'
            });
        }
    }

    removeHeart(data) {
        const { id } = data;
        const heart = this.hearts.get(id);
        
        if (heart) {
            // Fade out and destroy
            this.tweens.add({
                targets: heart,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
                    heart.destroy();
                    this.hearts.delete(id);
                }
            });
        }
    }

    getHeartIds() {
        return Array.from(this.hearts.keys());
    }

    getHeartCount() {
        return this.hearts.size;
    }

    changeScene ()
    {
        // Clean up event listeners
        EventBus.off('ws-add-heart', this.addHeart, this);
        EventBus.off('ws-move-heart', this.moveHeart, this);
        EventBus.off('ws-remove-heart', this.removeHeart, this);
        
        this.scene.start('GameOver');
    }
}

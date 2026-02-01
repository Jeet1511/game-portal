# Platform Adventure Game

A complete HTML5 platformer game with multiple levels, enemies, and collectibles.

## Features
- ✅ Multiple levels with increasing difficulty
- ✅ Smooth player movement and jumping
- ✅ Collectible coins for scoring
- ✅ Patrolling enemies
- ✅ Lives system
- ✅ Responsive design (works on all devices)
- ✅ Clean, modular code structure

## File Structure
```
platformer-game/
├── index.html          # Main HTML file
├── style.css           # All styling and responsive design
├── js/
│   ├── config.js       # Game configuration and level data
│   ├── player.js       # Player class and controls
│   ├── platform.js     # Platform class
│   ├── coin.js         # Coin class with animations
│   ├── enemy.js        # Enemy class with AI
│   └── game.js         # Main game loop and logic
└── README.md           # This file
```

## How to Play
- **Arrow Keys**: Move left/right and jump
- **R Key**: Restart game
- **Objective**: Collect all coins to complete each level
- **Avoid**: Red enemies that patrol platforms

## How to Customize

### Adding New Levels
Edit `js/config.js` and add new level data to the `levels` array:
```javascript
{
    platforms: [
        { x: 0, y: 550, width: 800, height: 50 },
        // Add more platforms...
    ],
    coins: [
        { x: 250, y: 400 },
        // Add more coins...
    ],
    enemies: [
        { x: 300, y: 410, direction: 1, minX: 200, maxX: 350 },
        // Add more enemies...
    ]
}
```

### Changing Colors
Edit the CONFIG object in `js/config.js`:
```javascript
player: {
    color: '#FF6B6B'  // Change player color
},
platform: {
    color: '#4ECDC4'  // Change platform color
}
```

### Modifying Game Physics
Adjust values in `js/config.js`:
```javascript
player: {
    speed: 5,         // Movement speed
    jumpPower: 12,    // Jump height
    gravity: 0.5      // Fall speed
}
```

## How to Upload to Game Portal

1. **Zip the entire folder**:
   - Right-click the `platformer-game` folder
   - Select "Compress" or "Send to > Compressed folder"
   - Name it `platformer-game.zip`

2. **Upload via Admin Panel**:
   - Go to Admin Panel > Games > Upload ZIP Game
   - Fill in game details (name, description, category)
   - Select the ZIP file
   - Click "Upload Game"

3. **Done!** Your game will be playable on the portal

## Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Credits
Created as a template for the Game Portal platform.
Feel free to modify and use for your own games!

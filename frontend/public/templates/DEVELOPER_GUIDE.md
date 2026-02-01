# Game Portal - Developer Templates

## Available Game Templates

All templates are **complete, multi-file projects** ready to customize and upload!

### 1. Platform Adventure ✅ COMPLETE
**Location:** `platformer-game/`

**Files:**
- `index.html` - Main game page
- `style.css` - Responsive styling
- `js/config.js` - Game settings & 2 levels
- `js/player.js` - Player movement & physics
- `js/platform.js` - Platform rendering
- `js/coin.js` - Collectible coins
- `js/enemy.js` - Enemy AI
- `js/game.js` - Main game loop
- `README.md` - Full documentation

**Features:**
- 2 complete levels
- Lives system
- Collectible coins
- Patrolling enemies
- Responsive design
- Easy to customize

---

### 2. Match-3 Puzzle (Coming Soon)
**Location:** `puzzle-game/`

Will include:
- Grid-based matching system
- Move counter
- Score tracking
- Cascade animations
- Multiple gem types

---

### 3. Space Shooter (Coming Soon)
**Location:** `space-shooter/`

Will include:
- Player ship controls
- Enemy waves
- Bullet system
- Power-ups
- Health system
- Scrolling background

---

### 4. Endless Runner (Coming Soon)
**Location:** `endless-runner/`

Will include:
- Infinite scrolling
- Procedural obstacles
- Jump mechanics
- Score system
- Increasing difficulty

---

## How to Use These Templates

### Step 1: Download
- Go to Admin Panel > Dev Center
- Click "Download Template" for any game
- Extract the downloaded folder

### Step 2: Customize
- Open files in your code editor
- Modify colors, speeds, levels in `js/config.js`
- Add your own graphics/sounds
- Test by opening `index.html` in browser

### Step 3: Upload to Portal
1. ZIP the entire game folder
2. Go to Admin Panel > Games > Upload ZIP Game
3. Fill in game details
4. Upload your ZIP file
5. Your game is live!

---

## Template Structure

All templates follow this structure:
```
game-name/
├── index.html          # Main HTML
├── style.css           # All styling
├── js/
│   ├── config.js       # Settings & data
│   ├── [classes].js    # Game objects
│   └── game.js         # Main logic
└── README.md           # Documentation
```

**Benefits:**
- ✅ Modular, easy to understand
- ✅ Separate concerns (HTML/CSS/JS)
- ✅ Easy to customize
- ✅ Responsive design
- ✅ Well documented
- ✅ Production ready

---

## Customization Guide

### Changing Colors
Edit `js/config.js`:
```javascript
const CONFIG = {
    player: {
        color: '#FF6B6B'  // Your color here
    }
}
```

### Adding Levels
Add to the `levels` array in `js/config.js`

### Modifying Physics
Change speed, gravity, jump power in `CONFIG`

### Adding Sounds
Add `<audio>` tags in HTML and trigger in JS

### Adding Images
Replace canvas drawing with `ctx.drawImage()`

---

## Support

For questions or issues:
- Check the README.md in each game folder
- Review the code comments
- Test in browser console for debugging

Happy Game Development! 🎮

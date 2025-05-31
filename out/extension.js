"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// AI-powered game development templates and logic
const gameMechanics = {
    combat: [
        "Turn-based tactical combat with environmental interactions",
        "Real-time combo system with timing-based multipliers",
        "Rock-paper-scissors elemental weakness system",
        "Stamina-based action economy with recovery phases",
        "Positional combat with terrain advantages"
    ],
    progression: [
        "Branching skill trees with mutually exclusive paths",
        "Equipment fusion system creating unique combinations",
        "Prestige system with meta-progression rewards",
        "Social bonds affecting character abilities",
        "Time-gated progression encouraging daily play"
    ],
    exploration: [
        "Procedural dungeons with hand-crafted key rooms",
        "Weather system affecting gameplay mechanics",
        "Day/night cycle with different enemy behaviors",
        "Hidden passages revealed by specific actions",
        "Backtracking rewards for upgraded abilities"
    ]
};
const weaponBalancing = {
    calculateDPS: (damage, speed, critRate, critMultiplier) => {
        const baseDPS = damage * speed;
        const critDPS = baseDPS * (1 + (critRate / 100) * (critMultiplier - 1));
        return Math.round(critDPS * 100) / 100;
    },
    suggestBalance: (weaponType, currentStats) => {
        const templates = {
            sword: { damage: 50, speed: 1.2, critRate: 15, range: 2 },
            bow: { damage: 35, speed: 1.8, critRate: 25, range: 8 },
            staff: { damage: 70, speed: 0.8, critRate: 10, range: 6 },
            dagger: { damage: 30, speed: 2.5, critRate: 35, range: 1 }
        };
        const template = templates[weaponType];
        if (!template)
            return "Unknown weapon type";
        const suggestions = [];
        if (currentStats.damage > template.damage * 1.2) {
            suggestions.push("Reduce damage - currently overpowered");
        }
        if (currentStats.speed > template.speed * 1.3) {
            suggestions.push("Reduce attack speed - too fast");
        }
        if (currentStats.critRate > template.critRate * 1.5) {
            suggestions.push("Lower crit rate - too reliable");
        }
        return suggestions.length > 0 ? suggestions.join("\n") : "Stats look balanced!";
    }
};
const levelGenerator = {
    generateLayout: (size, theme) => {
        const layouts = {
            small: "Linear progression with 3-5 rooms, single path with optional secret",
            medium: "Hub-and-spoke design with central area and 4-6 branching paths",
            large: "Multi-level interconnected maze with vertical progression elements"
        };
        const themes = {
            dungeon: "Stone corridors, trap mechanisms, hidden switches",
            forest: "Winding paths, environmental puzzles, natural barriers",
            tech: "Electronic doors, hacking mini-games, automated defenses",
            cosmic: "Zero-gravity sections, portal mechanics, reality distortions"
        };
        return `${layouts[size]}\n\nTheme Elements: ${themes[theme]}`;
    }
};
const characterGenerator = {
    createConcept: (role, setting) => {
        const roles = {
            warrior: ["Berserker", "Paladin", "Samurai", "Viking", "Gladiator"],
            mage: ["Elementalist", "Necromancer", "Druid", "Arcane Scholar", "Battle Mage"],
            rogue: ["Assassin", "Thief", "Spy", "Pirate", "Shadow Dancer"],
            support: ["Healer", "Bard", "Engineer", "Alchemist", "Tactician"]
        };
        const settings = {
            fantasy: "Medieval world with magic and mythical creatures",
            scifi: "Futuristic society with advanced technology",
            modern: "Contemporary setting with hidden supernatural elements",
            postapoc: "Post-apocalyptic wasteland with survival themes"
        };
        const roleTypes = roles[role] || ["Generic Hero"];
        const randomType = roleTypes[Math.floor(Math.random() * roleTypes.length)];
        return {
            archetype: randomType,
            setting: settings[setting],
            backstory: `A ${randomType.toLowerCase()} in a ${settings[setting].toLowerCase()}`,
            abilities: generateAbilities(role),
            motivation: generateMotivation()
        };
    }
};
function generateAbilities(role) {
    const abilityMap = {
        warrior: ["Heavy Strike", "Shield Bash", "Weapon Mastery", "Intimidate"],
        mage: ["Spell Weaving", "Mana Shield", "Elemental Control", "Arcane Knowledge"],
        rogue: ["Stealth", "Lock Picking", "Backstab", "Acrobatics"],
        support: ["Healing Touch", "Buff Allies", "Resource Management", "Team Coordination"]
    };
    return abilityMap[role] || ["Basic Attack", "Dodge", "Item Use"];
}
function generateMotivation() {
    const motivations = [
        "Seeking redemption for past mistakes",
        "Protecting loved ones from an ancient threat",
        "Uncovering the truth behind a mysterious event",
        "Gaining power to change the world",
        "Fulfilling a sacred duty or prophecy"
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
}
function activate(context) {
    console.log('GameDev AI Assistant is now active!');
    // Register the main panel command
    let openPanel = vscode.commands.registerCommand('gamedev-ai.openPanel', () => {
        const panel = vscode.window.createWebviewPanel('gamedevAI', 'GameDev AI Assistant', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'generateMechanic':
                    handleGenerateMechanic(message.category);
                    break;
                case 'balanceWeapon':
                    handleBalanceWeapon(message.weaponData);
                    break;
                case 'generateLevel':
                    handleGenerateLevel(message.size, message.theme);
                    break;
                case 'createCharacter':
                    handleCreateCharacter(message.role, message.setting);
                    break;
            }
        }, undefined, context.subscriptions);
    });
    // Register individual commands
    let generateMechanic = vscode.commands.registerCommand('gamedev-ai.generateMechanic', () => {
        vscode.window.showQuickPick(['Combat', 'Progression', 'Exploration'], {
            placeHolder: 'Select mechanic category'
        }).then(selection => {
            if (selection) {
                handleGenerateMechanic(selection.toLowerCase());
            }
        });
    });
    let balanceWeapon = vscode.commands.registerCommand('gamedev-ai.balanceWeapon', () => {
        vscode.window.showInputBox({
            prompt: 'Enter weapon type (sword, bow, staff, dagger)'
        }).then(weaponType => {
            if (weaponType) {
                // Simplified version - in real app, would get more detailed input
                const mockStats = { damage: 60, speed: 1.5, critRate: 20 };
                handleBalanceWeapon({ type: weaponType, stats: mockStats });
            }
        });
    });
    let generateLevel = vscode.commands.registerCommand('gamedev-ai.generateLevel', () => {
        vscode.window.showQuickPick(['small', 'medium', 'large'], {
            placeHolder: 'Select level size'
        }).then(size => {
            if (size) {
                vscode.window.showQuickPick(['dungeon', 'forest', 'tech', 'cosmic'], {
                    placeHolder: 'Select theme'
                }).then(theme => {
                    if (theme) {
                        handleGenerateLevel(size, theme);
                    }
                });
            }
        });
    });
    let createCharacter = vscode.commands.registerCommand('gamedev-ai.createCharacter', () => {
        vscode.window.showQuickPick(['warrior', 'mage', 'rogue', 'support'], {
            placeHolder: 'Select character role'
        }).then(role => {
            if (role) {
                vscode.window.showQuickPick(['fantasy', 'scifi', 'modern', 'postapoc'], {
                    placeHolder: 'Select setting'
                }).then(setting => {
                    if (setting) {
                        handleCreateCharacter(role, setting);
                    }
                });
            }
        });
    });
    context.subscriptions.push(openPanel, generateMechanic, balanceWeapon, generateLevel, createCharacter);
}
exports.activate = activate;
function handleGenerateMechanic(category) {
    const mechanics = gameMechanics[category] || [];
    if (mechanics.length > 0) {
        const randomMechanic = mechanics[Math.floor(Math.random() * mechanics.length)];
        vscode.window.showInformationMessage(`Generated Mechanic: ${randomMechanic}`, 'Insert to Editor').then(selection => {
            if (selection === 'Insert to Editor') {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.start, `// Game Mechanic: ${randomMechanic}\n`);
                    });
                }
            }
        });
    }
}
function handleBalanceWeapon(weaponData) {
    const suggestion = weaponBalancing.suggestBalance(weaponData.type, weaponData.stats);
    const dps = weaponBalancing.calculateDPS(weaponData.stats.damage, weaponData.stats.speed, weaponData.stats.critRate, 2.0);
    vscode.window.showInformationMessage(`DPS: ${dps}\nBalance Suggestions: ${suggestion}`, 'Insert Analysis').then(selection => {
        if (selection === 'Insert Analysis') {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.start, `// Weapon Balance Analysis\n// DPS: ${dps}\n// ${suggestion}\n`);
                });
            }
        }
    });
}
function handleGenerateLevel(size, theme) {
    const layout = levelGenerator.generateLayout(size, theme);
    vscode.window.showInformationMessage('Level design generated!', 'Insert Design').then(selection => {
        if (selection === 'Insert Design') {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.start, `// Level Design (${size}, ${theme})\n// ${layout}\n`);
                });
            }
        }
    });
}
function handleCreateCharacter(role, setting) {
    const character = characterGenerator.createConcept(role, setting);
    const characterText = `// Character Concept
// Archetype: ${character.archetype}
// Setting: ${character.setting}
// Backstory: ${character.backstory}
// Abilities: ${character.abilities.join(', ')}
// Motivation: ${character.motivation}
`;
    vscode.window.showInformationMessage('Character concept created!', 'Insert Character').then(selection => {
        if (selection === 'Insert Character') {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.start, characterText);
                });
            }
        }
    });
}
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameDev AI Assistant</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            padding: 25px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 15px;
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }
        .description {
            margin-bottom: 15px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .stats {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 GameDev AI Assistant</h1>
        <p style="text-align: center; font-size: 1.2em; opacity: 0.9;">Your AI-powered companion for game development</p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚔️ Game Mechanics Generator</h3>
                <div class="description">Generate unique combat, progression, and exploration mechanics for your game.</div>
                <button onclick="generateMechanic()">Generate Mechanic</button>
            </div>
            
            <div class="feature-card">
                <h3>⚖️ Weapon Balancer</h3>
                <div class="description">Analyze and balance weapon statistics with AI-powered suggestions.</div>
                <button onclick="balanceWeapon()">Balance Weapon</button>
            </div>
            
            <div class="feature-card">
                <h3>🗺️ Level Designer</h3>
                <div class="description">Create level layouts and design concepts for different themes and sizes.</div>
                <button onclick="generateLevel()">Design Level</button>
            </div>
            
            <div class="feature-card">
                <h3>👥 Character Creator</h3>
                <div class="description">Generate character concepts with backstories, abilities, and motivations.</div>
                <button onclick="createCharacter()">Create Character</button>
            </div>
        </div>
        
        <div class="stats">
            <p>🚀 Boost your game development workflow with AI-powered creativity</p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function generateMechanic() {
            vscode.postMessage({
                command: 'generateMechanic',
                category: 'combat' // Could be made dynamic
            });
        }
        
        function balanceWeapon() {
            vscode.postMessage({
                command: 'balanceWeapon',
                weaponData: {
                    type: 'sword',
                    stats: { damage: 60, speed: 1.5, critRate: 20 }
                }
            });
        }
        
        function generateLevel() {
            vscode.postMessage({
                command: 'generateLevel',
                size: 'medium',
                theme: 'dungeon'
            });
        }
        
        function createCharacter() {
            vscode.postMessage({
                command: 'createCharacter',
                role: 'warrior',
                setting: 'fantasy'
            });
        }
    </script>
</body>
</html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
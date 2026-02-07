# OpenClaw Architecture Analysis

OpenClaw is a multiplatform C++ reimplementation of the 1997 Captain Claw
platformer, written from scratch. It uses original game assets (CLAW.REZ) but
all code is new. Targets Windows, Linux, macOS, Android, and WebAssembly.

---

## 1. High-Level Repository Structure

```
OpenClaw/                   (root)
├── Box2D/                  # Physics engine (vendored)
├── Build_Release/          # Build output + runtime assets (CLAW.REZ, configs)
├── ClawLauncher/           # Standalone GUI launcher (C#/Mono)
├── MidiProc/               # Windows MIDI audio processor
├── OpenClaw/               # *** Main game source code ***
│   ├── Engine/             #   Core engine subsystems
│   ├── main.cpp            #   Entry point
│   ├── ClawGameApp.*       #   Game-specific app (derives BaseGameApp)
│   ├── ClawGameLogic.*     #   Game-specific logic (derives BaseGameLogic)
│   ├── ClawHumanView.*     #   Player view (derives HumanView)
│   ├── ClawEvents.*        #   Game-specific event types
│   └── ActorController.*   #   Player input -> actor mapping
├── ThirdParty/             # Tinyxml (XML parsing)
├── libsigc++3/             # Signal/slot library
├── libwap/                 # Library for reading WAP file formats
├── libwap_tests/           # Tests for libwap
├── Scripts/                # Build/utility scripts
├── CMakeLists.txt          # Top-level CMake build
└── OpenClaw.sln            # Visual Studio 2017 solution
```

## 2. Technology Stack

| Concern           | Library / Tool       |
|--------------------|----------------------|
| Rendering          | SDL2, SDL2_image     |
| Text rendering     | SDL2_ttf             |
| Audio              | SDL2_mixer           |
| 2D drawing utils   | SDL2_gfx             |
| Physics            | Box2D                |
| XML config/data    | Tinyxml              |
| Signal/slot        | libsigc++3           |
| Asset formats      | libwap (WAP/REZ)     |
| ZIP handling       | Miniz (embedded)     |
| Build              | CMake 3.2+, C++11    |

## 3. Core Architecture Pattern

OpenClaw follows a **Game Application Framework** pattern inspired by the
architecture described in *Game Coding Complete* by Mike McShaffey. The key
design is a three-layer separation:

```
┌─────────────────────────────────────────────────┐
│                  ClawGameApp                     │  Game-specific application
│              (extends BaseGameApp)               │  (window, config, init)
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────┐   ┌──────────────────────┐│
│  │  ClawGameLogic    │   │  ClawHumanView       ││  Game logic + Views
│  │ (BaseGameLogic)   │   │  (HumanView)         ││
│  │                   │   │                       ││
│  │ - Actor management│   │ - Scene graph         ││
│  │ - Game state      │   │ - Camera control      ││
│  │ - Level loading   │   │ - Input processing    ││
│  │ - Physics world   │   │ - HUD rendering       ││
│  └──────────────────┘   └──────────────────────┘│
│                                                  │
├─────────────────────────────────────────────────┤
│              Engine Subsystems                   │
│  Actor | Audio | Events | Graphics2D | Logger    │
│  Physics | Process | Resource | Scene | UI | Util│
└─────────────────────────────────────────────────┘
```

### The Three Layers

1. **GameApp** (`BaseGameApp` / `ClawGameApp`) - Owns the main loop, SDL
   window/renderer, configuration, resource caches, and audio system. Handles
   platform-specific initialization.

2. **GameLogic** (`BaseGameLogic` / `ClawGameLogic`) - Manages all actors,
   game state machine, level loading, and physics. This is the authoritative
   game state. Responds to gameplay events (attacks, pickups, deaths, etc.).

3. **GameView** (`HumanView` / `ClawHumanView`) - Renders the world via a
   scene graph, handles player input, manages HUD elements and camera. Multiple
   views can exist (AI view, network view, etc.).

## 4. Boot Sequence and Main Loop

### Startup (`main.cpp` -> `RunGameEngine()` -> `BaseGameApp::Initialize()`)

```
1.  Global ClawGameApp instance created
2.  main() calls RunGameEngine(argc, argv)
3.  BaseGameApp::Initialize() runs:
    a. Register engine + game events
    b. Create SDL2 window and renderer (resolution, vsync)
    c. Initialize SDL_Mixer audio
    d. Load TTF fonts
    e. Register resource caches (CLAW.REZ, ASSETS.ZIP) with loaders
    f. Load actor prototype definitions from XML
    g. Load level metadata from XML
    h. VCreateGameAndView() -> creates ClawGameLogic + ClawHumanView
    i. Preload critical assets
4.  BaseGameApp::Run() enters main loop
```

### Main Loop (per frame)

```
while (running) {
    1. Poll SDL events (keyboard, mouse, window, touch)
    2. Update touch manager state
    3. VOnUpdate(deltaTime):
       a. Process event queue (up to 20ms budget)
       b. Update game logic (actors, physics, processes)
    4. For each GameView:
       a. VOnRender() - traverse scene graph, draw
    5. Optional CPU delay (debug)
}
```

Frame timing uses `SDL_GetTicks()` for delta calculation. Lag spikes > 1000ms
(e.g., from OS backgrounding) are discarded.

## 5. Engine Subsystems

### 5.1 Actor System (`Engine/Actor/`)

Uses an **Entity-Component architecture**:

- **Actor** - A lightweight container identified by an ActorId. Holds a map of
  components. No game behavior in the actor itself.
- **ActorComponent** - Base class for all components. Each provides a specific
  capability (position, physics, rendering, AI, etc.).
- **ActorFactory** - Creates actors from XML definitions. Uses a component
  factory (generic template pattern) to instantiate components by name.
- **ActorTemplates** - Predefined configurations for common actor types.

#### Component Types (~30+ components organized in subdirectories)

| Category | Components |
|----------|-----------|
| **Core** | PositionComponent, RenderComponent, AnimationComponent, PhysicsComponent, CollisionComponent |
| **Movement** | KinematicComponent, ConveyorBeltComponent, PathElevatorComponent, PredefinedMoveComponent, RopeComponent |
| **Combat** | AreaDamageComponent, ProjectileSpawnerComponent, DestroyableComponent, ExplodeableComponent |
| **Interaction** | ControllableComponent, FollowableComponent, CheckpointComponent, SpringBoardComponent, SteppingGroundComponent |
| **Audio** | SoundComponent, GlobalAmbientSoundComponent, LocalAmbientSoundComponent |
| **Visual** | GlitterComponent, PowerupSparkleAIComponent, SingleAnimationComponent |
| **Hazards** | FloorSpikeComponent, SawBladeComponent |
| **Spawning** | ActorSpawnerComponent, LootComponent |

**Subdirectories with specialized components:**
- `AIComponents/` - General AI behaviors
- `AuraComponents/` - Area-of-effect auras
- `ControllerComponents/` - Input/AI controller bindings
- `EnemyAI/` - Enemy-specific AI state machines
- `PickupComponents/` - Treasure, ammo, health, powerup logic
- `TriggerComponents/` - Level triggers and scripted events

### 5.2 Event System (`Engine/Events/`)

Implements a **publish-subscribe event bus**:

- `EventMgr` / `EventMgrImpl` - Central event dispatcher. Events are queued
  and processed each frame within a time budget (20ms).
- `Events.h/.cpp` - Defines all event types (actor created/destroyed, collision,
  item pickup, player death, level transition, etc.).
- Listeners register delegate functions for specific event types.
- `ClawGameLogic` registers ~12+ event delegates for game-specific events
  (firing, attacks, climbing, powerups, checkpoints, ammo changes, etc.).

### 5.3 Physics (`Engine/Physics/`)

Wraps **Box2D** with game-specific collision logic:

- `ClawPhysics` - Implements `IGamePhysics`. Creates/manages Box2D world,
  handles body creation (dynamic, static, kinematic), raycasting, and fixture
  management.
- `PhysicsContactListener` - Box2D contact callback. Routes collision events
  into the engine's event system.
- `PhysicsDebugDrawer` - Renders physics shapes for debugging.

Collision categories defined in `Interfaces.h` include: solid, ground, death,
ladder, climb, rope, bullet, magic, enemy zones, and many more.

### 5.4 Scene Graph (`Engine/Scene/`)

A hierarchical rendering system:

- `Scene` - Root of the scene graph. Manages rendering order and camera.
- `SceneNodes` - Base scene node with transform, parent/child hierarchy.
- `ActorSceneNode` - Scene node bound to a game actor (renders actor's sprite).
- `TilePlaneSceneNode` - Renders tile-based level backgrounds and foregrounds.
- `HUDSceneNode` - Renders heads-up display elements (health, score, ammo).

### 5.5 Resource Management (`Engine/Resource/`)

Two-tier asset loading system:

- `ResourceMgr` - High-level resource management and caching.
- `ResourceCache` - LRU-style cache. Loads from ZIP archives and REZ files.
- `ZipFile` / `Miniz` - ZIP archive reading (for ASSETS.ZIP).
- `Loaders/` - Format-specific resource loaders (images, sounds, level data,
  XML, etc.).

Assets come from two sources:
1. **CLAW.REZ** - Original game archive (sprites, sounds, level tiles)
2. **ASSETS.ZIP** - Custom assets (configs, additional data)

### 5.6 Audio (`Engine/Audio/`)

- Built on SDL2_mixer
- Supports WAV sound effects and music
- `MidiProc` (Windows-only) handles MIDI music playback as a separate process
- Emscripten/WASM builds have limited audio support

### 5.7 Graphics (`Engine/Graphics2D/`)

- 2D rendering via SDL2_Renderer
- Sprite and animation support
- SDL2_image for image format loading
- SDL2_gfx for primitive drawing

### 5.8 Process Manager (`Engine/Process/`)

Implements a **process/task system** for time-based behaviors:

- Processes are chainable (one completes, next starts)
- Used for animations, delays, scripted sequences
- Managed by `ProcessMgr` in `BaseGameLogic`

### 5.9 User Interface (`Engine/UserInterface/`)

- Menu systems, console, and in-game UI
- Screen elements implement `IScreenElement` interface with z-ordering

## 6. Data-Driven Design

A major architectural principle is **XML-driven configuration**:

- **Actor definitions** - XML files define which components an actor has and
  their properties (loaded by `ActorFactory`)
- **Level data** - Levels loaded from XML with tile layouts, actor placements,
  and trigger definitions
- **Game options** - Display, audio, controls, cheats, and global gameplay
  tuning values all stored in XML config files
- **Actor prototypes** - ~150 actor types across 13 levels defined via XML

`Tinyxml` is used throughout, with helper macros in `XmlMacros.h` for common
parsing patterns.

## 7. Platform Abstraction

```
                    ┌──────────────┐
                    │   main.cpp   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌─────┴──────┐
        │  Windows   │ │ Linux │ │  Android   │
        │  (VS2017)  │ │ (GCC) │ │  (JNI/SDL) │
        └────────────┘ └───────┘ └────────────┘
                                 ┌─────────────┐
                                 │ Emscripten   │
                                 │ (WASM/Web)   │
                                 └─────────────┘
```

- **SDL2** provides the primary platform abstraction (window, input, audio,
  rendering)
- **Android** uses JNI bridge in `main.cpp` to route through SDL's Android
  activity
- **Emscripten** uses `emscripten_set_main_loop_arg()` callback-based loop
  instead of while-loop
- **CMake** handles cross-platform build with platform-specific conditionals

## 8. Key Design Patterns

| Pattern | Where Used |
|---------|-----------|
| Entity-Component | Actor system - actors are bags of components |
| Factory | ActorFactory, component creation via generic factory template |
| Observer/Pub-Sub | Event system - decoupled communication |
| Template Method | BaseGameApp/ClawGameApp virtual methods |
| Singleton | System-wide manager instances |
| Scene Graph | Hierarchical rendering in Scene subsystem |
| Process/Task | Time-based behavior chains |
| MVC-like | Logic (model) / View (rendering) / App (controller) separation |
| Data-Driven | XML configs for actors, levels, game settings |

## 9. Data Flow Summary

```
Input (SDL Events)
    │
    ▼
ClawHumanView (processes input)
    │
    ▼
Event System (queues game events)
    │
    ▼
ClawGameLogic (updates actors, physics, state)
    │
    ▼
Box2D Physics (simulates world)
    │
    ▼
Scene Graph (transforms updated)
    │
    ▼
SDL2 Renderer (draws to screen)
```

## 10. Source Code Statistics

- **Languages**: C++ (53.7%), C (44.1% - mainly Box2D/libwap), Objective-C (1%)
- **License**: GPL-3.0
- **C++ Standard**: C++11
- **Contributors**: 8
- **Commits**: 573

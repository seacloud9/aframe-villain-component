/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Villan component for A-Frame.
	 */
	AFRAME.registerComponent('villain', {
	    schema: {
	        cam: {
	            default: null
	        },
	        aispeed: {
	            default: 0.5
	        },
	        camID: {
	            default: '#camera'
	        },
	        lastRandomX: {
	            default: Math.random()
	        },
	        lastRandomZ: {
	            default: Math.random()
	        },
	        mapRef: {
	            default: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], [1, 1, 0, 0, 0, 0, 0, 1, 1, 1 ], [1, 1, 0, 0, 2, 0, 0, 0, 0, 1 ], [1, 0, 0, 0, 0, 2, 0, 0, 0, 1 ], [1, 0, 0, 2, 0, 0, 2, 0, 0, 1 ], [1, 0, 0, 0, 2, 0, 0, 0, 1, 1 ], [1, 1, 1, 0, 0, 0, 0, 1, 1, 1 ], [1, 1, 1, 0, 0, 1, 0, 0, 1, 1 ], [1, 1, 1, 1, 1, 1, 0, 0, 1, 1 ], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]]
	        },
	        health: {
	            default: 100
	        },
	        mapX: {
	            default: null
	        },
	        pathPos: {
	            default: 1
	        },
	        mapY: {
	            default: null
	        },
	        x: {
	            default: null
	        },
	        y: {
	            default: null
	        },
	        z: {
	            default: null
	        },
	        delta: {
	            default: 0
	        },
	        MOVESPEED: {
	            default: 10
	        },
	        hasLoaded:{
	          default: false
	        },
	        sceneHasLoaded:{
	            default:false
	        },
	        mapW: {default: 10},
	        mapH: {default: 10},
	        offsetX: {default: -220},
	        offsetZ: {default: -100},
	        UNITSIZE: {default: 250},
	        WALLHEIGHT: {default: 250 / 3},
	        collisionDistance: {default: 25},
	        collisionAction:  {default: null},
	        isColliding: {default: false},
	        escapeProbability: {default: 0.5},
	        loot: {default: null},
	        gold: {default: 10},
	        specialMessaging: {default: null},
	        specialAbilities: {default: null},
	        pauseForAction: {default: false}
	    },

	    /**
	     * Set if component needs multiple instancing.
	     */
	    multiple: true,

	    /**
	     * Called once when component is attached. Generally for initial setup.
	     */
	    init: function () {
	        if(!this.data.sceneHasLoaded){
	            document.querySelector('a-scene').addEventListener('loaded', this.sceneHasLoaded.bind(this))
	        }else{
	            this.sceneHasLoaded.apply(this)
	        }
	    },

	    checkWallCollision: function (v) {
	        const c = this.getMapSector(v);
	        return this.data.mapRef[c.x][c.z] > 0;
	    },

	    sceneHasLoaded: function () {
	        this.data.scene = document.querySelector('a-scene')
	        if (this.data.aispeed == null) {
	            this.data.aispeed = this.data.delta * this.data.MOVESPEED
	        }
	        if(this.data.mapRef === null){
	            this.data.mapRef =  document.getElementById('maze').components['aframe-maze'].data.map
	        }
	        if (this.data.cam == null) {
	            this.data.cam = document.querySelector(this.data.camID);
	        }

	        const c = this.getMapSector(this.data.cam.object3D.position);
	        do {
	            this.data.x = this.getRandBetween(0, this.data.mapW - 1);
	            this.data.z = this.getRandBetween(0, this.data.mapH - 1);
	        } while (this.data.mapRef[this.data.x][this.data.z] > 0 || (this.data.x == c.x && this.data.z == c.z));
	        this.data.x = Math.floor(this.data.x - this.data.mapW / 2) * this.data.UNITSIZE;
	        this.data.z = Math.floor(this.data.z - this.data.mapW / 2) * this.data.UNITSIZE;
	        this.data.hasLoaded = true
	    },

	    getRandBetween: function (lo, hi) {
	        return parseInt(Math.floor(Math.random() * (hi - lo + 1)) + lo, 10);
	    },

	    getMapSector: function (v) {
	        const x = Math.floor((v.x + this.data.UNITSIZE / 2) / this.data.UNITSIZE + this.data.mapW / 2);
	        const z = Math.floor((v.z + this.data.UNITSIZE / 2) / this.data.UNITSIZE + this.data.mapW / 2);
	        return {x: x, z: z};
	    },

	    /**
	     * Called when component is attached and when component data changes.
	     * Generally modifies the entity based on the data.
	     */
	    update: function (oldData) {

	    },

	    distance: function(x1, y1, x2, y2) {
	        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	    },

	    tick: function (_time, _delta) {

	        this.data.delta = _delta
	        this.data.time = _time
	        if(this.data.hasLoaded){
	            if (this.data.health <= 0) {
	                this.data.scene.remove(a);
	                //addAI();
	            }
	            // Move AI
	            var r = Math.random();
	            if (r > 0.995) {
	                this.data.lastRandomX = Math.random() * 2 - 1;
	                this.data.lastRandomZ = Math.random() * 2 - 1;
	            }
	            
	            this.el.object3D.translateX(this.data.aispeed * this.data.lastRandomX);
	            this.el.object3D.translateZ(this.data.aispeed * this.data.lastRandomZ);
	            var c = this.getMapSector(this.el.object3D.position);
	            // check for collision with default target camera
	            if (this.distance(c.x, c.z, this.data.cam.object3D.position.x, this.data.cam.object3D.position.z) < this.data.collisionDistance && !this.data.pauseForAction){
	               this.data.isColliding = true
	               if(this.data.collisionAction){
	                this.data.pauseForAction = true   
	                this.data.collisionAction()
	               }
	            }else{
	                this.data.isColliding = false
	            }

	            if (c.x < 0 || c.x >= this.data.mapW || c.y < 0 || c.y >= this.data.mapH || this.checkWallCollision(this.el.object3D.position)) {
	                this.el.object3D.translateX(-2 * this.data.aispeed * this.data.lastRandomX);
	                this.el.object3D.translateZ(-2 * this.data.aispeed * this.data.lastRandomZ);
	                this.data.lastRandomX = Math.random() * 2 - 1;
	                this.data.lastRandomZ = Math.random() * 2 - 1;
	            }
	            if (c.x < -1 || c.x > this.data.mapW || c.z < -1 || c.z > this.data.mapH) {
	                this.data.scene.remove(a);
	                //addAI();
	            }
	            var cc = this.getMapSector(this.data.cam.object3D.position);
	        }
	    },

	    /**
	     * Called when a component is removed (e.g., via removeAttribute).
	     * Generally undoes all modifications to the entity.
	     */
	    remove: function () {
	    },

	    /**
	     * Called on each scene tick.
	     */
	    // tick: function (t) { },

	    /**
	     * Called when entity pauses.
	     * Use to stop or remove any dynamic or background behavior such as events.
	     */
	    pause: function () {
	    },

	    /**
	     * Called when entity resumes.
	     * Use to continue or add any dynamic or background behavior such as events.
	     */
	    play: function () {
	    }
	});


/***/ })
/******/ ]);
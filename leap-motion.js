/* global Polymer, Leap */
'use strict';

/** 
 * An element providing a wrapper for Leap Motion.
 * 
 * Example:
 * 
 *      <leap-motion
 *        auto
 *        enable-gestures
 *        last-frame="{{frame}}">
 *      </leap-motion>
 * 
 * @group LeapMotion Elements
 * @element leap-motion
 * @demo demo/index.html
 * @hero hero.svg
 */

Polymer({

  is: 'leap-motion',

  /**
   * The `blur` event is fired when the browser page loses focus.
   *
   * @event blur
   */
  
  /**
   * The `connect` event is fired when this controller establishes a connection to the Leap Motion WebSocket server.
   *
   * @event connect
   */
  
  /**
   * The `device-attached` event is fired when the Leap Motion device is plugged in or turned on.
   *
   * @event device-attached
   */
  
  /**
   * The `device-connected` event is fired when the Leap Motion device is plugged in and 
   * when tracking is unpaused by the user.
   *
   * @event device-connected
   */
  
  /**
   * The `device-disconnected` event is fired when when the Leap Motion device is unplugged and
   * when tracking is paused by the user.
   *
   * @event device-disconnected
   */
  
  /**
   * The `device-removed` event is fired when the Leap Motion device is unplugged or turned off.
   * 
   * @event device-removed
   */
  
  /**
   * The `device-stopped` event is fired when the Leap Motion device stops providing data.
   *
   * @event device-stopped
   */
  
  /**
   * The `device-streaming` event is fired when the Leap Motion device starts providing data.
   *
   * @event device-streaming
   */
  
  /**
   * The `disconnect` event is fired when this Controller object disconnects
   * from the Leap Motion WebSocket server.
   *
   * @event disconnect
   */
  
  /**
   * The `focus` event is fired  when the browser tab gains focus.
   *
   * @event focus
   */
  
  /**
   * The `frame` event is fired on each loop.
   *
   * @event frame
   * @detail {frame}
   */

  /**
   * The `frameEnd` event is fired when the frame of data has been fully constructed.
   *
   * @event frameEnd
   * @detail {timestamp}
   */
  
  /**
   * The `gesture` event is fired for each gesture update in a frame.
   *
   * @event gesture
   * @detail {gesture}
   */
  
  /**
   * The `protocol` event is fired when the WebSocket server and
   * client have negotiated a protocol.
   *
   * @event protocol
   * @detail {protocol}
   */
  
  /**
   * The `streaming-started` event is fired when the Leap Motion service/daemon starts providing data.
   *
   * @event streaming-started
   */
  
  /**
   * The `streaming-stopped` event is fired when the Leap Motion service/daemon stops providing data.
   *
   * @event streaming-stopped
   */
  
  properties: {
    
    /**
      * The host name or IP address of the WebSocket server providing Leap Motion tracking data.
      */
    host: {
      type: String,
      value: '127.0.0.1'
    },
    
    /**
      * The port on which the WebSocket server is listening.
      */
    port: {
      type: Number,
      value: 6437
    },
    /**
      * Set to true to enable gesture recognition.
      * Omit or set to false if your application does not use gestures.
      */
    enableGestures: {
      type: Boolean,
      value: false
    },
    
    /**
      * Set to true to enable this application to receive frames when not the foreground application.
      */
    background: {
      type: Boolean,
      value: false
    },
    
    /**
      * Set to true to when mounting the Leap Motion hardware to a head-mounted display.
      */
    optimizeHmd: {
      type: Boolean,
      value: false
    },
    /**
     * The type of update loop to use for processing frame data.
     * * animationFrame uses the browser animation loop (generally 60 fps).
     * * deviceFrame runs at the Leap Motion controller frame rate (20 to 200 fps depending on the user’s settings and available computing power).
     */
    frameEventName: {
      type: String,
      value: 'animationFrame'
    },
    
    /**
      * This tells the controller to use all plugins included on the page.
      * For more information, see https://github.com/leapmotion/leapjs/wiki/plugins.
      */
    useAllPlugins: {
      type: Boolean,
      value: false
    },
    
    /**
      * Defaults to true, which means the animation frame loop runs at all times.
      * If you set this to false, the animation loop does only runs when
      * the Controller() object is connected to the Leap Motion service and 
      * only when a new frame of data is available.
      * Setting loopWhileDisconnected to false can minimize your app’s use of computing resources,
      * but may irregularly slow down or stop any animations driven by the frame loop.
      */
    loopWhileDisconnected: {
      type: Boolean,
      value: true
    },
    
    /**
     * If true, automatically performs a Leap Motion Controller when either `host` or
     * `port` or controller opction change.
     */
    auto: {
      type: Boolean,
      value: false
    },
    
    /**
     * Reports whether this Controller is currently connected to the Leap Motion service.
     */
    connected: {
      type: Boolean,
      value: false,
      notify: true
    },
    
    /**
     * Reports whether this Controller is currently recieving tracking data from the Leap Motion service.
     */
    streaming: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * Last device info received by device events
     */
    lastDeviceInfo: {
      type: Object,
      value: function () {
        return {};
      },
      notify: true
    },
    
    /**
     * Last frame received.
     */
    lastFrame: {
      type: Object,
      value: function () {
        return {};
      },
      notify: true
    },
    
    /**
     * Last frame end time from connection.
     */
    lastFrameEnd: {
      type: Number,
      value: 0,
      notify: true
    },

    /**
     * Last gesture detected.
     */
    lastGesture: {
      type: Object,
      value: function () {
        return {};
      },
      notify: true
    },
    
    isDeviceAttached: {
      type: Boolean,
      value: false,
      readonly: true,
      notify: true
    },
    
    isDeviceConnected: {
      type: Boolean,
      value: false,
      readonly: true,
      notify: true
    },
    
    isDeviceStreaming: {
      type: Boolean,
      value: false,
      readonly: true,
      notify: true
    },
    
    isFocus: {
      type: Boolean,
      value: false,
      readonly: true,
      notify: true
    }
  },

  observers: [
    '_configOptionsChanged(host, port, enableGestures, background, ' +
    'optimizeHmd, frameEventName, useAllPlugins, loopWhileDisconnected, auto)',
    '_backgroundChange(background)',
    '_optimizeHmdChange(optimizeHmd)'
  ],

  generateController: function () {
    this.controller = new Leap.Controller({
      host: this.host,
      port: this.port,
      enableGestures: this.enableGestures,
      background: this.background,
      optimizeHMD: this.optimizeHMD,
      frameEventName: this.frameEventName,
      useAllPlugins: this.useAllPlugins,
      loopWhileDisconnected: this.loopWhileDisconnected
    });
    return this.controller;
  },
  
  /**
   * Connects this Controller object to the Leap Motion WebSocket server.
   */
  connect: function(){
    this.controller.connect();
  },
  
  /**
   * Disconnects from the WebSocket server.
   */
  disconnect: function(){
    this.controller.disconnect();
  },

  _bindEvents: function () {
    if (this.controller) {
      this.controller.on('blur', this._onBlur.bind(this));
      this.controller.on('connect', this._onConnect.bind(this));
      this.controller.on('deviceAttached', this._onDeviceAttached.bind(this));
      this.controller.on('deviceConnected', this._onDeviceConnected.bind(this));
      this.controller.on('deviceDisconnected', this._onDeviceDisconnected.bind(this));
      this.controller.on('deviceRemoved', this._onDeviceRemoved.bind(this));
      this.controller.on('deviceStopped', this._onDeviceStopped.bind(this));
      this.controller.on('deviceStreaming', this._onDeviceStreaming.bind(this));
      this.controller.on('disconnect', this._onDisconnect.bind(this));
      this.controller.on('focus', this._onFocus.bind(this));
      this.controller.on('frame', this._onFrame.bind(this));
      this.controller.on('frameEnd', this._onFrameEnd.bind(this));
      this.controller.on('gesture', this._onGesture.bind(this));
      this.controller.on('protocol', this._onProtocol.bind(this));
      this.controller.on('streamingStarted', this._onStreamingStarted.bind(this));
      this.controller.on('streamingStopped', this._onStreamingStopped.bind(this));
    }
  },

  _onBlur: function (frame) {
    this.isFocus = false;
    this.fire('blur');
  },

  _onConnect: function () {
    this.connected = this.controller.connected();
    this.fire('connect');
  },

  _onDeviceAttached: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceAttached = true;
    this.fire('device-attached', deviceInfo);
  },
  
  _onDeviceConnected: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceConnected = true;
    this.fire('device-connected', deviceInfo);
  },

  _onDeviceDisconnected: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceConnected = false;
    this.fire('device-disconnected', deviceInfo);
  },
  
  _onDeviceRemoved: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceAttached = false;
    this.fire('device-removed', deviceInfo);
  },
  
  _onDeviceStopped: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceStreaming = false;
    this.fire('device-stopped', deviceInfo);
  },
  
  _onDeviceStreaming: function (deviceInfo) {
    this.lastDeviceInfo = deviceInfo;
    this.isDeviceStreaming = true;
    this.fire('device-streaming', deviceInfo);
  },

  _onDisconnect: function () {
    this.connected = this.controller.connected();
    this.fire('disconnect');
  },

  _onFocus: function () {
    this.isFocus = true;
    this.fire('focus');
  },

  _onFrame: function (frame) {
    this.lastFrame = frame;
    this.fire('frame', frame);
  },
  
  _onFrameEnd: function (frameEnd) {
    this.lastFrameEnd = frameEnd;
    this.fire('frameEnd', frameEnd);
  },

  _onGesture: function (gesture, frame) {
    this.lastGesture = gesture;
    this.fire('gesture', {
      gesture: gesture,
      frame: frame
    });
  },

  _onProtocol: function (protocol, frame) {
    this.lastProtocol = protocol;
    this.fire('protocol', {
      protocol: protocol,
      frame: frame
    });
  },
  
  _onStreamingStarted: function (deviceInfo) {
    this.streaming = this.controller.streaming();
    this.lastDeviceInfo = deviceInfo;
    this.fire('streaming-started', deviceInfo);
  },
  
  _onStreamingStopped: function (deviceInfo) {
    this.streaming = this.controller.streaming();
    this.lastDeviceInfo = deviceInfo;
    this.fire('streaming-stopped', deviceInfo);
  },

  _configOptionsChanged: function () {
    if (this.auto) {
      this.generateController();
      this._bindEvents();
      this.connect();
    }
  },
  _backgroundChange: function () {
    if (this.controller) {
      this.controller.setBackground(this.background);
    }
  },
  _optimizeHmdChange: function () {
    if (this.controller) {
      this.controller.setOptimizeHMD(this.optimizeHmd);
    }
  }
});

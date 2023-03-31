/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Supplements to core language objects (Array, Function)
 */
Array.prototype.contains = function(needle) {
    if (Array.prototype.indexOf)
        return this.indexOf(needle) != -1;
    for (var i in this)
        if (this[i] == needle)
            return true;
    return false;
}
Array.prototype.setLength = function(len, val) {
    val = typeof val != "undefined" ? val : null;
    for (var i = 0; i < len; i++) {
        this[i] = val;
    }
    return this;
}
Array.prototype.addDimension = function(len, val) {
    val = typeof val != "undefined" ? val : null;
    var thisLen = this.length; // minor optimization
    for (var i = 0; i < thisLen; i++) {
        this[i] = [].setLength(len, val);
    }
    return this;
}
Array.prototype.first = function() {
    return this[0];
}
Array.prototype.last = function() {
    return this[this.length-1];
}
Array.prototype.copy = function() {
    var copy = [];
    var len = this.length; // minor optimization
    for (var i = 0; i < len; i++) {
        if (this[i] instanceof Array) {
            copy[i] = this[i].copy();
        } else {
            copy[i] = this[i];
        }
    }
    return copy;
}


if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}

if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

if (!Array.prototype.every)
{
  Array.prototype.every = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this &&
          !fun.call(thisp, this[i], i, this))
        return false;
    }

    return true;
  };
}

if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this &&
          fun.call(thisp, this[i], i, this))
        return true;
    }

    return false;
  };
}

Array.from = function(it) {
    var arr = [];
    for (var i = 0; i < it.length; i++) {
        arr[i] = it[i];
    }
    return arr;
}

Function.prototype.bind = function($thisObj) {
    var $method = this;
    var $args = Array.from(arguments).slice(1);
    return function() {
        return $method.apply($thisObj, $args.concat(Array.from(arguments)));
    }
}/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file sets up the EidoGo framework.
 */

/**
 * Our namespaces.
 */
eidogo = window.eidogo || {};
/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * General-purpose utility functions.
 */
 
(function() {

// browser detection    
var ua = navigator.userAgent.toLowerCase();
var uav = (ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
eidogo.browser = {ua: ua, ver: uav, ie: /msie/.test(ua) && !/opera/.test(ua),
    moz: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua),
    safari3: /webkit/.test(ua) && parseInt(uav, 10) >= 420};

eidogo.util = {

    byId: function(id) {
        return document.getElementById(id);
    },
    
    makeQueryString: function(params) {
        var qs = "";
        if (params && typeof params == "object") {
            var pairs = [];
            for (var key in params) {
                if (params[key] && params[key].constructor == Array) {
                    for (var i = 0; i < params[key].length; i++) {
                        pairs.push(encodeURIComponent(key) + "=" +
                            encodeURIComponent(params[key]));
                    }
                } else {
                    pairs.push(encodeURIComponent(key) + "=" +
                        encodeURIComponent(params[key]));
                }
            }
            qs = pairs.join("&").replace(/%20/g, "+");
        }
        return qs;
    },
    
    // Adapted from jQuery
    ajax: function(method, url, params, successFn, failureFn, scope, timeout) {
        method = method.toUpperCase();
        var xhr = window.ActiveXObject ?
            new ActiveXObject("Microsoft.XMLHTTP") :
            new XMLHttpRequest();
        var qs = (params && typeof params == "object" ?
            eidogo.util.makeQueryString(params) : null);
        if (qs && method == "GET" ) {
            url += (url.match(/\?/) ? "&" : "?") + qs;
            qs = null;
        }
        xhr.open(method, url, true);
        if (qs) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        var requestDone = false;
        var isSafari = /webkit/.test(navigator.userAgent.toLowerCase());
        function httpSuccess(r) {
            try {
                return !r.status && location.protocol == "file:" ||
                (r.status >= 200 && r.status < 300) || r.status == 304 ||
                isSafari && r.status == undefined;
            } catch(e) {}
            return false;
        };
        function handleReadyState(isTimeout) {
            if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
                requestDone = true;
                if (ival) {
                    clearInterval(ival);
                    ival = null;
                }
                var status = isTimeout == "timeout" && "timeout" ||
                    !httpSuccess(xhr) && "error" ||
                    "success";
                if (status == "success")
                    successFn.call(scope, xhr);
                else
                    failureFn.call(scope);
                xhr = null;
            }
        }
        var ival = setInterval(handleReadyState, 13); 
        if (timeout)
            setTimeout(function() {
                if (xhr) {
                    xhr.abort();
                    if(!requestDone)
                        handleReadyState("timeout");
                }
            }, timeout);
        xhr.send(qs);
        return xhr;
    },
    
    // written by Dean Edwards, 2005
    // with input from Tino Zijdel, Matthias Miller, Diego Perini
    // http://dean.edwards.name/weblog/2005/10/add-event/
    // modified for use with EidoGo
    addEventHelper: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            if (!eidogo.util.addEventId) eidogo.util.addEventId = 1;
            // assign each event handler a unique ID
            if (!handler.$$guid) handler.$$guid = eidogo.util.addEventId++;
            // create a hash table of event types for the element
            if (!element.events) element.events = {};
            // create a hash table of event handlers for each element/event pair
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                // store the existing event handler (if there is one)
                if (element["on" + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            // store the event handler in the hash table
            handlers[handler.$$guid] = handler;
            // assign a global event handler to do all the work
            element["on" + type] = eidogo.util.handleEvent;
        }
    },

    handleEvent: function(event) {
        var returnValue = true;
        // grab the event object (IE uses a global event object)
        event = event || ((this.ownerDocument || this.document || this).parentWindow || window).event;
        // get a reference to the hash table of event handlers
        var handlers = this.events[event.type];
        // execute each event handler
        for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            if (this.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    },
    
    addEvent: function(el, eventType, handler, arg, override) {
        if (!el) return;
        if (override) {
            handler = handler.bind(arg);
        } else if (arg) {
            // use a closure to pass an extra argument
            var oldHandler = handler;
            handler = function(e) {
                oldHandler(e, arg);
            }
        }
        eidogo.util.addEventHelper(el, eventType, handler);
    },
    
    onClick: function(el, handler, scope) {
        eidogo.util.addEvent(el, "click", handler, scope, true);
    },
    
    getElClickXY: function(e, el, noScroll) {
        // for IE
        if(!e.pageX) {
            e.pageX = e.clientX + (document.documentElement.scrollLeft ||
                document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop ||
                document.body.scrollTop);
        }
        var elXY = eidogo.util.getElXY(el, noScroll);
        return [e.pageX - elXY[0], e.pageY - elXY[1]];
    },
    
    stopEvent: function(e) {
        if (!e) return;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    
    getTarget: function(ev) {
        var t = ev.target || ev.srcElement;
        return (t && t.nodeName && t.nodeName.toUpperCase() == "#TEXT") ?
            t.parentNode : t;
    },
    
    addClass: function(el, cls) {
        if (!cls) return;
        var ca = cls.split(/\s+/);
        for (var i = 0; i < ca.length; i++) {
            if (!eidogo.util.hasClass(el, ca[i]))
                el.className += (el.className ? " " : "") + ca[i];
        }
    },

    removeClass: function(el, cls) {
        var ca = el.className.split(/\s+/);
        var nc = [];
        for (var i = 0; i < ca.length; i++) {
            if (ca[i] != cls)
                nc.push(ca[i]);
        }
        el.className = nc.join(" ");
    },

    hasClass: function(el, cls) {
        var ca = el.className.split(/\s+/);
        for (var i = 0; i < ca.length; i++) {
            if (ca[i] == cls)
                return true;
        }
        return false;
    },
    
    show: function(el, display) {
        display = display || "block";
        if (typeof el == "string") {
            el = eidogo.util.byId(el);
        }
        if (!el) return;
        el.style.display = display;
    },
    
    hide: function(el) {
        if (typeof el == "string") {
            el = eidogo.util.byId(el);
        }
        if (!el) return;
        el.style.display = "none";
    },
    
    getElXY: function(el, noScroll) {
        // TODO: improve caching?
        // if (el._x && el._y) return [el._x, el._y];
        var node = el, elX = 0, elY = 0, parent = el.parentNode, sx = 0, sy = 0;
        while (node) {
            elX += node.offsetLeft;
            elY += node.offsetTop;
            node = node.offsetParent ? node.offsetParent : null;
        }
        while (!noScroll && parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
            sx += parent.scrollLeft;
            sy += parent.scrollTop;
            elX -= parent.scrollLeft;
            elY -= parent.scrollTop;
            parent = parent.parentNode;
        }
        // el._x = elX;
        // el._y = elY;
        return [elX, elY, sx, sy];
    },
    
    getElX: function(el) {
        return this.getElXY(el)[0];
    },
    
    getElY: function(el) {
        return this.getElXY(el)[1];
    },
    
    addStyleSheet: function(href) {
        if (document.createStyleSheet) {
            document.createStyleSheet(href);
        } else {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.getElementsByTagName("head")[0].appendChild(link);
        }
    },
    
    getPlayerPath: function() {
        var scripts = document.getElementsByTagName('script');
        var scriptPath;
        var script;
        for (var i = 0; script = scripts[i]; i++) {
            if (/(all\.compressed\.js|eidogo\.js)/.test(script.src)) {
                scriptPath = script.src.replace(/\/js\/[^\/]+$/, "");
            }
        }
        return scriptPath;
    },
    
    numProperties: function(obj) {
        var count = 0;
        for (var i in obj) count++;
        return count;
    }
    
};

})();eidogo = window.eidogo || {};
eidogo.i18n = eidogo.i18n || {
    'move':             'Move',
    'loading':          'Loading',
    'passed':           'passed',
    'resigned':         'resigned',
    
    'variations':       'Variations',
    'no variations':    'none',
    
    'tool':             'Tool',
    'view':             'Jump to Move',
    'play':             'Play',
    'region':           'Select Region',
    'add_b':            'Black Stone',
    'add_w':            'White Stone',
    'edit comment':     'Edit Comment',
    'edit game info':   'Edit Game Info',
    'done':             'Done',
    'triangle':         'Triangle',
    'square':           'Square',
    'circle':           'Circle',
    'x':                'X',
    'letter':           'Letter',
    'number':           'Number',
    'dim':              'Dim',
    'clear':            'Clear Marker',
    'score':            'Score', // as in score tool
    'score est':        'Score Estimate',
    'search':           'Search',
    'search corner':    'Corner Search',
    'search center':    'Center Search',
    'region info':      'Click and drag to select a region.',
    'two stones':       'Please select at least two stones to search for.',
    'two edges':        'For corner searches, your selection must touch two adjacent edges of the board.',
    'no search url':    'No search URL provided.',
    'close search':     'close search',
    'matches found':    'matches found.', // as in, "12 matches found"
    'show games':       'Show pro games with this position',
    'save to server':   'Save to Server',
    'download sgf':     'Download SGF',
    'next game':        'Next Game',
    'previous game':    'Previous Game',
    'end of variation': 'End of variation',

    'white':            'White',
    'white rank':       'White rank',
    'white team':       'White team',

    'black':            'Black',
    'black rank':       'Black rank',
    'black team':       'Black team',

    'captures':         'captures',
    'time left':        'time left',
    
    'you':              'You',

    'game':             'Game',
    'handicap':         'Handicap',
    'komi':             'Komi',
    'result':           'Result',
    'date':             'Date',
    'info':             'Info',
    'place':            'Place',
    'event':            'Event',
    'round':            'Round',
    'overtime':         'Overtime',
    'opening':          'Openning',
    'ruleset':          'Ruleset',
    'annotator':        'Annotator',
    'copyright':        'Copyright',
    'source':           'Source',
    'time limit':       'Time limit',
    'transcriber':      'Transcriber',
    'created with':     'Created with',

    'january':          'January',
    'february':         'February',
    'march':            'March',
    'april':            'April',
    'may':              'May',
    'june':             'June',
    'july':             'July',
    'august':           'August',
    'september':        'September',
    'october':          'October',
    'november':         'November',
    'december':         'December',
    
    'gw':               'Good for White',
    'vgw':              'Very good for White',
    'gb':               'Good for Black',
    'vgb':              'Very good for Black',
    'dm':               'Even position',
    'dmj':              'Even position (joseki)',
    'uc':               'Unclear position',
    'te':               'Tesuji',
    'bm':               'Bad move',
    'vbm':              'Very bad move',
    'do':               'Doubtful move',
    'it':               'Interesting move',
    'black to play':    'Black to play',
    'white to play':    'White to play',
    'ho':               'Hotspot',
    
    'confirm delete':   'You\'ve removed all properties from this position.\n\nDelete this position and all sub-positions?',
    'position deleted': 'Position deleted',

    'dom error':        'Error finding DOM container',
    'error retrieving': 'There was a problem retrieving the game data.',
    'invalid data':     'Received invalid game data',
    'error board':      'Error loading board container',
    'unsaved changes':  'There are unsaved changes in this game. You must save before you can permalink or download.',
    'bad path':         'Don\'t know how to get to path: ',
    
    'gnugo thinking':   'GNU Go is thinking...'
}/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file contains GameNode and GameCursor.
 */

/**
 * For uniquely identifying nodes. Should work even if we have
 * multiple Player instantiations. Setting this to 100000 is kind of a hack
 * to avoid overlap with ids of as-yet-unloaded trees.
 */
eidogo.gameNodeIdCounter = 100000;

/**
 * @class GameNode holds SGF-like data containing things like moves, labels
 * game information, and so on. Each GameNode has children and (usually) a
 * parent. The first child is the main line.
 */
eidogo.GameNode = function() {
    this.init.apply(this, arguments);
};
eidogo.GameNode.prototype = {
    /**
     * @constructor
     * @param {GameNode} parent Parent of the node
     * @param {Object} properties SGF-like JSON object to load into the node
     */
    init: function(parent, properties, id) {
        this._id = (typeof id != "undefined" ? id : eidogo.gameNodeIdCounter++);
        this._parent = parent || null;
        this._children = [];
        this._preferredChild = 0;
        if (properties)
            this.loadJson(properties);
    },
    /**
     * Adds a property to this node without replacing existing values. If
     * the given property already exists, it will make the value an array
     * containing the given value and any existing values.
    **/
    pushProperty: function(prop, value) {
        if (this[prop]) {
            if (!(this[prop] instanceof Array))
                this[prop] = [this[prop]];
            if (!this[prop].contains(value))
                this[prop].push(value);
        } else {
            this[prop] = value;
        }
    },
    /**
     * Check whether this node contains the given property with the given
     * value
    **/
    hasPropertyValue: function(prop, value) {
        if (!this[prop]) return false;
        var values = (this[prop] instanceof Array ? this[prop] : [this[prop]]);
        return values.contains(value);
    },
    /**
     * Removes a value from property or properties. If the value is the only
     * one for the property, removes the property also. Value can be a RegExp
     * or a string
    **/
    deletePropertyValue: function(prop, value) {
        var test = (value instanceof RegExp) ?
            function(v) { return value.test(v); } :
            function(v) { return value == v; };
        var props = (prop instanceof Array ? prop : [prop]);
        for (var i = 0; prop = props[i]; i++) {
            if (this[prop] instanceof Array) {
                this[prop] = this[prop].filter(function(v) { return !test(v); });
                if (!this[prop].length) delete this[prop];
            } else if (test(this.prop)) {
                delete this[prop];
            }
        }
    },
    /**
     * Loads SGF-like data given in JSON format:
     *      {PROP1: VALUE, PROP2: VALUE, _children: [...]}
     * Node properties will be overwritten if they exist or created if they
     * don't.
     *
     * We use a stack instead of recursion to avoid recursion limits.
    **/
    loadJson: function(data) {
        var jsonStack = [data], gameStack = [this];
        var jsonNode, gameNode;
        var i, len;
        while (jsonStack.length) {
            jsonNode = jsonStack.pop();
            gameNode = gameStack.pop();
            gameNode.loadJsonNode(jsonNode);
            len = (jsonNode._children ? jsonNode._children.length : 0);
            for (i = 0; i < len; i++) {
                jsonStack.push(jsonNode._children[i]);
                if (!gameNode._children[i])
                    gameNode._children[i] = new eidogo.GameNode(gameNode);
                gameStack.push(gameNode._children[i]);
            }
        }
    },
    /**
     * Adds properties to the current node from a JSON object
    **/
    loadJsonNode: function(data) {
        for (var prop in data) {
            if (prop == "_id") {
                this[prop] = data[prop].toString();
                eidogo.gameNodeIdCounter = Math.max(eidogo.gameNodeIdCounter,
                                                    parseInt(data[prop], 10));
                continue;
            }
            if (prop.charAt(0) != "_")
                this[prop] = data[prop];
        }
    },
    /**
     * Add a new child (variation)
    **/
    appendChild: function(node) {
        node._parent = this;
        this._children.push(node);
    },
    /**
     * Returns all the properties for this node
    **/
    getProperties: function() {
        var properties = {}, propName, isReserved, isString, isArray;
        for (propName in this) {
            isPrivate = (propName.charAt(0) == "_");
            isString = (typeof this[propName] == "string");
            isArray = (this[propName] instanceof Array);
            if (!isPrivate && (isString || isArray))
                properties[propName] = this[propName];
        }
        return properties;
    },
    /**
     * Applies a function to this node and all its children, recursively
     * (although we use a stack instead of actual recursion)
    **/
    walk: function(fn) {
        var stack = [this];
        var node;
        var i, len;
        while (stack.length) {
            node = stack.pop();
            fn(node);
            len = (node._children ? node._children.length : 0);
            for (i = 0; i < len; i++)
                stack.push(node._children[i]);
        }
    },
    /**
     * Get the current black or white move as a raw SGF coordinate
    **/
    getMove: function() {
        if (typeof this.W != "undefined")
            return this.W;
        else if (typeof this.B != "undefined")
            return this.B;
        return null;
    },
    /**
     * Empty the current node of any black or white stones (played or added)
    **/
    emptyPoint: function(coord) {
        var props = this.getProperties();
        var deleted = null;
        for (var propName in props) {
            if (propName == "AW" || propName == "AB" || propName == "AE") {
                if (!(this[propName] instanceof Array))
                    this[propName] = [this[propName]];
                this[propName] = this[propName].filter(function(val) {
                    if (val == coord) {
                        deleted = val;
                        return false;
                    }
                    return true;
                });
                if (!this[propName].length)
                    delete this[propName];
            } else if ((propName == "B" || propName == "W") && this[propName] == coord) {
                deleted = this[propName];
                delete this[propName];
            }
        }
        return deleted;
    },
    /**
     * Returns the node's position in its parent's _children array
    **/
    getPosition: function() {
        if (!this._parent) return null;
        var siblings = this._parent._children;
        for (var i = 0; i < siblings.length; i++)
            if (siblings[i]._id == this._id) {
                return i;
            }
        return null;
    },
    /**
     * Converts this node and all children to SGF
    **/
    toSgf: function() {
        var sgf = (this._parent ? "(" : "");
        var node = this;
        
        function propsToSgf(props) {
            if (!props) return "";
            var sgf = ";", key, val;
            for (key in props) {
                if (props[key] instanceof Array) {
                    val = props[key].map(function (val) {
                        return val.toString().replace(/\]/g, "\\]");
                    }).join("][");
                } else {
                    val = props[key].toString().replace(/\]/g, "\\]");
                }
                sgf += key + "[" + val  + "]";
            }
            return sgf;
        }
        
        sgf += propsToSgf(node.getProperties());
        
        // Follow main line until we get to a node with multiple variations
        while (node._children.length == 1) {
            node = node._children[0];
            sgf += propsToSgf(node.getProperties());
        }
        
        // Variations
        for (var i = 0; i < node._children.length; i++) {
            sgf += node._children[i].toSgf();
        }
        
        sgf += (this._parent ? ")" : "");
        
        return sgf;
    }
};

/**
 * @class GameCursor is used to navigate among the nodes of a game tree.
 */
eidogo.GameCursor = function() {
    this.init.apply(this, arguments);
}
eidogo.GameCursor.prototype = {
    /**
     * @constructor
     * @param {eidogo.GameNode} A node to start with
     */
    init: function(node) {
        this.node = node;
    },
    next: function(varNum) {
        if (!this.hasNext()) return false;
        varNum = (typeof varNum == "undefined" || varNum == null ?
            this.node._preferredChild : varNum);
        this.node._preferredChild = varNum;
        this.node = this.node._children[varNum];
        return true;
    },
    previous: function() {
        if (!this.hasPrevious()) return false;
        this.node = this.node._parent;
        return true;
    },
    hasNext: function() {
        return this.node && this.node._children.length;
    },
    hasPrevious: function() {
        // Checking _parent of _parent is to prevent returning to root
        return this.node && this.node._parent && this.node._parent._parent;
    },
    getNextMoves: function() {
        if (!this.hasNext()) return null;
        var moves = {};
        var i, node;
        for (i = 0; node = this.node._children[i]; i++)
            moves[node.getMove()] = i;
        return moves;
    },
    getNextColor: function() {
        if (!this.hasNext()) return null;
        var i, node;
        for (var i = 0; node = this.node._children[i]; i++)
            if (node.W || node.B)
                return node.W ? "W" : "B";
        return null;
    },
    getNextNodeWithVariations: function() {
        var node = this.node;
        while (node._children.length == 1)
            node = node._children[0];
        return node;
    },
    getPath: function() {
        var path = [];
        var cur = new eidogo.GameCursor(this.node);
        var mn = (cur.node._parent && cur.node._parent._parent ? -1 : null);
        var prev;
        do {
            prev = cur.node;
            cur.previous();
            if (mn != null) mn++;
        } while (cur.hasPrevious() && cur.node._children.length == 1);
        if (mn != null)
            path.push(mn);
        path.push(prev.getPosition());
        do {
            if (cur.node._children.length > 1 || cur.node._parent._parent == null)
                path.push(cur.node.getPosition());
        } while (cur.previous());
        return path.reverse();
    },
    getPathMoves: function() {
        var path = [];
        var cur = new eidogo.GameCursor(this.node);
        path.push(cur.node.getMove());
        while (cur.previous()) {
            var move = cur.node.getMove();
            if (move) path.push(move);
        }
        return path.reverse();
    },
    getMoveNumber: function() {
        var num = 0,
            node = this.node;
        while (node) {
            if (node.W || node.B) num++;
            node = node._parent;
        }
        return num;
    },
    getGameRoot: function() {
        if (!this.node) return null;
        var cur = new eidogo.GameCursor(this.node);
        // If we're on the tree root, return the first game
        if (!this.node._parent && this.node._children.length)
            return this.node._children[0];
        while (cur.previous()) {};
        return cur.node;
    }
};/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Quick and dirty SGF parser.
 */

/**
 * @class Returns an SGF-like JSON object of the form:
 *      { PROP1: value,  PROP2: value, ..., _children: [...]}
 */
eidogo.SgfParser = function() {
    this.init.apply(this, arguments);
}
eidogo.SgfParser.prototype = {
    /**
     * @constructor
     * @param {String} sgf Raw SGF data to parse
     */
    init: function(sgf, completeFn) {
        completeFn = (typeof completeFn == "function") ? completeFn : null;
        this.sgf = sgf;
        this.index = 0;
        this.root = {_children: []};
        this.parseTree(this.root);
        completeFn && completeFn.call(this);
    },
    parseTree: function(curnode) {
        while (this.index < this.sgf.length) {
            var c = this.curChar();
            this.index++;
            switch (c) {
                case ';':
                    curnode = this.parseNode(curnode);
                    break;
                case '(':
                    this.parseTree(curnode);
                    break;
                case ')':
                    return;
                    break;
            }
        }
    },
    parseNode: function(parent) {
        var node = {_children: []};
        if (parent)
            parent._children.push(node);
        else
            this.root = node;
        node = this.parseProperties(node);
        return node;
    },
    parseProperties: function(node) {
        var key = "";
        var values = [];
        var i = 0;
        while (this.index < this.sgf.length) {
            var c = this.curChar();
            if (c == ';' || c == '(' || c == ')') {
                break;
            }
            if (this.curChar() == '[') {
                while (this.curChar() == '[') {
                    this.index++;
                    values[i] = "";
                    while (this.curChar() != ']' && this.index < this.sgf.length) {
                        if (this.curChar() == '\\') {
                            this.index++;
                            // not technically correct, but works in practice
                            while (this.curChar() == "\r" || this.curChar() == "\n") {
                                this.index++;
                            }
                        }
                        values[i] += this.curChar();
                        this.index++;
                    }
                    i++;
                    while (this.curChar() == ']' || this.curChar() == "\n" || this.curChar() == "\r") {
                        this.index++;
                    }
                }
                if (node[key]) {
                    if (!(node[key] instanceof Array)) {
                        node[key] = [node[key]];
                    }
                    node[key] = node[key].concat(values);
                } else {
                    node[key] = values.length > 1 ? values : values[0];
                }
                key = "";
                values = [];
                i = 0;
                continue;
            }
            if (c != " " && c != "\n" && c != "\r" && c != "\t") {
                key += c;
            }
            this.index++;
        }
        return node;
    },
    curChar: function() {
        return this.sgf.charAt(this.index);
    }
};/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Go board-related stuff
 */

/**
 * @class Keeps track of board state and passes off rendering to a renderer.
 * We can theoretically have any kind of renderer. The board state is
 * independent of its visual presentation.
 */
eidogo.Board = function() {
    this.init.apply(this, arguments);
};
eidogo.Board.prototype = {
    WHITE: 1,
    BLACK: -1,
    EMPTY: 0,
    /**
     * @constructor
     * @param {Object} The renderer to use to draw the board. Renderers must
     * have at least three methods: clear(), renderStone(), and renderMarker()
     * @param {Number} Board size -- theoretically could be any size,
     * but there's currently only CSS for 9, 13, and 19
     */
    init: function(renderer, boardSize) {
        this.boardSize = boardSize || 19;
        this.stones = this.makeBoardArray(this.EMPTY);
        this.markers = this.makeBoardArray(this.EMPTY);
        this.captures = {};
        this.captures.W = 0;
        this.captures.B = 0;
        this.cache = [];
        this.renderer = renderer || new eidogo.BoardRendererHtml();
        this.lastRender = {
            stones: this.makeBoardArray(null),
            markers: this.makeBoardArray(null)
        };
    },
    reset: function() {
        this.init(this.renderer, this.boardSize);
    },
    clear: function() {
        this.clearStones();
        this.clearMarkers();
        this.clearCaptures();
    },
    clearStones: function() {
        // we could use makeBoardArray(), but this is more efficient
        for (var i = 0; i < this.stones.length; i++) {
            this.stones[i] = this.EMPTY;
        }
    },
    clearMarkers: function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i] = this.EMPTY;
        }
    },
    clearCaptures: function() {
        this.captures.W = 0;
        this.captures.B = 0;
    },
    makeBoardArray: function(val) {
        // We could use a multi-dimensional array but doing this avoids
        // the need for deep copying during commit, which is very slow.
        return [].setLength(this.boardSize * this.boardSize, val);
    },
    /**
     * Save the current state. This allows us to revert back
     * to previous states for, say, navigating backwards in a game.
     */
    commit: function() {
        this.cache.push({
            stones: this.stones.concat(),
            captures: {W: this.captures.W, B: this.captures.B}
        });
    },
    /**
     * Undo any uncomitted changes.
     */
    rollback: function() {
        if (this.cache.last()) {
            this.stones = this.cache.last().stones.concat();
            this.captures.W = this.cache.last().captures.W;
            this.captures.B = this.cache.last().captures.B;
        } else {
            this.clear();
        }
    },
    /**
     * Revert to a previous state.
     */
    revert: function(steps) {
        steps = steps || 1;
        this.rollback();
        for (var i = 0; i < steps; i++) {
            this.cache.pop();
        }
        this.rollback();
    },
    addStone: function(pt, color) {
        this.stones[pt.y * this.boardSize + pt.x] = color;
    },
    getStone: function(pt) {
        return this.stones[pt.y * this.boardSize + pt.x];
    },
    getRegion: function(t, l, w, h) {
        var region = [].setLength(w * h, this.EMPTY);
        var offset;
        for (var y = t; y < t + h; y++) {
            for (var x = l; x < l + w; x++) {
                offset = (y - t) * w + (x - l);
                region[offset] = this.getStone({x:x, y:y});
            }
        }
        return region;
    },
    addMarker: function(pt, type) {
        this.markers[pt.y * this.boardSize + pt.x] = type;
    },
    getMarker: function(pt) {
        return this.markers[pt.y * this.boardSize + pt.x];
    },
    render: function(complete) {
        var stones = this.makeBoardArray(null);
        var markers = this.makeBoardArray(null);
        var color, type;
        var len;
        if (!complete && this.cache.last()) {
            var lastCache = this.cache.last();
            len = this.stones.length;
            // render only points that have changed since the last render
            for (var i = 0; i < len; i++) {
                if (lastCache.stones[i] != this.lastRender.stones[i]) {
                    stones[i] = lastCache.stones[i];
                }
            }
            markers = this.markers;
        } else {
            // render everything
            stones = this.stones;
            markers = this.markers;
        }
        var offset;
        for (var x = 0; x < this.boardSize; x++) {
            for (var y = 0; y < this.boardSize; y++) {
                offset = y * this.boardSize + x;
                if (markers[offset] != null) {
                    this.renderer.renderMarker({x: x, y: y}, markers[offset]);
                    this.lastRender.markers[offset] = markers[offset];
                }
                if (stones[offset] == null) {
                    continue;
                } else if (stones[offset] == this.EMPTY) {
                    color = "empty";
                } else {
                    color = (stones[offset] == this.WHITE ? "white" : "black");
                }
                this.renderer.renderStone({x: x, y: y}, color);
                this.lastRender.stones[offset] = stones[offset];
            }
        }
    }
};

/**
 * @class An HTML/DOM-based board renderer.
 */
eidogo.BoardRendererHtml = function() {
    this.init.apply(this, arguments);
}
eidogo.BoardRendererHtml.prototype = {
    /**
     * @constructor
     * @param {HTMLElement} domContainer Where to put the board
     */
    init: function(domContainer, boardSize, player, crop) {
        if (!domContainer) {
            throw "No DOM container";
            return;
        }
        this.boardSize = boardSize || 19;
        var domGutter = document.createElement('div');
        domGutter.className = "board-gutter" + (this.boardSize == 19 ?
                " with-coords" : "");
        domContainer.appendChild(domGutter);
        var domBoard = document.createElement('div');
        domBoard.className = "board size" + this.boardSize;
        domBoard.style.position = (crop && eidogo.browser.ie ? "static" : "relative");
        domGutter.appendChild(domBoard);
        this.domNode = domBoard;
        this.domGutter = domGutter;
        this.domContainer = domContainer;
        this.player = player;
        this.uniq = domContainer.id + "-";
        this.renderCache = {
            stones: [].setLength(this.boardSize, 0).addDimension(this.boardSize, 0),
            markers: [].setLength(this.boardSize, 0).addDimension(this.boardSize, 0)
        }
        // auto-detect point width, point height, and margin
        this.pointWidth = 0;
        this.pointHeight = 0;
        this.margin = 0;
        var stone = this.renderStone({x:0,y:0}, "black");
        this.pointWidth = this.pointHeight = stone.offsetWidth;
        this.renderStone({x:0,y:0}, "white"); // just for image caching
        this.renderMarker({x:0,y:0}, "current"); // just for image caching
        this.clear();
        this.margin = (this.domNode.offsetWidth - (this.boardSize * this.pointWidth)) / 2;
        
        // needed to accommodate IE's broken layout engine
        this.scrollX = 0;
        this.scrollY = 0;
        
        if (crop) {
            this.crop(crop);
            if (eidogo.browser.ie) {
                var parent = this.domNode.parentNode;
                while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                    this.scrollX += parent.scrollLeft;
                    this.scrollY += parent.scrollTop;
                    parent = parent.parentNode;
                }
            }
        }
        
        // add the search region selection box for later use
        this.dom = {};
        this.dom.searchRegion = document.createElement('div');
        this.dom.searchRegion.id = this.uniq + "search-region";
        this.dom.searchRegion.className = "search-region";
        this.domNode.appendChild(this.dom.searchRegion);
        
        eidogo.util.addEvent(this.domNode, "mousemove", this.handleHover, this, true);
        eidogo.util.addEvent(this.domNode, "mousedown", this.handleMouseDown, this, true);
        eidogo.util.addEvent(this.domNode, "mouseup", this.handleMouseUp, this, true);
    },
    showRegion: function(bounds) {
        this.dom.searchRegion.style.top = (this.margin + this.pointHeight * bounds[0]) + "px";
        this.dom.searchRegion.style.left = (this.margin + this.pointWidth * bounds[1]) + "px";
        this.dom.searchRegion.style.width = this.pointWidth * bounds[2] + "px";
        this.dom.searchRegion.style.height = this.pointHeight * bounds[3] + "px";
        eidogo.util.show(this.dom.searchRegion);
    },
    hideRegion: function() {
        eidogo.util.hide(this.dom.searchRegion);  
    },
    clear: function() {
        this.domNode.innerHTML = "";
    },
    renderStone: function(pt, color) {
        var stone = document.getElementById(this.uniq + "stone-" + pt.x + "-" + pt.y);
        if (stone) {
            stone.parentNode.removeChild(stone);
        }
        if (color != "empty") {
            var div = document.createElement("div");
            div.id = this.uniq + "stone-" + pt.x + "-" + pt.y;
            div.className = "point stone " + color;
            try {
                div.style.left = (pt.x * this.pointWidth + this.margin - this.scrollX) + "px";
                div.style.top = (pt.y * this.pointHeight + this.margin - this.scrollY) + "px";
            } catch (e) {}
            this.domNode.appendChild(div);
            return div;
        }
        return null;
    },
    renderMarker: function(pt, type) {
        if (this.renderCache.markers[pt.x][pt.y]) {
            var marker = document.getElementById(this.uniq + "marker-" + pt.x + "-" + pt.y);
            if (marker) {
                marker.parentNode.removeChild(marker);
            }
        }
        if (type == "empty" || !type) { 
            this.renderCache.markers[pt.x][pt.y] = 0;
            return null;
        }
        this.renderCache.markers[pt.x][pt.y] = 1;
        if (type) {
            var text = "";
            switch (type) {
                case "triangle":
                case "square":
                case "circle":
                case "ex":
                case "territory-white":
                case "territory-black":
                case "dim":
                case "current":
                    break;
                default:
                    if (type.indexOf("var:") == 0) {
                        text = type.substring(4);
                        type = "variation";
                    } else {
                        text = type;
                        type = "label";
                    }
                    break;
            }
            var div = document.createElement("div");
            div.id = this.uniq + "marker-" + pt.x + "-" + pt.y;
            div.className = "point marker " + type;
            try {
                div.style.left = (pt.x * this.pointWidth + this.margin - this.scrollX) + "px";
                div.style.top = (pt.y * this.pointHeight + this.margin - this.scrollY) + "px";
            } catch (e) {}
            div.appendChild(document.createTextNode(text));
            this.domNode.appendChild(div);
            return div;
        }
        return null;
    },
    setCursor: function(cursor) {
        this.domNode.style.cursor = cursor;
    },
    handleHover: function(e) {
        var xy = this.getXY(e);
        this.player.handleBoardHover(xy[0], xy[1]);
    },
    handleMouseDown: function(e) {
        var xy = this.getXY(e);
        this.player.handleBoardMouseDown(xy[0], xy[1]);
    },
    handleMouseUp: function(e) {
        var xy = this.getXY(e);
        this.player.handleBoardMouseUp(xy[0], xy[1]);
    },
    /**
     *  Gets the board coordinates (0-18) for a mouse event
    **/
    getXY: function(e) {
        var clickXY = eidogo.util.getElClickXY(e, this.domNode);
        
        var m = this.margin;
        var pw = this.pointWidth;
        var ph = this.pointHeight;
        
        var x = Math.round((clickXY[0] - m - (pw / 2)) / pw);
        var y = Math.round((clickXY[1] - m - (ph / 2)) / ph);
    
        return [x, y];
    },
    crop: function(crop) {
        eidogo.util.addClass(this.domContainer, "shrunk");
        this.domGutter.style.overflow = "hidden";
        var width = crop.width * this.pointWidth + this.margin;
        var height = crop.height * this.pointHeight + this.margin;
        this.domGutter.style.width = width + "px";
        this.domGutter.style.height = height + "px";
        this.player.dom.player.style.width = width + "px";
        this.domGutter.scrollLeft = crop.left * this.pointWidth;
        this.domGutter.scrollTop = crop.top * this.pointHeight;
    }
}

/**
 * Flash board renderer
**/
eidogo.BoardRendererFlash = function() {
    this.init.apply(this, arguments);
}
eidogo.BoardRendererFlash.prototype = {
    /**
     * @constructor
     * @param {HTMLElement} domContainer Where to put the board
     */
    init: function(domContainer, boardSize, player, crop) {
        if (!domContainer) {
            throw "No DOM container";
            return;
        }
        this.ready = false;
        this.swf = null;
        this.unrendered = [];
        var swfId = domContainer.id + "-board";
        var so = new SWFObject(eidogo.playerPath + "/swf/board.swf", swfId,
            "421", "421", "8", "#665544");
        so.addParam("allowScriptAccess", "sameDomain");
        so.write(domContainer);
        var elapsed = 0;
        var initBoard = function() {
            swf = eidogo.util.byId(swfId);
            if (!swf || !swf.init) {
                if (elapsed > 2000) {            
                    throw "Error initializing board";
                    return;
                }
                setTimeout(arguments.callee.bind(this), 10);
                elapsed += 10;
                return;
            }
            this.swf = swf;
            this.swf.init(player.uniq, boardSize);
            this.ready = true;
        }.bind(this);
        initBoard();
    },
    showRegion: function(bounds) {
    },
    hideRegion: function() {
    },
    clear: function() {
        if (!this.swf) return;
        this.swf.clear();
    },
    renderStone: function(pt, color) {
        if (!this.swf) {
            this.unrendered.push(['stone', pt, color]);
            return;
        }
        for (var i = 0; i < this.unrendered.length; i++) {
            if (this.unrendered[i][0] == "stone") {
                this.swf.renderStone(this.unrendered[i][1], this.unrendered[i][2]);
            }
        }
        this.unrendered = [];
        this.swf.renderStone(pt, color);
    },
    renderMarker: function(pt, type) {
        if (!type) return;
        if (!this.swf) {
            this.unrendered.push(['marker', pt, type]);
            return;
        }
        for (var i = 0; i < this.unrendered.length; i++) {
            if (this.unrendered[i][0] == "marker") {
                this.swf.renderMarker(this.unrendered[i][1], this.unrendered[i][2]);
            }
        }
        this.unrendered = [];
        this.swf.renderMarker(pt, type);
    },
    setCursor: function(cursor) {
    },
    crop: function() {
    }
}

/**
 * @class ASCII board renderer! Kinda broken.
 */
eidogo.BoardRendererAscii = function(domNode, boardSize) {
    this.init(domNode, boardSize);
}
eidogo.BoardRendererAscii.prototype = {
    pointWidth: 2,
    pointHeight: 1,
    margin: 1,
    blankBoard: "+-------------------------------------+\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "|. . . . . . . . . . . . . . . . . . .|\n" +
                "+-------------------------------------+",
    init: function(domNode, boardSize) {
        this.domNode = domNode || null;
        this.boardSize = boardSize || 19;
        this.content = this.blankBoard;
    },
    clear: function() {
        this.content = this.blankBoard;
        this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
    },
    renderStone: function(pt, color) {
        var offset = (this.pointWidth * this.boardSize + this.margin * 2)
            * (pt.y * this.pointHeight + 1)
            + (pt.x * this.pointWidth) + 2;
        this.content = this.content.substring(0, offset-1) + "."
            + this.content.substring(offset);
        if (color != "empty") {
            this.content = this.content.substring(0, offset-1) +
                (color == "white" ? "O" : "#") + this.content.substring(offset);
        }
        this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
    },
    renderMarker: function(pt, type) {
        // I don't think this is possible
    }
}/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 */

/**
 * @class Applies rules (capturing, ko, etc) to a board.
 */
eidogo.Rules = function(board) {
    this.init(board);
};
eidogo.Rules.prototype = {
    /**
     * @constructor
     * @param {eidogo.Board} board The board to apply rules to
     */
    init: function(board) {
        this.board = board;
        this.pendingCaptures = [];
    },
    /**
     * Called to see whether a stone may be placed at a given point
    **/
    check: function(pt, color) {
        // already occupied?
        if (this.board.getStone(pt) != this.board.EMPTY) {
            return false;
        }
        // TODO: check for suicide? (allowed in certain rulesets)    
        // TODO: ko
        return true;
    },
    /**
     * Apply rules to the current game (perform any captures, etc)
    **/
    apply: function(pt, color) {
        this.doCaptures(pt, color);
    },
    /**
     * Thanks to Arno Hollosi for the capturing algorithm
     */
    doCaptures: function(pt, color) {
        var captures = 0;
        captures += this.doCapture({x: pt.x-1, y: pt.y}, color);
        captures += this.doCapture({x: pt.x+1, y: pt.y}, color);
        captures += this.doCapture({x: pt.x, y: pt.y-1}, color);
        captures += this.doCapture({x: pt.x, y: pt.y+1}, color);
        // check for suicide
        captures -= this.doCapture(pt, -color);
        if (captures < 0) {
            // make sure suicides give proper points (some rulesets allow it)
            color = -color;
            captures = -captures;
        }
        color = color == this.board.WHITE ? "W" : "B";
        this.board.captures[color] += captures;
    },
    doCapture: function(pt, color) {
        this.pendingCaptures = [];
        if (this.findCaptures(pt, color))
            return 0;
        var caps = this.pendingCaptures.length;
        while (this.pendingCaptures.length) {
            this.board.addStone(this.pendingCaptures.pop(), this.board.EMPTY);
        }
        return caps;
    },
    findCaptures: function(pt, color) {
        // out of bounds?
        if (pt.x < 0 || pt.y < 0 ||
            pt.x >= this.board.boardSize || pt.y >= this.board.boardSize)
            return 0;
        // found opposite color
        if (this.board.getStone(pt) == color)
            return 0;
        // found a liberty
        if (this.board.getStone(pt) == this.board.EMPTY)
            return 1;
        // already visited?
        for (var i = 0; i < this.pendingCaptures.length; i++)
            if (this.pendingCaptures[i].x == pt.x && this.pendingCaptures[i].y == pt.y)
                return 0;
        
        this.pendingCaptures.push(pt);
        
        if (this.findCaptures({x: pt.x-1, y: pt.y}, color))
            return 1;
        if (this.findCaptures({x: pt.x+1, y: pt.y}, color))
            return 1;
        if (this.findCaptures({x: pt.x, y: pt.y-1}, color))
            return 1;
        if (this.findCaptures({x: pt.x, y: pt.y+1}, color))
            return 1;
        return 0;
    }
}/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file contains the meat of EidoGo.
 */

(function() {

// shortcuts (local only to this file)
var t = eidogo.i18n,
    byId = eidogo.util.byId,
    ajax = eidogo.util.ajax,
    addEvent = eidogo.util.addEvent,
    onClick = eidogo.util.onClick,
    getElClickXY = eidogo.util.getElClickXY,
    stopEvent = eidogo.util.stopEvent,
    addClass = eidogo.util.addClass,
    removeClass = eidogo.util.removeClass,
    show = eidogo.util.show,
    hide = eidogo.util.hide,
    isMoz = eidogo.browser.moz,
    playerPath = eidogo.util.getPlayerPath();

// Keep track of all the player instances we've created
eidogo.players = eidogo.players || {};

// Allow function calls to particular Player instances (for board rendering etc)
eidogo.delegate = function(pid, fn /*, args*/) {
    var player = eidogo.players[pid];
    player[fn].apply(player, Array.from(arguments).slice(2));
}

/**
 * @class Player is the overarching control structure that allows you to
 * load and replay games. It's a "player" in the sense of a DVD player, not
 * a person who plays a game.
 */
eidogo.Player = function() {
    this.init.apply(this, arguments);
}
eidogo.Player.prototype = {
    
    /**
     * Inits settings that are persistent among games
     * @constructor
     * @param {Object} cfg A hash of configuration values
     */
    init: function(cfg) {
    
        cfg = cfg || {};
        
        // play, add_b, add_w, region, tr, sq, cr, label, number, score(?)
        this.mode = cfg.mode ? cfg.mode : "play";
    
        // for references to all our DOM objects -- see constructDom()
        this.dom = {};
        this.dom.container = (typeof cfg.container == "string" ?
            byId(cfg.container) : cfg.container);
    
        if (!this.dom.container) {
            alert(t['dom error']);
            return;
        }
    
        // unique id, so we can have more than one player on a page
        this.uniq = (new Date()).getTime();
        
        // store for later
        eidogo.players[this.uniq] = this;
        
        // URL path to SGF files
        this.sgfPath = cfg.sgfPath;
        
        // pattern and game info search
        this.searchUrl = cfg.searchUrl;
        this.showingSearch = false;
        
        // save to file
        this.saveUrl = cfg.saveUrl;
        
        // url to handle downloads
        this.downloadUrl = cfg.downloadUrl;
        
        // score est
        this.scoreEstUrl = cfg.scoreEstUrl;
        
        // Allow outside scripts to hook into Player events. Format:
        //      hookName:   hookHandler
        // Available hooks:
        // - initDone
        // - initGame
        // - setPermalink
        // - searchRegion
        this.hooks = cfg.hooks || {};
        
        this.permalinkable = !!this.hooks.setPermalink;
        
        // handlers for the various types of GameNode properties
        this.propertyHandlers = {
            W:  this.playMove,
            B:  this.playMove,
            KO: this.playMove,
            MN: this.setMoveNumber,
            AW: this.addStone,
            AB: this.addStone,
            AE: this.addStone,
            CR: this.addMarker, // circle
            LB: this.addMarker, // label
            TR: this.addMarker, // triangle
            MA: this.addMarker, // X
            SQ: this.addMarker, // square
            TW: this.addMarker,
            TB: this.addMarker,
            DD: this.addMarker,
            PL: this.setColor,
            C:  this.showComments,
            N:  this.showAnnotation,
            GB: this.showAnnotation,
            GW: this.showAnnotation,
            DM: this.showAnnotation,
            HO: this.showAnnotation,
            UC: this.showAnnotation,
            V:  this.showAnnotation,
            BM: this.showAnnotation,
            DO: this.showAnnotation,
            IT: this.showAnnotation,
            TE: this.showAnnotation,
            BL: this.showTime,
            OB: this.showTime,
            WL: this.showTime,
            OW: this.showTime
        };
        
        this.infoLabels = {
            GN: t['game'],
            PW: t['white'],
            WR: t['white rank'],
            WT: t['white team'],
            PB: t['black'],
            BR: t['black rank'],
            BT: t['black team'],
            HA: t['handicap'],
            KM: t['komi'],
            RE: t['result'],
            DT: t['date'],
            GC: t['info'],
            PC: t['place'],
            EV: t['event'],
            RO: t['round'],
            OT: t['overtime'],
            ON: t['opening'],
            RU: t['ruleset'],
            AN: t['annotator'],
            CP: t['copyright'],
            SO: t['source'],
            TM: t['time limit'],
            US: t['transcriber'],
            AP: t['created with']
            // FF, GM, TM
        };
        
        this.months = [
            t['january'],
            t['february'],
            t['march'],
            t['april'],
            t['may'],
            t['june'],
            t['july'],
            t['august'],
            t['september'],
            t['october'],
            t['november'],
            t['december']
        ];
        
        // UI theme
        this.theme = cfg.theme;
        
        // initialize per-game settings
        this.reset(cfg);
        
        // custom renderer?
        this.renderer = cfg.renderer || "html";
        
        // crop settings
        this.cropParams = null;
        this.shrinkToFit = cfg.shrinkToFit;
        if (this.shrinkToFit || cfg.cropWidth || cfg.cropHeight) {
            this.cropParams = {};
            this.cropParams.width = cfg.cropWidth;
            this.cropParams.height = cfg.cropHeight;
            this.cropParams.left = cfg.cropLeft;
            this.cropParams.top = cfg.cropTop;
            this.cropParams.padding = cfg.cropPadding || 1;
        }
        
        // set up the elements we'll use
        this.constructDom();
        
        // player-wide events
        if (cfg.enableShortcuts) {
            addEvent(document, isMoz ? "keypress" : "keydown", this.handleKeypress, this, true);
        }
        addEvent(document, "mouseup", this.handleDocMouseUp, this, true);
        
        if (cfg.sgf || cfg.sgfUrl || (cfg.sgfPath && cfg.gameName)) {
            this.loadSgf(cfg);
        }
        
        this.hook("initDone");
    },
    
    /**
     * Delegate to a hook handler. 'this' will be bound to the Player
     * instance
    **/
    hook: function(hook, params) {
        if (hook in this.hooks) {
            return this.hooks[hook].bind(this)(params);
        }
    },
    
    /**
     * Resets settings that can change per game
    **/
    reset: function(cfg) {
        this.gameName = "";
        
        // Multiple games can be contained in collectionRoot. We default
        // to the first (collectionRoot._children[0])
        // See http://www.red-bean.com/sgf/sgf4.html 
        this.collectionRoot = new eidogo.GameNode();
        this.cursor = new eidogo.GameCursor();
    
        // used for Ajaxy dynamic branch loading
        this.progressiveLoad = cfg.progressiveLoad ? true : false;
        this.progressiveLoads = null;
        this.progressiveUrl = null;
        this.progressiveMode = cfg.progressiveLoad && cfg.progressiveMode || "id";
        
        // gnugo/computer opponent
        this.opponentUrl = null;
        this.opponentColor = null;
        this.opponentLevel = null;
        
        // these are populated after load
        this.board = null;
        this.rules = null;
        this.currentColor = null;
        this.moveNumber = null;
        this.totalMoves = null;
        this.variations = null;
        this.timeB = "";
        this.timeW = "";
    
        // region selection state
        this.regionTop = null;
        this.regionLeft = null;
        this.regionWidth = null;
        this.regionHeight = null;
        this.regionBegun = null;
        this.regionClickSelect = null;
    
        // mouse clicking/dragging state
        this.mouseDown = null;
        this.mouseDownX = null;
        this.mouseDownY = null;
    
        // for the letter and number tools
        this.labelLastLetter = null;
        this.labelLastNumber = null;
        this.resetLastLabels();
        
        // so we know when permalinks and downloads are unreliable
        this.unsavedChanges = false;
        
        // to know when to update the nav tree
        this.updatedNavTree = false;
        
        // whether we're currently searching or editing
        this.searching = false;
        this.editingText = false;
        this.goingBack = false;
        
        // problem-solving mode: respond when the user plays a move
        this.problemMode = cfg.problemMode;
        this.problemColor = cfg.problemColor || "W";
    
        // user-changeable preferences
        this.prefs = {};
        this.prefs.markCurrent = typeof cfg.markCurrent != "undefined" ?
            !!cfg.markCurrent : true;
        this.prefs.markNext = typeof cfg.markNext != "undefined" ?
            cfg.markNext : false;
        this.prefs.markVariations = typeof cfg.markVariations != "undefined" ?
            !!cfg.markVariations : true;
        this.prefs.showGameInfo = !!cfg.showGameInfo;
        this.prefs.showPlayerInfo = !!cfg.showPlayerInfo;
        this.prefs.showTools = !!cfg.showTools;
        this.prefs.showComments = typeof cfg.showComments != "undefined" ?
            !!cfg.showComments : true;
        this.prefs.showOptions = !!cfg.showOptions;
        this.prefs.showNavTree = !this.progressiveLoad && typeof cfg.showNavTree != "undefined" ?
            !!cfg.showNavTree : false;
        // Firefox and Safari 3 only for now
        if (this.prefs.showNavTree && !(eidogo.browser.moz || eidogo.browser.safari3))
            this.prefs.showNavTree = false;
    },
    
    /**
     * Load an SGF file or start from a blank board
    **/
    loadSgf: function(cfg, completeFn) {
        cfg = cfg || {};
        
        this.nowLoading();
        
        this.reset(cfg);
        
        // URL path to SGF files
        this.sgfPath = cfg.sgfPath || this.sgfPath;
    
        // Load the first node of the first node by default
        this.loadPath = cfg.loadPath && cfg.loadPath.length > 1 ?
            cfg.loadPath : [0, 0];
    
        // game name (= file name) of the game to load
        this.gameName = cfg.gameName || "";
        
        // For calling completeFn asynchronously
        var noCb = false;
        
        if (typeof cfg.sgf == "string") {
        
            // raw SGF data
            var sgf = new eidogo.SgfParser(cfg.sgf);
            this.load(sgf.root);
    
        } else if (typeof cfg.sgf == "object") {
    
            // already-parsed JSON game tree
            this.load(cfg.sgf);
        
        } else if (cfg.progressiveLoad && cfg.progressiveUrl) {
            
            this.progressiveLoads = 0;
            this.progressiveUrl = cfg.progressiveUrl;
            this.fetchProgressiveData(completeFn);
            noCb = true;
            
        } else if (typeof cfg.sgfUrl == "string" || this.gameName) {
        
            // the URL can be provided as a single sgfUrl or as sgfPath + gameName
            if (!cfg.sgfUrl) {
                cfg.sgfUrl = this.sgfPath + this.gameName + ".sgf";
            }
            
            // load data from a URL
            this.remoteLoad(cfg.sgfUrl, null, false, null, completeFn);
            noCb = true;
            
            if (cfg.progressiveLoad) {
                this.progressiveLoads = 0;
                this.progressiveUrl = cfg.progressiveUrl ||
                    cfg.sgfUrl.replace(/\?.+$/, "");
            }
            
        } else {
    
            // start from scratch
            var boardSize = cfg.boardSize || "19";
            var komiMap = {19: 6.5, 13: 4.5, 9: 3.5};
            var blankGame = {_children: [{
                    SZ: boardSize,
                    KM: cfg.komi || komiMap[boardSize] || 6.5,
                    _children: []}]};
        
            // AI opponent (e.g. GNU Go)
            if (cfg.opponentUrl) {
                this.gameName = "gnugo";
                this.opponentUrl = cfg.opponentUrl;
                this.opponentColor = cfg.opponentColor == "B" ? cfg.opponentColor : "W";
                this.opponentLevel = cfg.opponentLevel || 7;
                var root = blankGame._children[0];
                root.PW = this.opponentColor == "B" ? t['you'] : "GNU Go";
                root.PB = this.opponentColor == "B" ? "GNU Go" : t['you'];
                root.HA = parseInt(cfg.handicap, 10) || 0;
                if (root.HA) {
                    var handiCoords = {
                        19: [['pd', 'dp'],
                             ['pd', 'dp', 'pp'],
                             ['pd', 'dp', 'pp', 'dd'],
                             ['pd', 'dp', 'pp', 'dd', 'jj'],
                             ['pd', 'dp', 'pp', 'dd', 'dj', 'pj'],
                             ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jj'],
                             ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jd', 'jp'],
                             ['pd', 'dp', 'pp', 'dd', 'dj', 'pj', 'jd', 'jp', 'jj']],
                        13: [['jd', 'dj'],
                             ['jd', 'dj', 'jj'],
                             ['jd', 'dj', 'jj', 'dd'],
                             ['jd', 'dj', 'jj', 'dd', 'gg'],
                             ['jd', 'dj', 'jj', 'dd', 'dg', 'jg'],
                             ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gg'],
                             ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gd', 'gj'],
                             ['jd', 'dj', 'jj', 'dd', 'dg', 'jg', 'gd', 'gj', 'gg']],
                        9: [['cg', 'gc'],
                            ['cg', 'gc', 'gg'],
                            ['cg', 'gc', 'gg', 'cc'],
                            ['cg', 'gc', 'gg', 'cc', 'ee'],
                            ['cg', 'gc', 'gg', 'cc', 'ce', 'ge'],
                            ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ee'],
                            ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ec', 'eg'],
                            ['cg', 'gc', 'gg', 'cc', 'ce', 'ge', 'ec', 'eg', 'ee']]};
                    root.KM = 0.5;
                    if (root.HA > 1) {
                        root.AB = handiCoords[boardSize][root.HA-2];
                    }
                }
            }
        
            this.load(blankGame);
        }
        if (!noCb && typeof completeFn == "function") {
            completeFn();
        }
    },
    
    /**
     * Loads game data into a given target. If no target is given, creates
     * a new gameRoot and initializes the game.
    **/
    load: function(data, target) {
        if (!target) {
            // load from scratch
            target = new eidogo.GameNode();
            this.collectionRoot = target;
        }
        target.loadJson(data);
        target._cached = true;
        this.doneLoading();
        this.progressiveLoads--;
        if (!target._parent) {
            // Loading into tree root; use the first game by default or
            // other if specified
            var gameIndex = this.loadPath.length ? parseInt(this.loadPath[0], 10) : 0;
            this.initGame(target._children[gameIndex || 0]);
        }
        
        if (this.loadPath.length) {
            this.goTo(this.loadPath, false);
            if (!this.progressiveLoad) {
                this.loadPath = [0,0];
            }
        } else {
            this.refresh();
        }
        
        // find out which color to play as for problem mode
        if (!target._parent && this.problemMode) {
            this.currentColor = this.problemColor = this.cursor.getNextColor();
        }
    },

    /**
     * Load game data given as raw SGF or JSON from a URL within the same
     * domain.
     * @param {string} url URL to load game data from
     * @param {GameNode} target inserts data into this node if given
     * @param {boolean} useSgfPath if true, prepends sgfPath to url
     * @param {Array} loadPath GameNode path to load
    **/
    remoteLoad: function(url, target, useSgfPath, loadPath, completeFn) {
        useSgfPath = useSgfPath == "undefined" ? true : useSgfPath;
        
        completeFn = (typeof completeFn == "function") ? completeFn : null;
        
        if (useSgfPath) {
            if (!target) {
                this.gameName = url;
            }
            // if we're using sgfPath, assume url does not include .sgf extension
            url = this.sgfPath + url + ".sgf";
        }
        
        if (loadPath) {
            this.loadPath = loadPath;
        }
        
        var success = function(req) {
            var data = req.responseText.replace(/^( |\t|\r|\n)*/, "");
            // infer the kind of file we got
            if (data.charAt(0) == '(') {
                // SGF
                var me = this;
                var sgf = new eidogo.SgfParser(data, function() {
                    // parsing is asychronous
                    me.load(this.root, target);
                    completeFn && completeFn();
                });
            } else if (data.charAt(0) == '{') {
                // JSON
                data = eval("(" + data + ")");
                this.load(data, target);
                completeFn && completeFn();
            } else {
                this.croak(t['invalid data']);
            }
        }
    
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        
        ajax('get', url, null, success, failure, this, 30000);
    },

    /**
     * Sets up a new game for playing. Can be called repeatedly (e.g., for
     * dynamically-loaded games).
    **/
    initGame: function(gameRoot) {
        gameRoot = gameRoot || {};
        this.handleDisplayPrefs();
        var size = gameRoot.SZ || 19;
        // Only three sizes supported for now
        if (size != 9 && size != 13 && size != 19)
            size = 19;
        if (this.shrinkToFit) this.calcShrinkToFit(gameRoot, size);
        if (!this.board) {
            // first time
            this.createBoard(size);
            this.rules = new eidogo.Rules(this.board);
        }
        this.unsavedChanges = false;
        this.resetCursor(true);
        this.totalMoves = 0;
        var moveCursor = new eidogo.GameCursor(this.cursor.node);
        while (moveCursor.next()) { this.totalMoves++; }
        this.totalMoves--;
        this.showGameInfo(gameRoot);
        this.enableNavSlider();
        this.selectTool(this.mode == "view" ? "view" : "play");
        this.hook("initGame");
    },
    
    /**
     * Shows or hides interface elements as configured
    **/
    handleDisplayPrefs: function() {
        (this.prefs.showGameInfo || this.prefs.showPlayerInfo ? show : hide)(this.dom.info);
        (this.prefs.showGameInfo ? show : hide)(this.dom.infoGame);
        (this.prefs.showPlayerInfo ? show : hide)(this.dom.infoPlayers);  
        (this.prefs.showTools ? show : hide)(this.dom.toolsContainer);
        if (!this.showingSearch) {
            (this.prefs.showComments ? show : hide)(this.dom.comments);
        }
        (this.prefs.showOptions ? show : hide)(this.dom.options);
        (this.prefs.showNavTree ? show : hide)(this.dom.navTreeContainer);
    },

    /**
     * Create our board. This can be called multiple times.
    **/
    createBoard: function(size) {
        size = size || 19;
        if (this.board && this.board.renderer && this.board.boardSize == size) return;
        try {
            this.dom.boardContainer.innerHTML = "";
            var rendererProto;
            if (this.renderer == "flash") rendererProto = eidogo.BoardRendererFlash;
            else rendererProto = eidogo.BoardRendererHtml;
            var renderer = new rendererProto(this.dom.boardContainer, size, this, this.cropParams);
            this.board = new eidogo.Board(renderer, size);
        } catch (e) {
            if (e == "No DOM container") {
                this.croak(t['error board']);
                return;
            }
        }
    },
    
    /**
     * Calculates the crop area to use based on the widest distance between
     * stones and markers in the given game. We're conservative with respect
     * to checking markers: only labels for now.
    **/
    calcShrinkToFit: function(gameRoot, size) {
        // leftmost, topmost, rightmost, bottommost
        var l = null, t = null, r = null, b = null;
        var points = {};
        var me = this;
        // find all points occupied by stones or labels
        gameRoot.walk(function(node) {
            var prop, i, coord;
            for (prop in node) {
                if (/^(W|B|AW|AB|LB)$/.test(prop)) {
                    coord = node[prop];
                    if (!(coord instanceof Array)) coord = [coord];
                    if (prop != 'LB') coord = me.expandCompressedPoints(coord);
                    else coord = [coord[0].split(/:/)[0]];
                    for (i = 0; i < coord.length; i++)
                        points[coord[i]] = "";
                }
            }
        });
        // nab the outermost points
        for (var key in points) {
            var pt = this.sgfCoordToPoint(key);
            if (l == null || pt.x < l) l = pt.x;
            if (r == null || pt.x > r) r = pt.x;
            if (t == null || pt.y < t) t = pt.y;
            if (b == null || pt.y > b) b = pt.y;
        }
        this.cropParams.width = r - l + 1;
        this.cropParams.height = b - t + 1;
        this.cropParams.left = l;
        this.cropParams.top = t;
        // add padding
        var pad = this.cropParams.padding;
        for (var lpad = pad; l - lpad < 0; lpad--) {};
        if (lpad) { this.cropParams.width += lpad; this.cropParams.left -= lpad; }
        for (var tpad = pad; t - tpad < 0; tpad--) {};
        if (tpad) { this.cropParams.height += tpad; this.cropParams.top -= tpad; }
        for (var rpad = pad; r + rpad > size; rpad--) {};
        if (rpad) { this.cropParams.width += rpad; }
        for (var bpad = pad; b + bpad > size; bpad--) {};
        if (bpad) { this.cropParams.height += bpad; }
    },

    /**
     * Fetches a move from an external opponent -- e.g., GnuGo. Provides
     * serialized game data as SGF, the color to move as, and the size of
     * the board. Expects the response to be the SGF coordinate of the
     * move to play.
    **/
    fetchOpponentMove: function() {
        this.nowLoading(t['gnugo thinking']);
        var success = function(req) {
            this.doneLoading();
            this.createMove(req.responseText);
        }
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        var root = this.cursor.getGameRoot();
        var params = {
            sgf: root.toSgf(),
            move: this.currentColor,
            size: root.SZ,
            level: this.opponentLevel
        };
        ajax('post', this.opponentUrl, params, success, failure, this, 45000);  
    },
    
    /**
     * Use GNU Go to estimate the score.
     * Thanks to Sorin Gherman for the idea and for getting this started!
    **/
    fetchScoreEstimate: function() {
        this.nowLoading(t['gnugo thinking']);
        var success = function(req) {
            this.doneLoading();
            var result = req.responseText.split("\n");
            var prop, props = result[1].split(" ");
            for (var i = 0; i < props.length; i++) {
                prop = props[i].split(":");
                if (prop[1]) this.addMarker(prop[1], prop[0]);
            }
            this.board.render();
            this.prependComment(result[0]);
        }
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        var root = this.cursor.getGameRoot();
        var params = {
            sgf: root.toSgf(),
            move: 'est',
            size: root.SZ || 19,
            komi: root.KM || 0,
            mn: this.moveNumber + 1
        };
        ajax('post', this.scoreEstUrl, params, success, failure, this, 45000);
    },
    
    /**
     * Respond to a move made in problem-solving mode
    **/
    playProblemResponse: function(noRender) {
        // short delay before playing
        setTimeout(function() {
            this.variation(null, noRender);
            if (this.hooks.playProblemResponse) {
                this.hook("playProblemResponse");
            } else if (!this.cursor.hasNext()) {
                // not sure if it's safe to say "WRONG" -- that would work for
                // goproblems.com SGFs but I don't know about others
                this.prependComment(t['end of variation']);
            }
        }.bind(this), 200);
    },
    
    /**
     * Navigates to a location within the game. Takes progressive loading
     * into account.
    **/
    goTo: function(path, fromStart) {
        fromStart = typeof fromStart != "undefined" ? fromStart : true;
        if (fromStart)
            this.resetCursor(true);
        
        // Move number
        var steps = parseInt(path, 10);
        if (!(path instanceof Array) && !isNaN(steps)) {
            if (fromStart) steps++; // not zero-based
            for (var i = 0; i < steps; i++)
                this.variation(null, true);
            this.refresh();
            return;
        }
        
        // Not a path?
        if (!(path instanceof Array) || !path.length) {
            alert(t['bad path'] + " " + path);
            return;
        }

        var position;
        var vars;
        
        // Path of moves (SGF coords)
        if (isNaN(parseInt(path[0], 10))) {
            if (!this.cursor.node._parent)
                this.variation(0, true); // first game tree is assumed
            while (path.length) {
                if (this.progressiveLoads > 0) {
                    this.loadPath.push(position);
                    return;
                }
                position = path.shift();
                vars = this.getVariations();
                for (var i = 0; i < vars.length; i++) {
                    if (vars[i].move == position) {
                        this.variation(vars[i].varNum, true);
                        break;
                    }
                }
            }
            this.refresh();
            return;
        }
        
        // Path of branch indexes and final move number
        var first = true;
        while (path.length) {
            position = parseInt(path.shift(), 10);
            if (!path.length) {
                for (var i = 0; i < position; i++)
                    this.variation(0, true);
            } else if (path.length) {
                if (!first && this.cursor.node._parent._parent)
                    while (this.cursor.node._children.length == 1)
                        this.variation(0, true);
                this.variation(position, true);
            }
            first = false;
        }
        this.refresh();
    },

    /**
     * Resets the game cursor to the first node
    **/
    resetCursor: function(noRender, toGameRoot) {
        this.board.reset();
        this.resetCurrentColor();
        if (toGameRoot) {
            this.cursor.node = this.cursor.getGameRoot();
        } else {
            this.cursor.node = this.collectionRoot;
        }
        this.refresh(noRender);
    },
    
    /**
     * Resets the current color as appropriate
    **/
    resetCurrentColor: function() {
        this.currentColor = (this.problemMode ? this.problemColor : "B");
        var root = this.cursor.getGameRoot();
        if (root && root.HA > 1)
            this.currentColor = 'W';
    },

    /**
     * Refresh the current node (and wait until progressive loading is
     * finished before doing so)
    **/
    refresh: function(noRender) {
        if (this.progressiveLoads > 0) {
            var me = this;
            setTimeout(function() { me.refresh.call(me); }, 10);
            return;
        }
        this.board.revert(1);
        this.execNode(noRender);
    },

    /**
     * Handles going the next sibling or variation
     * @param {Number} varNum Variation number to follow
     * @param {Boolean} noRender If true, don't render the board
     */
    variation: function(varNum, noRender) {
        if (this.cursor.next(varNum)) {
            this.execNode(noRender);
            this.resetLastLabels();
            // Should we continue after loading finishes or just stop
            // like we do here?
            if (this.progressiveLoads > 0) return false;
            return true;
        }
        return false;
    },

    /**
     * Delegates the work of putting down stones etc to various handler
     * functions. Also resets some settings and makes sure the interface
     * gets updated.
     * @param {Boolean} noRender If true, don't render the board
     * @param {Boolean} ignoreProgressive Ignores progressive loading
     *      considerations.
     */
    execNode: function(noRender, ignoreProgressive) {
        // don't execute a node while it's being loaded
        if (!ignoreProgressive && this.progressiveLoads > 0) {
            var me = this;
            setTimeout(function() { me.execNode.call(me, noRender); }, 10);
            return;
        }
        
        if (!this.cursor.node) return;
    
        if (!noRender) {
            this.dom.comments.innerHTML = "";
            this.board.clearMarkers();
            this.moveNumber = this.cursor.getMoveNumber();
        }
    
        if (this.moveNumber < 1) {
            this.resetCurrentColor();
        }
    
        // execute handlers for the appropriate properties
        var props = this.cursor.node.getProperties();
        for (var propName in props) {
            if (this.propertyHandlers[propName]) {
                (this.propertyHandlers[propName]).apply(
                    this,
                    [this.cursor.node[propName], propName, noRender]
                );
            }
        }
        
        if (noRender) {
            this.board.commit();
        } else {
            // let the opponent move
            if (this.opponentUrl && this.opponentColor == this.currentColor
                && this.moveNumber == this.totalMoves) {
                this.fetchOpponentMove();
            }
            this.findVariations();
            this.updateControls();
            this.board.commit();
            this.board.render();
        }
        
        // progressive loading?        
        if (!ignoreProgressive && this.progressiveUrl)
            this.fetchProgressiveData();
        
        // play a reponse in problem-solving mode, unless we just navigated backwards
        if (this.problemMode && this.currentColor && this.currentColor != this.problemColor && !this.goingBack)
            this.playProblemResponse(noRender);
        
        this.goingBack = false;
    },
    
    fetchProgressiveData: function(completeFn) {
        var loadNode = this.cursor.node || null;
        if (loadNode && loadNode._cached) return;
        if (this.progressiveMode == "pattern") {
            if (loadNode && !loadNode._parent._parent) return; // special case
            this.fetchProgressiveContinuations(completeFn);
        } else {
            var loadId = (loadNode && loadNode._id) || 0;
            this.nowLoading();
            this.progressiveLoads++;
            this.updatedNavTree = false;
            // Show pro game search after second move
            var completeFnWrap = function() {
                var moveNum = this.cursor.getMoveNumber();
                if (moveNum > 1)
                    this.cursor.node.C = "<a id='cont-search' href='#'>" +
                        t['show games'] + "</a>" + (this.cursor.node.C || "");
                this.refresh();
                if (completeFn && typeof completeFn == "function")
                    completeFn();
                addEvent(byId("cont-search"), "click", function(e) {
                    var size = 8;
                    var pattern = this.convertRegionPattern(this.board.getRegion(0, 19 - size, size, size));
                    this.loadSearch("ne", size + "x" + size, this.compressPattern(pattern));
                    stopEvent(e);
                }.bind(this));
            }.bind(this);
            this.remoteLoad(this.progressiveUrl + "?id=" + loadId, loadNode, false, null, completeFnWrap);
        }
    },
    
    fetchProgressiveContinuations: function(completeFn) {
        this.nowLoading();
        this.progressiveLoads++;
        this.updatedNavTree = false;
        var moveNum = this.cursor.getMoveNumber();
        var size = (moveNum > 1 ? 11 : 7);
        var left = 19 - size - 1;
        var pattern = this.board ?
            this.convertRegionPattern(this.board.getRegion(0, left+1, size, size)) :
            ".................................................";
        var params = {
            q: "ne",
            w: size,
            h: size,
            p: pattern,
            a: "continuations",
            t: (new Date()).getTime()};
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        var success = function(req) {
            if (!req.responseText || req.responseText == "NONE") {
                this.progressiveLoads--;
                this.doneLoading();
                this.cursor.node._cached = true;
                this.refresh();
                return;
            }
            var contBranch = {LB: [], _children: []}, contNode;
            contBranch.C = moveNum > 1 ? "<a id='cont-search' href='#'>" +
                t['show games'] + "</a>" : "";
            var cont,
                conts = eval('(' + req.responseText + ')');
            if (conts.length) {
                conts.sort(function(a, b) { return parseInt(b.count, 10) - parseInt(a.count, 10); });
                var highCount = parseInt(conts[0].count, 10);
                var x, y, coord, percent;
                contBranch.C += "<div class='continuations'>";
                for (var i = 0; cont = conts[i]; i++) {
                    percent = parseInt(cont.count / highCount * 150);
                    if (highCount > 20 && parseInt(cont.count, 10) < 10) continue;
                    contNode = {};
                    x = left + parseInt(cont.x, 10) + 1;
                    y = parseInt(cont.y, 10);
                    coord = this.pointToSgfCoord({x:x,y:y});
                    contNode[this.currentColor || "B"] = coord;
                    contBranch.LB.push(coord + ":" + cont.label);
                    if (percent)
                        contBranch.C += "<div class='continuation'>" +
                            "<div class='cont-label'>" + cont.label + "</div>" +
                            "<div class='cont-bar' style='width: " + percent + "px'></div>" +
                            "<div class='cont-count'>" + cont.count + "</div>" + 
                            "</div>";
                    contBranch._children.push(contNode);
                }
                contBranch.C += "</div>";
                if (!this.cursor.node)
                    contBranch = {_children: [contBranch]};
            }
            this.load(contBranch, this.cursor.node);
            addEvent(byId("cont-search"), "click", function(e) {
                this.loadSearch("ne", size + "x" + size, this.compressPattern(pattern));
                stopEvent(e);
            }.bind(this));
            if (completeFn && typeof completeFn == "function")
                completeFn();
        }.bind(this);
        ajax('get', this.progressiveUrl, params, success, failure, this, 45000);
    },

    /**
     * Locates any variations within the current node and makes note of their
     * move and index position
     */
    findVariations: function() {
        this.variations = this.getVariations();
    },
    
    getVariations: function() {
        var vars = [],
            kids = this.cursor.node._children;
        for (var i = 0; i < kids.length; i++) {
            vars.push({move: kids[i].getMove(), varNum: i});
        }
        return vars;
    },

    back: function(e, obj, noRender) {
        if (this.cursor.previous()) {
            this.board.revert(1);
            this.goingBack = true;
            this.refresh(noRender);
            this.resetLastLabels();
        }
    },

    forward: function(e, obj, noRender) {
        this.variation(null, noRender);
    },

    first: function() {
        if (!this.cursor.hasPrevious()) return;
        this.resetCursor(false, true);
    },

    last: function() {
        if (!this.cursor.hasNext()) return;
        while (this.variation(null, true)) {}
        this.refresh();
    },

    pass: function() {
        if (!this.variations) return;
        for (var i = 0; i < this.variations.length; i++) {
            if (!this.variations[i].move || this.variations[i].move == "tt") {
                this.variation(this.variations[i].varNum);
                return;
            }
        }
        this.createMove('tt');
    },

    /**
     * Handle a mouse-down event on a particular point. This function gets
     * called by the board renderer, which handles the actual browser event
     * attachment (or Flash event handling, or whatever) and passes along
     * the appropriate board coordinate.
    **/
    handleBoardMouseDown: function(x, y, e) {
        if (this.domLoading) return;
        if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
        this.mouseDown = true;
        this.mouseDownX = x;
        this.mouseDownY = y;
        // begin region selection
        if (this.mode == "region" && x >= 0 && y >= 0 && !this.regionBegun) {
            this.regionTop = y;
            this.regionLeft = x;
            this.regionBegun = true;
        }
    },

    /**
     * Called by the board renderer upon hover, with appropriate coordinate
    **/
    handleBoardHover: function(x, y, e) {
        if (this.domLoading) return;
        if (this.mouseDown || this.regionBegun) {
            if (!this.boundsCheck(x, y, [0, this.board.boardSize-1])) return;
            if (this.searchUrl && !this.regionBegun && (x != this.mouseDownX || y != this.mouseDownY)) {
                // click and drag: implicit region select
                this.selectTool("region");
                this.regionBegun = true;
                this.regionTop = this.mouseDownY;
                this.regionLeft = this.mouseDownX;
            }
            if (this.regionBegun) {
                this.regionRight = x + (x >= this.regionLeft ? 1 : 0);
                this.regionBottom = y + (y >= this.regionTop ? 1 : 0);
                this.showRegion();
            }
            stopEvent(e);
        }
    },

    /**
     * Called by the board renderer upon mouse up, with appropriate coordinate
    **/
    handleBoardMouseUp: function(x, y, e) {
        if (this.domLoading) return;
        
        this.mouseDown = false;
    
        var coord = this.pointToSgfCoord({x: x, y: y});
        
        // click on a variation?
        if (this.mode == "view" || this.mode == "play") {
            for (var i = 0; i < this.variations.length; i++) {
                var varPt = this.sgfCoordToPoint(this.variations[i].move);
                if (varPt.x == x && varPt.y == y) {
                    this.variation(this.variations[i].varNum);
                    stopEvent(e);
                    return;
                }
            }
        }
        
        if (this.mode == "view") {
            // Jump to any moved played at the clicked coordinate
            var root = this.cursor.getGameRoot(),
                path = [0, root.getPosition()],
                mn = 0,
                node = root._children[0];
            while (node) {
                if (node.getMove() == coord) {
                    path.push(mn);
                    this.goTo(path);
                    break;
                }
                mn++;
                node = node._children[0];
            }
            return;
        }
        
        if (this.mode == "play") {
            // can't click there?
            if (!this.rules.check({x: x, y: y}, this.currentColor)) {
                return;
            }
            // play the move
            if (coord) {
                var nextMoves = this.cursor.getNextMoves();
                if (nextMoves && coord in nextMoves) {
                    // move already exists
                    this.variation(nextMoves[coord]);
                } else {
                    // move doesn't exist yet
                    this.createMove(coord);
                }
            }
        } else if (this.mode == "region" && x >= -1 && y >= -1 && this.regionBegun) {
            if (this.regionTop == y && this.regionLeft == x && !this.regionClickSelect) {
                // allow two-click selection in addition to click-and-drag (for iphone!)
                this.regionClickSelect = true;
                this.regionRight = x + 1;
                this.regionBottom = y + 1;
                this.showRegion();
            } else {
                // end of region selection
                this.regionBegun = false;
                this.regionClickSelect = false;
                this.regionBottom = (y < 0 ? 0 : (y >= this.board.boardSize) ?
                    y : y + (y > this.regionTop ? 1 : 0));
                this.regionRight = (x < 0 ? 0 :  (x >= this.board.boardSize) ?
                    x : x + (x > this.regionLeft ? 1 : 0));
                this.showRegion();
                // show(this.dom.searchAlgo, "inline");
                show(this.dom.searchButton, "inline");
                stopEvent(e);
            }
        } else {
            // place black stone, white stone, labels
            var prop;
            var stone = this.board.getStone({x:x,y:y});
            if (this.mode == "add_b" || this.mode == "add_w") {
                // if a stone was placed previously, we add an empty point (AE);
                // otherwise, we remove the stone property from the current node
                var deleted = this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
                if (stone != this.board.BLACK && this.mode == "add_b") {
                    prop = "AB";
                } else if (stone != this.board.WHITE && this.mode == "add_w") {
                    prop = "AW";
                } else if (this.board.getStone({x:x,y:y}) != this.board.EMPTY && !deleted) {
                    prop = "AE";
                }
            } else {
                switch (this.mode) {
                    case "tr": prop = "TR"; break;
                    case "sq": prop = "SQ"; break;
                    case "cr": prop = "CR"; break;
                    case "x": prop = "MA"; break;
                    case "dim": prop = "DD"; break;
                    case "number":
                        prop = "LB";
                        coord = coord + ":" + this.labelLastNumber;
                        this.labelLastNumber++;
                        break;
                    case "letter":
                        prop = "LB";
                        coord = coord + ":" + this.labelLastLetter;
                        this.labelLastLetter = String.fromCharCode(
                            this.labelLastLetter.charCodeAt(0)+1);
                        break;
                    case "clear":
                        this.cursor.node.deletePropertyValue(
                            ['TR', 'SQ', 'CR', 'MA', 'DD', 'LB'], new RegExp("^" + coord));
                        break;
                }
                if (this.cursor.node.hasPropertyValue(prop, coord)) {
                    this.cursor.node.deletePropertyValue(prop, coord);
                    prop = null;
                }
            }
            if (prop)
                this.cursor.node.pushProperty(prop, coord);
            this.unsavedChanges = true;
            var deleted = this.checkForEmptyNode();
            this.refresh();
            if (deleted) this.prependComment(t['position deleted']);
        }
    },
    
    /**
     * If there are no properties left in a node, ask whether to delete it
    **/
    checkForEmptyNode: function() {
        if (!eidogo.util.numProperties(this.cursor.node.getProperties())) {
            var killNode = window.confirm(t['confirm delete']);
            if (killNode) {
                var id = this.cursor.node._id;
                var index = 0;
                this.back();
                this.cursor.node._children = this.cursor.node._children.filter(function(node, i) {
                    if (node._id == id) {
                        index = i;
                        return false;
                    } else {
                        return true;
                    }
                });
                if (index && this.cursor.node._preferredChild == index)
                    this.cursor.node._preferredChild--;
                return true;
            }
        }
        return false;
    },
    
    /**
     * This prevents region selection from getting stuck in drag mode
    **/
    handleDocMouseUp: function(evt) {
        if (this.domLoading) return true;
        if (this.mode == "region" && this.regionBegun && !this.regionClickSelect) {
            // end of region selection
            this.mouseDown = false;
            this.regionBegun = false;
            // show(this.dom.searchAlgo, "inline");
            show(this.dom.searchButton, "inline");
        }
        return true;
    },
    
    /**
     * Check whether a point falls within a given region (left, top, right,
     * bottom)
    **/
    boundsCheck: function(x, y, region) {
        if (region.length == 2) {
            region[3] = region[2] = region[1];
            region[1] = region[0];
        }
        return (x >= region[0] && y >= region[1] &&
            x <= region[2] && y <= region[3]);
    },

    /**
     * Return a top-left-width-height array based on the left-top-right-bottom
     * selection region
    **/
    getRegionBounds: function() {
        // top, left, width, height
        var l = this.regionLeft;
        var w = this.regionRight - this.regionLeft;
        if (w < 0) {
            l = this.regionRight;
            w = -w + 1;
        }
        var t = this.regionTop;
        var h = this.regionBottom - this.regionTop;
        if (h < 0) {
            t = this.regionBottom;
            h = -h + 1;
        }
        return [t, l, w, h];
    },

    /**
     * Tell the board renderer to show the search region
    **/
    showRegion: function() {
        var bounds = this.getRegionBounds();
        this.board.renderer.showRegion(bounds);
    },
    
    /**
     * Tell the board renderer to hide the search region
    **/
    hideRegion: function() {
        this.board.renderer.hideRegion();
    },
    
    /**
     * Converts a board region array to a string suitable for searching
    **/
    convertRegionPattern: function(region) {
        return region.join("")
            .replace(new RegExp(this.board.EMPTY, "g"), ".")
            .replace(new RegExp(this.board.BLACK, "g"), "x")
            .replace(new RegExp(this.board.WHITE, "g"), "o");
    },
    
    /**
     * Set up a board position to represent a search pattern, then start
     * the search
    **/
    loadSearch: function(q, dim, p, a, o) {
        var blankGame = {_children: [{SZ: this.board.boardSize, _children: []}]};
        this.load(blankGame);
        a = a || "corner";
        this.dom.searchAlgo.value = a;
        p = this.uncompressPattern(p);
        dim = dim.split("x");
        var w = dim[0];
        var h = dim[1];
        var bs = this.board.boardSize;
        var l;
        var t;
        switch (q) {
            case "nw": l = 0; t = 0; break;
            case "ne": l = bs - w; t = 0; break;
            case "se": l = bs - w; t = bs - h; break;
            case "sw": l = 0; t = bs - h; break;
        }
        var c;
        var x;
        var y;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                c = p.charAt(y * w + x);
                if (c == "o") {
                    c = "AW";
                } else if (c == "x") {
                    c = "AB";
                } else {
                    c = "";
                }
                this.cursor.node.pushProperty(c, this.pointToSgfCoord({x:l+x, y:t+y}));
            }
        }
        
        this.refresh();

        this.regionLeft = l;
        this.regionTop = t;
        this.regionRight = l + x;
        this.regionBottom = t + y;
        
        // highlight the selected search region by dimming surroundings
        var b = this.getRegionBounds();
        var r = [b[1], b[0], b[1]+b[2], b[0]+b[3]-1];
        for (y = 0; y < this.board.boardSize; y++) {
            for (x = 0; x < this.board.boardSize; x++) {
                if (!this.boundsCheck(x, y, r)) {
                    this.board.renderer.renderMarker({x:x,y:y}, "dim");
                }
            }
        }
        
        this.searchRegion(o);
    },
    
    /**
     * Call out to our external handler to perform a pattern search. Also
     * prevent meaningless or overly-simple searches.
    **/
    searchRegion: function(offset) {
        if (this.searching) return;
        this.searching = true;
        
        if (!this.searchUrl) {
            show(this.dom.comments);
            hide(this.dom.searchContainer);
            this.prependComment(t['no search url']);
            return;
        }
        
        var offset = parseInt(offset, 10) || 0;
        var algo = this.dom.searchAlgo.value;

        var bounds = this.getRegionBounds();
        var region = this.board.getRegion(bounds[0], bounds[1], bounds[2], bounds[3]);
        var pattern = this.convertRegionPattern(region);
        
        // check for empty or meaningless searches
        var empty = /^\.*$/.test(pattern);
        var oneW = /^\.*o\.*$/.test(pattern);
        var oneB = /^\.*x\.*$/.test(pattern);
        if (empty || oneW || oneB) {
            this.searching = false;
            show(this.dom.comments);
            hide(this.dom.searchContainer);
            this.prependComment(t['two stones']);
            return;
        }
        
        // make sure corner search regions touch two adjacent edges of the board
        var edges = [];
        if (bounds[0] == 0) edges.push('n');
        if (bounds[1] == 0) edges.push('w')
        if (bounds[0] + bounds[3] == this.board.boardSize) edges.push('s');
        if (bounds[1] + bounds[2] == this.board.boardSize) edges.push('e');
        if (algo == "corner" && !(edges.length == 2 &&
             ((edges.contains('n') && edges.contains('e')) ||
              (edges.contains('n') && edges.contains('w')) ||
              (edges.contains('s') && edges.contains('e')) ||
              (edges.contains('s') && edges.contains('w'))))) {
            this.searching = false;
            show(this.dom.comments);
            hide(this.dom.searchContainer);
            this.prependComment(t['two edges']);
            return;
        }
        
        var quadrant = (edges.contains('n') ? "n" : "s");
        quadrant += (edges.contains('w') ? "w" : "e");
    
        this.showComments("");
        this.gameName = "search";

        var success = function(req) {
            this.searching = false;
            this.doneLoading();
            hide(this.dom.comments);
            show(this.dom.searchContainer);
            this.showingSearch = true;
            if (req.responseText == "ERROR") {
                this.croak(t['error retrieving']);
                return;
            } else if (req.responseText == "NONE") {
                hide(this.dom.searchResultsContainer);
                this.dom.searchCount.innerHTML = "No";
                return;
            }
            var ret = eval("(" + req.responseText + ")");
            var results = ret.results,
                result,
                html = "",
                odd,
                total = parseInt(ret.total, 10),
                offsetStart = parseInt(ret.offset, 10) + 1,
                offsetEnd = parseInt(ret.offset, 10) + 50;
            for(var i = 0; result = results[i]; i++) {
                odd = odd ? false : true;
                html += "<a class='search-result" + (odd ? " odd" : "") + "' href='#'>\
                    <span class='id'>" + result.id + "</span>\
                    <span class='mv'>" + result.mv + "</span>\
                    <span class='pw'>" + result.pw + " " + result.wr + "</span>\
                    <span class='pb'>" + result.pb + " " + result.br + "</span>\
                    <span class='re'>" + result.re + "</span>\
                    <span class='dt'>" + result.dt + "</span>\
                    <div class='clear'>&nbsp;</div>\
                    </a>";
            }
            if (total > offsetEnd)
                html += "<div class='search-more'><a href='#' id='search-more'>Show more...</a></div>";
            show(this.dom.searchResultsContainer);
            this.dom.searchResults.innerHTML = html + "<br>";
            this.dom.searchCount.innerHTML = total;
            this.dom.searchOffsetStart.innerHTML = offsetStart;
            this.dom.searchOffsetEnd.innerHTML = (total < offsetEnd ? total : offsetEnd);
            this.dom.searchContainer.scrollTop = 0;
            if (total > offsetEnd) {
                setTimeout(function() {
                    addEvent(byId("search-more"), "click", function(e) {
                        this.loadSearch(quadrant, bounds[2] + "x" + bounds[3],
                            pattern, "corner", ret.offset + 51);
                        stopEvent(e);
                    }.bind(this));
                }.bind(this), 0);
            }
        }
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        var params = {
            q: quadrant,
            w: bounds[2],
            h: bounds[3],
            p: pattern,
            a: algo,
            o: offset,
            t: (new Date()).getTime()
        };
        
        this.progressiveLoad = false;
        this.progressiveUrl = null;
        this.prefs.markNext = false;
        this.prefs.showPlayerInfo = true;
        
        this.hook("searchRegion", params);
        
        this.nowLoading();
        ajax('get', this.searchUrl, params, success, failure, this, 45000);     
    },
    
    /**
     * Load a particular search result. This gets called via the HTML
     * output by the external search handler.
    **/
    loadSearchResult: function(e) {
        this.nowLoading();
        var target = e.target || e.srcElement;
        if (target.nodeName == "SPAN") {
            target = target.parentNode;
        }
        if (target.nodeName == "A") {
            var span;
            var id;
            var mv;
            for (var i = 0; span = target.childNodes[i]; i++) {
                if (span.className == "id") {
                    id = span.innerHTML;
                }
                if (span.className == "mv") {
                    mv = parseInt(span.innerHTML, 10);
                }
            }
        }
        this.remoteLoad(id, null, true, [0, mv], function() {
            this.doneLoading();
            this.setPermalink();
            this.prefs.showOptions = true;
            this.handleDisplayPrefs();
        }.bind(this));
        stopEvent(e);
    },
    
    /**
     * Close the search pane
    **/
    closeSearch: function() {
        this.showingSearch = false;
        hide(this.dom.searchContainer);
        show(this.dom.comments);
    },

    /**
     * Takes a pattern string like ...O...XX and converts it to .3O.3X2
     */
    compressPattern: function(pattern) {
        var c = null;
        var pc = "";
        var n = 1;
        var ret = "";
        for (var i = 0; i < pattern.length; i++) {
            c = pattern.charAt(i);
            if (c == pc) {
               n++;
            } else {
                ret = ret + pc + (n > 1 ? n : "");
                n = 1;
                pc = c;
            }
        }
        ret = ret + pc + (n > 1 ? n : "");
        return ret;
    },

    uncompressPattern: function(pattern) {
        var c = null;
        var s = null;
        var n = "";
        var ret = "";
        for (var i = 0; i < pattern.length; i++) {
            c = pattern.charAt(i);
            if (c == "." || c == "x" || c == "o") {
                if (s != null) {
                    n = parseInt(n, 10);
                    n = isNaN(n) ? 1 : n;
                    for (var j = 0; j < n; j++) {
                        ret += s;
                    }
                    n = "";
                }
                s = c;
            } else {
                n += c;
            }
        }
        n = parseInt(n, 10);
        n = isNaN(n) ? 1 : n;
        for (var j = 0; j < n; j++) {
            ret += s;
        }
        return ret;
    },

    /**
     * Create an as-yet unplayed move and go to it.
     */
    createMove: function(coord) {
        var props = {};
        props[this.currentColor] = coord;
        var varNode = new eidogo.GameNode(null, props);
        varNode._cached = true;
        this.totalMoves++;
        this.cursor.node.appendChild(varNode);
        this.unsavedChanges = true;
        this.variation(this.cursor.node._children.length-1);
    },

    /**
     * Keyboard shortcut handling
    **/
    handleKeypress: function(e) {
        if (this.editingText) return true;
        var charCode = e.keyCode || e.charCode;
        if (!charCode || e.ctrlKey || e.altKey || e.metaKey) return true;
        var charKey = String.fromCharCode(charCode).toLowerCase();
    
        // Variations can be selected by pressing the appropriate alphanumberic
        // character that is either 1) its variation number; or 2) its
        // marker label.
        for (var i = 0; i < this.variations.length; i++) {
            var varPt = this.sgfCoordToPoint(this.variations[i].move);
            var varLabel = '' + (i + 1);
            if (varPt.x != null
                && this.board.getMarker(varPt) != this.board.EMPTY
                && typeof this.board.getMarker(varPt) == "string") {
                varLabel = this.board.getMarker(varPt).toLowerCase();
            }
            varLabel = varLabel.replace(/^var:/, "");
            if (charKey == varLabel.charAt(0)) {
                this.variation(this.variations[i].varNum);
                stopEvent(e);
                return;
            }
        }
    
        // tool shortcuts
        if (charCode == 112 || charCode == 27) { 
            // f1 or esc
            this.selectTool("play");
        }
    
        var stop = true;
        switch (charCode) {
            case 39: // right
                if (e.shiftKey) {
                    var movesLeft = this.totalMoves - this.moveNumber;
                    var steps = (movesLeft > 9 ? 9 : movesLeft-1);
                    for (var i = 0; i < steps; i++) {
                        this.forward(null, null, true);
                    }
                }
                this.forward();
                break;
            case 37: // left
                if (e.shiftKey) {
                    var steps = (this.moveNumber > 9 ? 9 : this.moveNumber-1);
                    for (var i = 0; i < steps; i++) {
                        this.back(null, null, true);
                    }
                }
                this.back();
                break;
            case 40: // down
                this.last();
                break;
            case 38: // up
                this.first();
                break;
            case 192: // backtick/tilde
                this.pass();
                break;
            default:
                stop = false;
                break;
        }
        if (stop) {
            stopEvent(e);
        }
    },

    /**
     * Parse and display the game's info
    **/
    showGameInfo: function(gameInfo) {
        this.hook("showGameInfo", gameInfo);
        if (!gameInfo) return;
        this.dom.infoGame.innerHTML = "";
        this.dom.whiteName.innerHTML = "";
        this.dom.blackName.innerHTML = "";
        var dl = document.createElement('dl'), val;
        for (var propName in this.infoLabels) {
            if (gameInfo[propName] instanceof Array) {
                gameInfo[propName] = gameInfo[propName][0];
            }
            if (gameInfo[propName]) {
                if (propName == "PW") {
                    this.dom.whiteName.innerHTML = gameInfo[propName] +
                        (gameInfo['WR'] ? ", " + gameInfo['WR'] : "");
                    continue;
                } else if (propName == "PB") {
                    this.dom.blackName.innerHTML = gameInfo[propName] +
                        (gameInfo['BR'] ? ", " + gameInfo['BR'] : "");
                    continue;
                }
                if (propName == "WR" || propName == "BR") {
                    continue;
                }
                val = gameInfo[propName];
                if (propName == "DT") {
                    var dateParts = gameInfo[propName].split(/[\.-]/);
                    if (dateParts.length == 3) {
                        val = dateParts[2].replace(/^0+/, "") + " "
                            + this.months[dateParts[1]-1] + " " + dateParts[0];
                    }
                }
                var dt = document.createElement('dt');
                dt.innerHTML = this.infoLabels[propName] + ':';
                var dd = document.createElement('dd');
                dd.innerHTML = val;
                dl.appendChild(dt);
                dl.appendChild(dd);
            }
        }
        this.dom.infoGame.appendChild(dl);
    },

    /**
     * Handle tool switching
    **/
    selectTool: function(tool) {
        var cursor;
        hide(this.dom.scoreEst);
        if (tool == "region") {
            cursor = "crosshair";
        } else if (tool == "comment") {
            this.startEditComment();
        } else if (tool == "gameinfo") {
            this.startEditGameInfo();
        } else {
            cursor = "default";
            this.regionBegun = false;
            this.hideRegion();
            hide(this.dom.searchButton);
            hide(this.dom.searchAlgo);
            if (this.searchUrl) show(this.dom.scoreEst, "inline");
        }
        this.board.renderer.setCursor(cursor);
        this.mode = tool;
        this.dom.toolsSelect.value = tool;
    },
    
    startEditComment: function() {
        this.closeSearch();
        var div = this.dom.commentsEdit;
        div.style.position = "absolute";
        div.style.top = this.dom.comments.offsetTop + "px";
        div.style.left = this.dom.comments.offsetLeft + "px";
        show(this.dom.shade);
        this.dom.comments.innerHTML = "";
        show(div);
        show(this.dom.commentsEditDone);
        this.dom.commentsEditTa.value = this.cursor.node.C || "";
        this.dom.commentsEditTa.focus();
        this.editingText = true;  
    },
    
    finishEditComment: function() {
        this.editingText = false;
        var oldC = this.cursor.node.C;
        var newC = this.dom.commentsEditTa.value;
        if (oldC != newC) {
            this.unsavedChanges = true;
            this.cursor.node.C = newC;
        }
        if (!this.cursor.node.C)
            delete this.cursor.node.C;
        hide(this.dom.shade);
        hide(this.dom.commentsEdit);
        show(this.dom.comments);
        this.selectTool("play");
        var deleted = this.checkForEmptyNode();
        this.refresh();
        if (deleted) this.prependComment(t['position deleted']);
    },
    
    startEditGameInfo: function() {
        this.closeSearch();
        var div = this.dom.gameInfoEdit;
        div.style.position = "absolute";
        div.style.top = this.dom.comments.offsetTop + "px";
        div.style.left = this.dom.comments.offsetLeft + "px";
        show(this.dom.shade);
        this.dom.comments.innerHTML = "";
        show(div);
        show(this.dom.gameInfoEditDone);
        var root = this.cursor.getGameRoot();
        var html = ['<table>'];
        for (var prop in this.infoLabels) {
            html.push('<tr><td>' + this.infoLabels[prop] + ':' + '</td><td>' +
                '<input type="text" id="game-info-edit-field-' + prop + '"' +
                    ' value="' + (root[prop] || "") + '">' +
                '</td></tr>');
        }
        html.push('</table>');
        this.dom.gameInfoEditForm.innerHTML = html.join('');
        setTimeout(function() {
            byId("game-info-edit-field-GN").focus();
        }, 0);
        this.editingText = true;
    },
    
    finishEditGameInfo: function() {
        this.editingText = false;
        hide(this.dom.shade);
        hide(this.dom.gameInfoEdit);
        show(this.dom.comments);
        var root = this.cursor.getGameRoot();
        var newval = null;
        for (var prop in this.infoLabels) {
            newval = byId('game-info-edit-field-' + prop).value;
            if ((root[prop] || "") != newval) {
                root[prop] = newval;
                this.unsavedChanges = true;
            }
        }
        this.showGameInfo(root);
        this.dom.gameInfoEditForm.innerHTML = "";
        this.selectTool("play");
        this.refresh();
    },

    /**
     * Update all our UI elements to reflect the current game state
    **/
    updateControls: function() {
        // move number
        this.dom.moveNumber.innerHTML = (this.moveNumber ?
            (t['move'] + " " + this.moveNumber) :
            (this.permalinkable ? "permalink" : ""));
    
        // captures
        this.dom.whiteCaptures.innerHTML = t['captures'] +
            ": <span>" + this.board.captures.W + "</span>";
        this.dom.blackCaptures.innerHTML = t['captures'] +
            ": <span>" + this.board.captures.B + "</span>";
    
        // time
        this.dom.whiteTime.innerHTML = t['time left'] + ": <span>" +
            (this.timeW ? this.timeW : "--") + "</span>";
        this.dom.blackTime.innerHTML = t['time left'] + ": <span>" +
            (this.timeB ? this.timeB : "--") + "</span>";

        removeClass(this.dom.controlPass, "pass-on");
        
        // variations?
        this.dom.variations.innerHTML = "";
        for (var i = 0; i < this.variations.length; i++) {
            var varLabel = i + 1;
            if (!this.variations[i].move || this.variations[i].move == "tt") {
                // 'pass' variation
                addClass(this.dom.controlPass, "pass-on");
            } else if (this.prefs.markNext || this.variations.length > 1) {
                // show clickable variation on the board
                var varPt = this.sgfCoordToPoint(this.variations[i].move);
                if (this.board.getMarker(varPt) != this.board.EMPTY) {
                    varLabel = this.board.getMarker(varPt);
                }
                if (this.prefs.markVariations) {
                    this.board.addMarker(varPt, "var:" + varLabel);
                }
            }
            // show variation under controls
            var varNav = document.createElement("div");
            varNav.className = "variation-nav";
            varNav.innerHTML = varLabel;
            addEvent(
                varNav,
                "click",
                function(e, arg) { arg.me.variation(arg.varNum); },
                {me: this, varNum: this.variations[i].varNum}
            );
            this.dom.variations.appendChild(varNav);
        }
        if (this.variations.length < 2) {
            this.dom.variations.innerHTML = "<div class='variation-nav none'>" +
                t['no variations'] + "</div>";
        }
    
        if (this.cursor.hasNext()) {
            addClass(this.dom.controlForward, "forward-on");
            addClass(this.dom.controlLast, "last-on");
        } else {
            removeClass(this.dom.controlForward, "forward-on");
            removeClass(this.dom.controlLast, "last-on");
        }
        if (this.cursor.hasPrevious()) {
            addClass(this.dom.controlBack, "back-on");
            addClass(this.dom.controlFirst, "first-on");
        } else {
            removeClass(this.dom.controlBack, "back-on");
            removeClass(this.dom.controlFirst, "first-on");
            var info = "";
            if (!this.prefs.showPlayerInfo)
                info += this.getGameDescription(true);
            if (!this.prefs.showGameInfo)
                info += this.dom.infoGame.innerHTML;
            if (info.length && this.theme != "problem")
                this.prependComment(info, "comment-info");
        }
        
        if (!this.progressiveLoad)
            this.updateNavSlider();
        if (this.prefs.showNavTree)
            this.updateNavTree();
    },

    setColor: function(color) {
        this.prependComment(color == "B" ? t['black to play'] :
            t['white to play']);
        this.currentColor = color;
    },

    setMoveNumber: function(num) {
        this.moveNumber = num;
    },

    /**
     * Play a move on the board and apply rules to it. This is different from
     * merely adding a stone.
    **/
    playMove: function(coord, color, noRender) {
        color = color || this.currentColor;
        this.currentColor = (color == "B" ? "W" : "B");
        color = color == "W" ? this.board.WHITE : this.board.BLACK;
        var pt = this.sgfCoordToPoint(coord);
        if ((!coord || coord == "tt" || coord == "") && !noRender) {
            this.prependComment((color == this.board.WHITE ?
                t['white'] : t['black']) + " " + t['passed'], "comment-pass");
        } else if (coord == "resign") {
            this.prependComment((color == this.board.WHITE ?
                t['white'] : t['black']) + " " + t['resigned'], "comment-resign");
        } else if (coord && coord != "tt") {
            this.board.addStone(pt, color);
            this.rules.apply(pt, color);
            if (this.prefs.markCurrent && !noRender) {
                this.addMarker(coord, "current");
            }
        }
    },

    addStone: function(coord, color) {
        if (!(coord instanceof Array)) {
            coord = [coord];
        }
        coord = this.expandCompressedPoints(coord);
        for (var i = 0; i < coord.length; i++) {
            this.board.addStone(
                this.sgfCoordToPoint(coord[i]),
                color == "AW" ? this.board.WHITE :
                color == "AB" ? this.board.BLACK : this.board.EMPTY
            );
        }
    },

    addMarker: function(coord, type) {
        if (!(coord instanceof Array)) {
            coord = [coord];
        }
        coord = this.expandCompressedPoints(coord);
        var label;
        for (var i = 0; i < coord.length; i++) {
            switch (type) {
                case "TR": label = "triangle"; break;
                case "SQ": label = "square"; break;
                case "CR": label = "circle"; break;
                case "MA": label = "ex"; break;
                case "TW": label = "territory-white"; break;
                case "TB": label = "territory-black"; break;
                case "DD": label = "dim"; break;
                case "LB": label = (coord[i].split(":"))[1]; break;
                default: label = type; break;
            }
            this.board.addMarker(
                this.sgfCoordToPoint((coord[i].split(":"))[0]),
                label
            );
        }
    },

    showTime: function(value, type) {
        var tp = (type == "BL" || type == "OB" ? "timeB" : "timeW");
        if (type == "BL" || type == "WL") {
            var mins = Math.floor(value / 60);
            var secs = (value % 60).toFixed(0);
            secs = (secs < 10 ? "0" : "") + secs;
            this[tp] = mins + ":" + secs;
        } else {
            this[tp] += " (" + value + ")";
        }
    },

    /**
     * Good move, bad move, etc
    **/
    showAnnotation: function(value, type) {
        var msg;
        switch (type) {
            case 'N':  msg = value; break;
            case 'GB': msg = (value > 1 ? t['vgb'] : t['gb']); break;
            case 'GW': msg = (value > 1 ? t['vgw'] : t['gw']); break;
            case 'DM': msg = (value > 1 ? t['dmj'] : t['dm']); break;
            case 'UC': msg = t['uc']; break;
            case 'TE': msg = t['te']; break;
            case 'BM': msg = (value > 1 ? t['vbm'] : t['bm']); break;
            case 'DO': msg = t['do']; break;
            case 'IT': msg = t['it']; break;
            case 'HO': msg = t['ho']; break;
        }
        this.prependComment(msg);
    },

    showComments: function(comments, junk, noRender) {
        if (!comments || noRender) return;
        this.dom.comments.innerHTML += comments.replace(/^(\n|\r|\t|\s)+/, "").replace(/\n/g, "<br />");
    },

    /**
     * For special notices
    **/
    prependComment: function(content, cls) {
        cls = cls || "comment-status";
        this.dom.comments.innerHTML = "<div class='" + cls + "'>" +
            content + "</div>" + this.dom.comments.innerHTML;
    },
    
    /**
     * Redirect to a download handler or attempt to display data inline
    **/
    downloadSgf: function(evt) {
        stopEvent(evt);
        if (this.downloadUrl) {
            if (this.unsavedChanges) {
                 alert(t['unsaved changes']);
                return;
            }
            location.href = this.downloadUrl + this.gameName;
        } else if (isMoz) {
            location.href = "data:text/plain," +
                encodeURIComponent(this.cursor.getGameRoot().toSgf());
        }
    },
    
    /**
     * Send SGF data to a file-saving handler
    **/
    save: function(evt) {
        stopEvent(evt);
        var success = function(req) {
            this.hook("saved", [req.responseText]);
        }
        var failure = function(req) {
            this.croak(t['error retrieving']);
        }
        var sgf = this.cursor.getGameRoot().toSgf();
        ajax('POST', this.saveUrl, {sgf: sgf}, success, failure, this, 30000);
    },

    /**
     * Create the Player layout and insert it into the page. Also store
     * references to all our DOM elements for later use, and add
     * appropriate event handlers.
    **/
    constructDom: function() {
    
        this.dom.player = document.createElement('div');
        this.dom.player.className = "eidogo-player" +
            (this.theme ? " theme-" + this.theme : "");
        this.dom.player.id = "player-" + this.uniq;
        this.dom.container.innerHTML = "";
        eidogo.util.show(this.dom.container);
        this.dom.container.appendChild(this.dom.player);
    
        var domHtml = "\
            <div id='board-container' class='board-container'></div>\
            <div id='controls-container' class='controls-container'>\
                <ul id='controls' class='controls'>\
                    <li id='control-first' class='control first'>First</li>\
                    <li id='control-back' class='control back'>Back</li>\
                    <li id='control-forward' class='control forward'>Forward</li>\
                    <li id='control-last' class='control last'>Last</li>\
                    <li id='control-pass' class='control pass'>Pass</li>\
                </ul>\
                <div id='move-number' class='move-number" + (this.permalinkable ? " permalink" : "") + "'></div>\
                <div id='nav-slider' class='nav-slider'>\
                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>\
                </div>\
                <div id='variations-container' class='variations-container'>\
                    <div id='variations-label' class='variations-label'>" + t['variations'] + ":</div>\
                    <div id='variations' class='variations'></div>\
                </div>\
                <div class='controls-stop'></div>\
            </div>\
            <div id='tools-container' class='tools-container'" + (this.prefs.showTools ? "" : " style='display: none'") + ">\
                <div id='tools-label' class='tools-label'>" + t['tool'] + ":</div>\
                <select id='tools-select' class='tools-select'>\
                    <option value='play'>&#9658; " + t['play'] + "</option>\
                    <option value='view'>&#8594; " + t['view'] + "</option>\
                    <option value='add_b'>&#9679; " + t['add_b'] + "</option>\
                    <option value='add_w'>&#9675; " + t['add_w'] + "</option>\
                    " + (this.searchUrl ? ("<option value='region'>&#9618; " + t['region'] + "</option>") : "") +"\
                    " + (this.saveUrl && !this.progressiveLoad ? ("<option value='comment'>&para; " + t['edit comment'] + "</option>") : "") + "\
                    " + (this.saveUrl ? ("<option value='gameinfo'>&#8962; " + t['edit game info'] + "</option>") : "") + "\
                    <option value='tr'>&#9650; " + t['triangle'] + "</option>\
                    <option value='sq'>&#9632; " + t['square'] + "</option>\
                    <option value='cr'>&#9679; " + t['circle'] + "</option>\
                    <option value='x'>&times; " + t['x'] + "</option>\
                    <option value='letter'>A " + t['letter'] + "</option>\
                    <option value='number'>5 " + t['number'] + "</option>\
                    <option value='dim'>&#9619; " + t['dim'] + "</option>\
                    <option value='clear'>&#9617; " + t['clear'] + "</option>\
                </select>\
                <input type='button' id='score-est' class='score-est-button' value='" + t['score est'] + "' />\
                <select id='search-algo' class='search-algo'>\
                    <option value='corner'>" + t['search corner'] + "</option>\
                    <option value='center'>" + t['search center'] + "</option>\
                </select>\
                <input type='button' id='search-button' class='search-button' value='" + t['search'] + "' />\
            </div>\
            <div id='comments' class='comments'></div>\
            <div id='comments-edit' class='comments-edit'>\
                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>\
                <div id='comments-edit-done' class='comments-edit-done'>" + t['done'] + "</div>\
            </div>\
            <div id='game-info-edit' class='game-info-edit'>\
                <div id='game-info-edit-form' class='game-info-edit-form'></div>\
                <div id='game-info-edit-done' class='game-info-edit-done'>" + t['done'] + "</div>\
            </div>\
            <div id='search-container' class='search-container'>\
                <div id='search-close' class='search-close'>" + t['close search'] + "</div>\
                <p class='search-count'><span id='search-count'></span>&nbsp;" + t['matches found'] + "\
                    Showing <span id='search-offset-start'></span>-<span id='search-offset-end'></span></p>\
                <div id='search-results-container' class='search-results-container'>\
                    <div class='search-result'>\
                        <span class='pw'><b>" + t['white'] + "</b></span>\
                        <span class='pb'><b>" + t['black'] + "</b></span>\
                        <span class='re'><b>" + t['result'] + "</b></span>\
                        <span class='dt'><b>" + t['date'] + "</b></span>\
                        <div class='clear'></div>\
                    </div>\
                    <div id='search-results' class='search-results'></div>\
                </div>\
            </div>\
            <div id='info' class='info'>\
                <div id='info-players' class='players'>\
                    <div id='white' class='player white'>\
                        <div id='white-name' class='name'></div>\
                        <div id='white-captures' class='captures'></div>\
                        <div id='white-time' class='time'></div>\
                    </div>\
                    <div id='black' class='player black'>\
                        <div id='black-name' class='name'></div>\
                        <div id='black-captures' class='captures'></div>\
                        <div id='black-time' class='time'></div>\
                    </div>\
                </div>\
                <div id='info-game' class='game'></div>\
            </div>\
            <div id='nav-tree-container' class='nav-tree-container'>\
                <div id='nav-tree' class='nav-tree'></div>\
            </div>\
            <div id='options' class='options'>\
                " + (this.saveUrl ? "<a id='option-save' class='option-save' href='#'>" + t['save to server'] + "</a>" : "") + "\
                " + (this.downloadUrl || isMoz ? "<a id='option-download' class='option-download' href='#'>" + t['download sgf'] + "</a>" : "") + "\
                <div class='options-stop'></div>\
            </div>\
            <div id='preferences' class='preferences'>\
                <div><input type='checkbox'> Show variations on board</div>\
                <div><input type='checkbox'> Mark current move</div>\
            </div>\
            <div id='footer' class='footer'></div>\
            <div id='shade' class='shade'></div>\
        ";
        
        // unique ids for each element so we can have multiple Player
        // instances on a page
        domHtml = domHtml.replace(/ id='([^']+)'/g, " id='$1-" + this.uniq + "'");
        
        this.dom.player.innerHTML = domHtml;
        
        // grab all the dom elements for later use
        var re = / id='([^']+)-\d+'/g;
        var match;
        var id;
        var jsName;
        while (match = re.exec(domHtml)) {
            id = match[0].replace(/'/g, "").replace(/ id=/, "");
            jsName = "";
            // camel-case the id
            match[1].split("-").forEach(function(word, i) {
                word = i ? word.charAt(0).toUpperCase() + word.substring(1) : word;
                jsName += word
            });
            this.dom[jsName] = byId(id);
        }
        
        // dom element      handler
        [['moveNumber',       'setPermalink'],
         ['controlFirst',     'first'],
         ['controlBack',      'back'],
         ['controlForward',   'forward'],
         ['controlLast',      'last'],
         ['controlPass',      'pass'],
         ['scoreEst',         'fetchScoreEstimate'],
         ['searchButton',     'searchRegion'],
         ['searchResults',    'loadSearchResult'],
         ['searchClose',      'closeSearch'],
         ['optionDownload',   'downloadSgf'],
         ['optionSave',       'save'],
         ['commentsEditDone', 'finishEditComment'],
         ['gameInfoEditDone', 'finishEditGameInfo'],
         ['navTree',          'navTreeClick']
        ].forEach(function(eh) {
            if (this.dom[eh[0]]) onClick(this.dom[eh[0]], this[eh[1]], this);
        }.bind(this));
        
        addEvent(this.dom.toolsSelect, 'change', function(e) {
            this.selectTool.apply(this, [(e.target || e.srcElement).value]);
        }, this, true);
    },
    
    enableNavSlider: function() {
        // don't use slider for progressively-loaded games
        if (this.progressiveLoad) {
            hide(this.dom.navSliderThumb); 
            return;
        }
    
        this.dom.navSlider.style.cursor = "pointer";

        var sliding = false;
        var timeout = null;
        
        addEvent(this.dom.navSlider, "mousedown", function(e) {
            sliding = true;
            stopEvent(e);
        }, this, true);
        
        addEvent(document, "mousemove", function(e) {
            if (!sliding) return;
            var xy = getElClickXY(e, this.dom.navSlider);
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                this.updateNavSlider(xy[0]);
            }.bind(this), 10);
            stopEvent(e);
        }, this, true);
        
        addEvent(document, "mouseup", function(e) {
            if (!sliding) return true;
            sliding = false;
            var xy = getElClickXY(e, this.dom.navSlider);
            this.updateNavSlider(xy[0]);
            return true;
        }, this, true);
    },
    
    updateNavSlider: function(offset) {
        var width = this.dom.navSlider.offsetWidth - this.dom.navSliderThumb.offsetHeight;
        var steps = this.totalMoves;
        var offsetGiven = !!offset;
        offset = offset || (this.moveNumber / steps * width);
        offset = offset > width ? width : offset;
        offset = offset < 0 ? 0 : offset;
        var moveOffset = parseInt(offset / width * steps, 10);
        // only update the board when we're given an offset; otherwise,
        // assume we're just reflecting the board position
        if (offsetGiven) {
            this.nowLoading();
            var delta = moveOffset - this.cursor.getMoveNumber();
            for (var i = 0; i < Math.abs(delta); i++) {
                if (delta > 0) {
                    this.variation(null, true);
                } else if (delta < 0) {
                    this.cursor.previous();
                }
            }
            if (delta < 0) {
                this.board.revert(Math.abs(delta));
            }
            this.doneLoading();
            this.refresh();
        }
        
        // snap to move interval
        offset = parseInt(moveOffset / steps * width, 10) || 0;
        this.dom.navSliderThumb.style.left = offset + "px";
    },
    
    updateNavTree: function() {
        if (!this.prefs.showNavTree)
            return;
        if (!this.unsavedChanges && this.updatedNavTree) {
            this.showNavTreeCurrent();
            return;
        }
        this.updatedNavTree = true;
        var html = "",
            curId = this.cursor.node._id,
            nodeWidth = this.board.renderer.pointWidth + 5,
            path = [this.cursor.getGameRoot().getPosition()],
            player = this;
        var traverse = function(node, startNum, varNum) {
            var indent = 0,
                offset = 0,
                moveNum = startNum,
                pathStr;
            html += "<li" + (varNum == 0 ? " class='first'" : "") + "><div class='mainline'>";
            do {
                pathStr = path.join('-') + "-" + offset;
                html += "<a href='#' id='navtree-node-" + pathStr  + "' class='" +
                    (typeof node.W != "undefined" ? 'w' : (typeof node.B != "undefined" ? 'b' : 'x')) +
                    "'>" + (moveNum) + "</a>";
                
                moveNum++;
                if (node._children.length != 1) break;
                if (node._parent._parent == null)
                    path.push(node.getPosition());
                else
                    offset++;
                node = node._children[0];
                indent++;
            } while (node);
            html += "</div>";
            if (node._children.length > 1)
                html += "<ul style='margin-left: " + (indent * nodeWidth) + "px'>";
            for (var i = 0; i < node._children.length; i++) {
                if (node._children.length > 1)
                    path.push(i);
                traverse(node._children[i], moveNum, i);
                if (node._children.length > 1)
                    path.pop();
            }
            if (node._children.length > 1)
                html += "</ul>";
            html += "</li>";
        }
        traverse(this.cursor.getGameRoot(), 0, 0);
        this.dom.navTree.style.width = ((this.totalMoves+2) * nodeWidth) + "px";
        this.dom.navTree.innerHTML = "<ul class='root'>" + html + "</ul>";
        setTimeout(function() {
            this.showNavTreeCurrent();
        }.bind(this), 0);
    },
    
    showNavTreeCurrent: function() {
        var current = byId("navtree-node-" + this.cursor.getPath().join("-"));
        if (!current) return;
        if (this.prevNavTreeCurrent)
            this.prevNavTreeCurrent.className = this.prevNavTreeCurrentClass;
        this.prevNavTreeCurrent = current;
        this.prevNavTreeCurrentClass = current.className;
        current.className = "current";
    },
    
    navTreeClick: function(e) {
        var target = e.target || e.srcElement;
        if (target.nodeName.toLowerCase() == "li" && target.className == "first")
            target = target.parentNode.previousSibling.lastChild;
        if (!target || !target.id) return;
        var path = target.id.replace(/^navtree-node-/, "").split("-");
        this.goTo(path, true);
        stopEvent(e);
    },

    resetLastLabels: function() {
        this.labelLastNumber = 1;
        this.labelLastLetter = "A";
    },
    
    getGameDescription: function(excludeGameName) {
        var root = this.cursor.getGameRoot();
        if (!root) return;
        var desc = (excludeGameName ? "" : root.GN || this.gameName);
        if (root.PW && root.PB) {
            var wr = root.WR ? " " + root.WR : "";
            var br = root.BR ? " " + root.BR : "";
            desc += (desc.length ? " - " : "") + root.PW + wr + " vs " + root.PB + br;
        }
        return desc;
    },

    sgfCoordToPoint: function(coord) {
        if (!coord || coord == "tt") return {x: null, y: null};
        var sgfCoords = {
            a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9,
            k: 10,l: 11, m: 12, n: 13, o: 14, p: 15, q: 16, r: 17, s: 18
        };
        return {
            x: sgfCoords[coord.charAt(0)],
            y: sgfCoords[coord.charAt(1)]
        };
    },

    pointToSgfCoord: function(pt) {
        if (!pt || (this.board && !this.boundsCheck(pt.x, pt.y, [0, this.board.boardSize-1]))) {
            return null;
        }
        var pts = {
            0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h',
            8: 'i', 9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n', 14: 'o',
            15: 'p', 16: 'q', 17: 'r', 18: 's'
        };
        return pts[pt.x] + pts[pt.y];
    },

    expandCompressedPoints: function(coords) {
        var bounds;
        var ul, lr;
        var x, y;
        var newCoords = [];
        var hits = [];
        for (var i = 0; i < coords.length; i++) {
            bounds = coords[i].split(/:/);
            if (bounds.length > 1) {
                ul = this.sgfCoordToPoint(bounds[0]);
                lr = this.sgfCoordToPoint(bounds[1]);
                for (x = ul.x; x <= lr.x; x++) {
                   for (y = ul.y; y <= lr.y; y++) {
                       newCoords.push(this.pointToSgfCoord({x:x,y:y}));
                   }
                }
                hits.push(i);
            }
       }
       coords = coords.concat(newCoords);
       return coords;
    },

    /**
     * Permalink delegator. An outside hook must handle the actual
     * permalink creation.
    **/
    setPermalink: function() {
        if (!this.permalinkable) return true;
        if (this.unsavedChanges) {
            alert(t['unsaved changes']);
            return;
        }
        this.hook("setPermalink");
    },

    nowLoading: function(msg) {
        if (this.croaked || this.problemMode) return;
        msg = msg || t['loading'] + "...";
        if (byId('eidogo-loading-' + this.uniq)) return;
        this.domLoading = document.createElement('div');
        this.domLoading.id = "eidogo-loading-" + this.uniq;
        this.domLoading.className = "eidogo-loading" +
            (this.theme ? " theme-" + this.theme : "");
        this.domLoading.innerHTML = msg;
        this.dom.player.appendChild(this.domLoading);
    },
    
    doneLoading: function() {
        if (this.domLoading && this.domLoading != null && this.domLoading.parentNode) {
            this.domLoading.parentNode.removeChild(this.domLoading);
            this.domLoading = null;
        }
    },

    croak: function(msg) {
        this.doneLoading();
        if (this.board) {
            alert(msg);
        } else if (this.problemMode) {
            this.prependComment(msg);
        } else {
            this.dom.player.innerHTML += "<div class='eidogo-error " +
                (this.theme ? " theme-" + this.theme : "") + "'>" +
                msg.replace(/\n/g, "<br />") + "</div>";
            this.croaked = true;
        }
    }
};
    
})();
/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Initialize things for EidoGo to function: stylesheets, etc
 */

/**
 * Search for DIV elements with the class 'eidogo-player-auto' and insert a
 * Player into each. Also handle problem-mode Players with
 * 'eidogo-player-problem'
**/
(function() {
    
    var autoCfg = window.eidogoConfig || {};
    var problemCfg = {
        theme:          "problem",
        problemMode:    true,
        markVariations: false,
        markNext:       false,
        shrinkToFit:    true
    };
    var scriptPath = eidogo.util.getPlayerPath();    
    var path = eidogo.playerPath = (autoCfg.playerPath || scriptPath || 'player').replace(/\/$/, "");
    
    if (!autoCfg.skipCss) {
        eidogo.util.addStyleSheet(path + '/css/player.css');
        if (eidogo.browser.ie && parseInt(eidogo.browser.ver, 10) <= 6) {
            eidogo.util.addStyleSheet(path + '/css/player-ie6.css');
        }
    }
    
    eidogo.util.addEvent(window, "load", function() {        
        
        eidogo.autoPlayers = [];
        var els = [];
        var divs = document.getElementsByTagName('div');
        var len = divs.length;
        for (var i = 0; i < len; i++) {
            if (eidogo.util.hasClass(divs[i], "eidogo-player-auto") ||
                eidogo.util.hasClass(divs[i], "eidogo-player-problem")) {
                els.push(divs[i]);
            }
        }
        var el;
        for (var i = 0; el = els[i]; i++) {
            var cfg = {container: el, disableShortcuts: true, theme: "compact"};
            for (var key in autoCfg)
                cfg[key] = autoCfg[key];
            if (eidogo.util.hasClass(el, "eidogo-player-problem"))
                for (var key in problemCfg)
                    cfg[key] = problemCfg[key];
            
            var sgfUrl = el.getAttribute('sgf');
            if (sgfUrl) cfg.sgfUrl = sgfUrl;
            else if (el.innerHTML) cfg.sgf = el.innerHTML;
            
            el.innerHTML = "";
            eidogo.util.show(el);
            
            var player = new eidogo.Player(cfg);
            eidogo.autoPlayers.push(player);
        }
        
    });
    
})();
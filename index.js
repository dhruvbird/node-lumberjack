var util = require('util');
var us   = require('underscore');

var levelNames = 'trace debug info warn error fatal'.split(' ');
var levelPriorities = [ 100, 200, 300, 400, 500, 600 ];

function arguments_to_array(args) {
    return Array.prototype.slice.call(args, 0);
}

function pluralize(n, suffix) {
	return n == 1 ? suffix : suffix + 's';
}

function sprintf(formatString) {
    if (typeof(formatString) !== "string") {
        throw new Error("The format string to 'sprintf' must be a string");
    }
    var fsParts = formatString.split("%s");
    var args = arguments_to_array(arguments).slice(1).map(function(arg, i) {
        if (typeof(arg) !== "string") {
            return String(arg);
        }
        return arg;
    });

    if (fsParts.length !== args.length + 1) {
	var estr = sprintf("You passed '%s' %s to your format string [%s], " + 
                           "which was expecting '%s' %s", 
			   args.length, 
                           pluralize(args.length, "argument"), 
                           formatString, fsParts.length-1, 
                           pluralize(fsParts.length-1, "argument"));
        throw new Error(estr);
    }

    return us(fsParts).chain().zip(us(args).push('')).flatten().value().join('');
}

function getNumericPriority(level) {
    if (typeof(level) !== "string") {
        throw new Error("Level should be a string");
    }
    level = level.toLowerCase();
    var pos = levelNames.indexOf(level);
    if (pos == -1) {
        throw new Error("Level should be one of: " + levelNames);
    }
    return levelNames[pos];
}

function getModuleInfo(moduleName) {
    var stackTraceLines = new Error().stack.split('\n');
    if (stackTraceLines.length < 5) {
        return moduleName;
    }
    var location = stackTraceLines[4].match(/:([0-9]+):([0-9]+)\)$/);
    var caller = stackTraceLines[4].match(/at\ ([^\ ]+)\ /);
    location = location ? location[1] : '00';
    caller   = caller ? caller[1] : 'UNKNOWN';
    return moduleName + ":" + caller + ":" + location;
}

function Logger(moduleName, logLevel) {
    this.moduleName = moduleName;
    this.setLevel(logLevel);

    levelNames.forEach(function(levelName, i) {
        this[levelName] = this._getLoggingFunction(levelName);
    }.bind(this));
}

Logger.prototype.getLevel = function getLevel() {
    return this.levelName;
};

Logger.prototype.setLevel = function setLevel(newLevel) {
    this._priority  = getNumericPriority(newLevel);
    this.levelName = newLevel;
};

Logger.prototype._getLoggingFunction = 
    function _getLoggingFunction(loggingLevelName) {
        loggingLevelName = loggingLevelName.toUpperCase();
        var _priority    = getNumericPriority(loggingLevelName);

        return function(formatString) {
            if (_priority < this._priority) {
                return;
            }
            var message = sprintf.apply(null, arguments);
            var moduleInfo = getModuleInfo(this.moduleName);
            var d = new Date();
            var dateStr = d.toISOString().replace('T', ' ').replace('Z', '');
            var prefix = '[' + dateStr + '] [' + loggingLevelName + '] [' + 
                moduleInfo + '] - ';
            process.stdout.write(prefix);
            process.stdout.write(message);
            process.stdout.write("\n");
        }.bind(this);
    };

function getLogger(moduleName, level) {
    moduleName = moduleName || 'UNKNOWN';
    return new Logger(moduleName, level || 'info');
}

function test() {
    var log = getLogger("index.js", 'Debug');
    log.info("Line 1");
    log.warn("Line %s", 2);
    log.debug("%srd line", 3);
    log.error("4th Line comes here");
    log.trace("Trac%s on th %sth line", "ing", 5);
    log.debug("Insuffici%sent parameters passed");
}

// test();

exports.getLogger = getLogger;

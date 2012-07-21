# node-lumberjack

A very simple logging library for node.js

## Features

* Supports the **%s** format string - use it for every argument. If the parameter is not a string, it is converted to one using String(object)

* Prints:
   * Timestamp
   * Log Statement Severity
   * Module Name
   * Constructor name
   * Function name
   * Line number

* A logger object (returned by getLogger) supports the following methods:
   * trace
   * debug
   * info
   * warn
   * error
   * fatal
   * getLevel(): Returns the currently set log level
   * setLevel(levelString): Sets the current log level

* *trace* is the most verbose log level and *fatal* is the least. If 
  you set the log level to *info*, then all log statements between 
  levels *fatal* and *info* (both inclusive) will be logged.

* More generally, if you set the logging level to **X**, then all log
  statements between *fatal* and *X* (both inclusive) will be logged.


## Caveats

The performance of *node-lumberjack* (or any logging module that shows
the line number/module name/function name) is going to be worse than
that of a logging module that does not. This difference is pretty
pronounced if you indulge in *a lot* of logging. By a *lot* of
logging, I mean many calls to one of the logging functions rather than
logging a lot of data per line. In some simple tests I ran, the
performance difference was 3 sec without printing line numbers and 15
sec with them. This is a **5x** difference, and you might not want to
pay this penalty.

*node-lumberjack* does NOT currently give you an option to turn off
 line numbers since I feel that line numbers and crucial to help in
 debugging errors (which is one of the major use-cases for
 logging). If you do not wish to pay this penalty, choose an
 appropriate logging module from [this
 list](https://github.com/joyent/node/wiki/modules#wiki-logs).


## Example usage

```javascript
var path     = require('path');
var filename = path.basename(path.normalize(__filename))
var log      = require('node-lumberjack').getLogger(filename, 'trace');

log.info("Line 1");
log.warn("Line %s", 2);
```

See the file [test.js](https://github.com/dhruvbird/node-lumberjack/blob/master/test.js) for a complete example on how to use this library.

## Example output

```
[2012-06-10 12:14:23.350] [INFO] [test.js:test:7] - Line 1
[2012-06-10 12:14:23.359] [WARN] [test.js:test:8] - Line 2
[2012-06-10 12:14:23.359] [DEBUG] [test.js:test:9] - 3rd line
[2012-06-10 12:14:23.360] [ERROR] [test.js:test:10] - 4th Line comes here
[2012-06-10 12:14:23.360] [TRACE] [test.js:test:11] - Tracing on the 5th line
```

node-lumberjack prints the module name, constructor name, function name and the line number on which the logging function was called. Here is an example:

```
[2012-06-10 12:14:23.362] [TRACE] [test.js:CtorName.functionName:20] - You should see the object & function name on this line
```

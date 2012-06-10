# lumberjack

A very simple logging library for node.js

See the file test.js for an example on how to use this library

### Example output

```
[2012-06-10 12:14:23.350] [INFO] [test.js:test:7] - Line 1
[2012-06-10 12:14:23.359] [WARN] [test.js:test:8] - Line 2
[2012-06-10 12:14:23.359] [DEBUG] [test.js:test:9] - 3rd line
[2012-06-10 12:14:23.360] [ERROR] [test.js:test:10] - 4th Line comes here
[2012-06-10 12:14:23.360] [TRACE] [test.js:test:11] - Tracing on the 5th line
```

Lumberjack prints the module name, constructor name, function name and the line number on which the logging function was called. Here is an example:

```
[2012-06-10 12:14:23.362] [TRACE] [test.js:CtorName.functionName:20] - You should see the object & function name on this line
```

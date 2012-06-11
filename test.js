var path       = require('path');
var filename   = path.basename(path.normalize(__filename))
var lumberjack = require('./index.js')

function test() {
    var log = lumberjack.getLogger(filename, 'trace');
    log.info("Line 1");
    log.warn("Line %s", 2);
    log.debug("%srd line", 3);
    log.error("4th Line comes here");
    log.trace("Trac%s on the %sth line", "ing", 5);
    try {
        log.debug("Insuffici%sent parameters passed");
    } catch(ex) {
        log.error("%s", String(ex));
    }

    function CtorName() {
        this.functionName = function functionName() {
            log.trace("You should see the object & function name on this line");
        }
    }

    var x = new CtorName();
    x.functionName();

    lumberjack.setGlobalLogLevel('debug');
    log = lumberjack.getLogger(filename, 'info');
    // console.log("Current Log Level:", log.getLevel());
    log.trace("Should NOT print this");
    log.info("Should print this");
}

test();

const logger = jest.createMockFromModule("js-logger");
// logger.createDefaultHandler= jest.fn();
// logger.setHandler = jest.fn(function(cb) {
//   cb();
// });
module.exports = logger;

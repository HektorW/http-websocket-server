
var ErrorCodes = {

  defaultError: 500,
  httpCodeDescriptions: {
    404: 'File not found',
    500: 'Internal server error'
  },
  nodeTranslationTable: {
    34: 404
  },

  getError: function(nodeError) {
    var errorCode = ErrorCodes.nodeTranslationTable[nodeError] || ErrorCodes.defaultError;

    return {
      code: errorCode,
      description: ErrorCodes.httpCodeDescriptions[errorCode]
    };
  }
};

module.exports = ErrorCodes;
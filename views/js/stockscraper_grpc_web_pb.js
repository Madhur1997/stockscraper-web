/**
 * @fileoverview gRPC-Web generated client stub for stockscraper
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.stockscraper = require('./stockscraper_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.stockscraper.stockscraperClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.stockscraper.stockscraperPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.stockscraper.FetchRequest,
 *   !proto.stockscraper.FetchResponse>}
 */
const methodDescriptor_stockscraper_Fetch = new grpc.web.MethodDescriptor(
  '/stockscraper.stockscraper/Fetch',
  grpc.web.MethodType.UNARY,
  proto.stockscraper.FetchRequest,
  proto.stockscraper.FetchResponse,
  /**
   * @param {!proto.stockscraper.FetchRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.stockscraper.FetchResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.stockscraper.FetchRequest,
 *   !proto.stockscraper.FetchResponse>}
 */
const methodInfo_stockscraper_Fetch = new grpc.web.AbstractClientBase.MethodInfo(
  proto.stockscraper.FetchResponse,
  /**
   * @param {!proto.stockscraper.FetchRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.stockscraper.FetchResponse.deserializeBinary
);


/**
 * @param {!proto.stockscraper.FetchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.stockscraper.FetchResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.stockscraper.FetchResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.stockscraper.stockscraperClient.prototype.fetch =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/stockscraper.stockscraper/Fetch',
      request,
      metadata || {},
      methodDescriptor_stockscraper_Fetch,
      callback);
};


/**
 * @param {!proto.stockscraper.FetchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.stockscraper.FetchResponse>}
 *     Promise that resolves to the response
 */
proto.stockscraper.stockscraperPromiseClient.prototype.fetch =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/stockscraper.stockscraper/Fetch',
      request,
      metadata || {},
      methodDescriptor_stockscraper_Fetch);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.stockscraper.MonitorRequest,
 *   !proto.stockscraper.MonitorResponse>}
 */
const methodDescriptor_stockscraper_Monitor = new grpc.web.MethodDescriptor(
  '/stockscraper.stockscraper/Monitor',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.stockscraper.MonitorRequest,
  proto.stockscraper.MonitorResponse,
  /**
   * @param {!proto.stockscraper.MonitorRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.stockscraper.MonitorResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.stockscraper.MonitorRequest,
 *   !proto.stockscraper.MonitorResponse>}
 */
const methodInfo_stockscraper_Monitor = new grpc.web.AbstractClientBase.MethodInfo(
  proto.stockscraper.MonitorResponse,
  /**
   * @param {!proto.stockscraper.MonitorRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.stockscraper.MonitorResponse.deserializeBinary
);


/**
 * @param {!proto.stockscraper.MonitorRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stockscraper.MonitorResponse>}
 *     The XHR Node Readable Stream
 */
proto.stockscraper.stockscraperClient.prototype.monitor =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/stockscraper.stockscraper/Monitor',
      request,
      metadata || {},
      methodDescriptor_stockscraper_Monitor);
};


/**
 * @param {!proto.stockscraper.MonitorRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stockscraper.MonitorResponse>}
 *     The XHR Node Readable Stream
 */
proto.stockscraper.stockscraperPromiseClient.prototype.monitor =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/stockscraper.stockscraper/Monitor',
      request,
      metadata || {},
      methodDescriptor_stockscraper_Monitor);
};


module.exports = proto.stockscraper;


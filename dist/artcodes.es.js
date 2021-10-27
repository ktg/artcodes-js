var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var mirada_min = { exports: {} };
(function(module, exports) {
  (function(f) {
    {
      module.exports = f();
    }
  })(function() {
    return function() {
      function r(e, n, t) {
        function o(i2, f) {
          if (!n[i2]) {
            if (!e[i2]) {
              var c = typeof commonjsRequire == "function" && commonjsRequire;
              if (!f && c)
                return c(i2, true);
              if (u)
                return u(i2, true);
              var a = new Error("Cannot find module '" + i2 + "'");
              throw a.code = "MODULE_NOT_FOUND", a;
            }
            var p = n[i2] = { exports: {} };
            e[i2][0].call(p.exports, function(r2) {
              var n2 = e[i2][1][r2];
              return o(n2 || r2);
            }, p, p.exports, r, e, n, t);
          }
          return n[i2].exports;
        }
        for (var u = typeof commonjsRequire == "function" && commonjsRequire, i = 0; i < t.length; i++)
          o(t[i]);
        return o;
      }
      return r;
    }()({ 1: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var CameraHelper = function() {
        function CameraHelper2(videoInput, outputCanvas, callback) {
          this.videoInput = videoInput;
          this.outputCanvas = outputCanvas;
          this.callback = callback;
          this.streaming = false;
          this.onVideoCanPlay = this.onVideoCanPlay.bind(this);
          this.onVideoStarted = this.onVideoStarted.bind(this);
          this.onVideoStopped = this.onVideoStopped.bind(this);
        }
        CameraHelper2.prototype.start = function() {
          if (!this.streaming) {
            this.startCamera("qvga", this.onVideoStarted, this.videoInput);
          }
        };
        CameraHelper2.prototype.stop = function() {
          if (this.streaming) {
            this.stopCamera();
            this.onVideoStopped();
          }
        };
        CameraHelper2.prototype.startCamera = function(resolution, callback, video) {
          var _this = this;
          navigator.mediaDevices.getUserMedia({ video, audio: false }).then(function(s2) {
            video.srcObject = s2;
            video.play();
            _this.videoInput = video;
            _this.stream = s2;
            _this.onCameraStartedCallback = callback;
            video.addEventListener("canplay", _this.onVideoCanPlay, false);
          }).catch(function(err) {
            console.error(err);
          });
        };
        CameraHelper2.prototype.stopCamera = function() {
          if (this.videoInput) {
            this.videoInput.pause();
            this.videoInput.srcObject = null;
            this.videoInput.removeEventListener("canplay", this.onVideoCanPlay);
          }
          if (this.stream) {
            this.stream.getVideoTracks().forEach(function(t) {
              return t.stop();
            });
          }
        };
        CameraHelper2.prototype.onVideoStarted = function() {
          this.streaming = true;
          this.outputCanvas.width = this.videoInput.videoWidth;
          this.outputCanvas.height = this.videoInput.videoHeight;
          this.callback();
        };
        CameraHelper2.prototype.onVideoStopped = function() {
          this.streaming = false;
          this.outputCanvas.getContext("2d").clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
          this.stopCamera();
        };
        CameraHelper2.prototype.onVideoCanPlay = function() {
          if (this.onCameraStartedCallback) {
            this.onCameraStartedCallback(this.stream, this.videoInput);
          }
        };
        return CameraHelper2;
      }();
      exports2.CameraHelper = CameraHelper;
    }, {}], 2: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var base64_1 = require2("../util/base64");
      var imageUtil_1 = require2("../util/imageUtil");
      var imageCreation_1 = require2("./imageCreation");
      var defaultABOptions = {};
      function renderArrayBufferInCanvas(a, mime, options) {
        if (options === void 0) {
          options = defaultABOptions;
        }
        options = __assign(__assign({}, defaultABOptions), options);
        var url = base64_1.arrayBufferToUrl(a, mime, options.name);
        var img = new Image();
        return new Promise(function(resolve2) {
          img.onload = function() {
            if (!options.canvas) {
              options.canvas = document.createElement("canvas");
              options.appendToBody && document.body.append(options.canvas);
            }
            options.canvas.setAttribute("width", img.naturalWidth + "");
            options.canvas.setAttribute("height", img.naturalHeight + "");
            options.canvas.getContext("2d").drawImage(img, 0, 0);
            resolve2({ canvas: options.canvas, width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = function(e) {
            console.log("ERROR", e);
          };
          img.src = url;
        });
      }
      exports2.renderArrayBufferInCanvas = renderArrayBufferInCanvas;
      function renderSvgInCanvas(svg, options) {
        if (options === void 0) {
          options = defaultABOptions;
        }
        return new Promise(function(resolve2) {
          var img = new Image();
          img.style.display = "none";
          img.onerror = function(e) {
            console.log("ERROR", e);
            resolve2(void 0);
          };
          img.onload = function(e) {
            if (!options.canvas) {
              options.canvas = document.createElement("canvas");
              options.appendToBody && document.body.append(options.canvas);
            }
            options.canvas.setAttribute("width", (img.width || 500) + "");
            options.canvas.setAttribute("height", (img.height || 500) + "");
            options.canvas.getContext("2d").drawImage(img, 0, 0);
            resolve2({ canvas: options.canvas, width: img.naturalWidth, height: img.naturalHeight });
            img.remove();
          };
          document.body.append(img);
          img.src = base64_1.dataToUrl(svg, "image/svg+xml", options.name || "image.svg");
        });
      }
      exports2.renderSvgInCanvas = renderSvgInCanvas;
      var defaultOptions = { rgba: true, forceSameSize: true };
      function renderInCanvas(mat, options) {
        options = __assign(__assign({}, defaultOptions), options);
        if (!options.canvas) {
          options.canvas = document.createElement("canvas");
          options.appendToBody && !options.canvas.isConnected && document.body.append(options.canvas);
        }
        var img = options.rgba ? imageUtil_1.toRgba(mat) : mat;
        var imgData = imageCreation_1.asHtmlImageData(img);
        var ctx = options.canvas.getContext("2d");
        if (options.clear) {
          ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
        }
        if (options.forceSameSize) {
          options.canvas.width = imgData.width;
          options.canvas.height = imgData.height;
          ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
        } else if (!options.region) {
          ctx.putImageData(imgData, 0, 0);
        } else {
          ctx.putImageData(imgData, options.region.x, options.region.y, options.region.x, options.region.y, options.region.width, options.region.height);
        }
        options.rgba && img.delete();
        return options.canvas;
      }
      exports2.renderInCanvas = renderInCanvas;
    }, { "../util/base64": 58, "../util/imageUtil": 61, "./imageCreation": 3 }], 3: [function(require2, module2, exports2) {
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var file_1 = require2("../file");
      var imageUtil_1 = require2("../util/imageUtil");
      function fromInputFileElement(a) {
        return __awaiter(this, void 0, void 0, function() {
          var files;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, file_1.File.fromHtmlFileInputElement(a)];
              case 1:
                files = _a.sent();
                return [2, files.map(function(f) {
                  return f.asMat();
                })];
            }
          });
        });
      }
      exports2.fromInputFileElement = fromInputFileElement;
      function fetchImageData(url) {
        return new Promise(function(resolve2, reject2) {
          var img = new Image();
          img.onload = function(e) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve2(imgData);
          };
          img.onerror = reject2;
          img.src = url;
        });
      }
      exports2.fetchImageData = fetchImageData;
      function asHtmlImageData(img) {
        var imgData = imageUtil_1.toImageData(img);
        var htmlImageData = new ImageData(imgData.data, imgData.width, imgData.height);
        return htmlImageData;
      }
      exports2.asHtmlImageData = asHtmlImageData;
    }, { "../file": 6, "../util/imageUtil": 61 }], 4: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      var __importStar = this && this.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k))
              result[k] = mod[k];
        }
        result["default"] = mod;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var cameraHelper = __importStar(require2("./cameraHelper"));
      var canvasRender = __importStar(require2("./canvasRender"));
      var imageCreation = __importStar(require2("./imageCreation"));
      var VideoReader2 = __importStar(require2("./videoReader"));
      var cameraHelper_1 = require2("./cameraHelper");
      exports2.CameraHelper = cameraHelper_1.CameraHelper;
      var canvasRender_1 = require2("./canvasRender");
      exports2.renderArrayBufferInCanvas = canvasRender_1.renderArrayBufferInCanvas;
      exports2.renderInCanvas = canvasRender_1.renderInCanvas;
      var imageCreation_1 = require2("./imageCreation");
      exports2.getHtmlImageData = imageCreation_1.asHtmlImageData;
      exports2.fetchImageData = imageCreation_1.fetchImageData;
      exports2.fromInputFileElement = imageCreation_1.fromInputFileElement;
      var videoReader_1 = require2("./videoReader");
      exports2.VideoReader = videoReader_1.VideoReader;
      exports2.browser = __assign(__assign(__assign(__assign({}, canvasRender), cameraHelper), imageCreation), VideoReader2);
    }, { "./cameraHelper": 1, "./canvasRender": 2, "./imageCreation": 3, "./videoReader": 5 }], 5: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var util_1 = require2("../util");
      var VideoReader2 = function() {
        function VideoReader3(video, canvas, o) {
          if (o === void 0) {
            o = VideoReader3.defaultOptions;
          }
          this.video = video;
          this.canvas = canvas;
          this.o = o;
          this.mat = null;
          this.streaming = false;
          this.o = __assign(__assign({}, VideoReader3.defaultOptions), o);
          this.ctx = canvas.getContext("2d");
          this.size = this.getSize();
        }
        VideoReader3.prototype.read = function() {
          this.o.noMatCheck || this.matCheck();
          this.ctx.drawImage(this.video, 0, 0, this.size.width, this.size.height);
          this.mat.data.set(this.ctx.getImageData(0, 0, this.size.width, this.size.height).data);
        };
        VideoReader3.prototype.canPlay = function() {
          var _this = this;
          var constraints = { audio: false, video: true };
          return new Promise(function(resolve2) {
            _this.video.addEventListener("canplay", function() {
              var size = _this.getSize();
              _this.canvas.width = size.width;
              _this.canvas.height = size.height;
              _this.mat = new cv.Mat(size.height, size.width, cv.CV_8UC4);
              _this.streaming = true;
              resolve2();
            }, false);
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream2) {
              _this.stream = _this.video.srcObject = stream2;
            });
          });
        };
        VideoReader3.prototype.stop = function() {
          if (this.stream) {
            this.stream.getVideoTracks().forEach(function(t) {
              return t.stop();
            });
            this.streaming = false;
            util_1.del(this.mat);
          }
        };
        VideoReader3.prototype.getSize = function() {
          if (!this.size) {
            this.size = this.o.size === "videoSize" ? { width: this.video.videoWidth, height: this.video.videoHeight } : this.o.size === "video" ? { width: this.video.width, height: this.video.height } : { width: this.canvas.width, height: this.canvas.height };
          }
          return this.size;
        };
        VideoReader3.prototype.matCheck = function() {
          if (!(this.mat instanceof cv.Mat)) {
            throw new Error("Please input the valid cv.Mat instance.");
          }
          if (this.mat.type() !== cv.CV_8UC4) {
            throw new Error("Bad type of input mat: the type should be cv.CV_8UC4.");
          }
          if (this.mat.cols !== this.size.width || this.mat.rows !== this.size.height) {
            throw new Error("Bad size of input mat: the size should be same as the video.");
          }
        };
        VideoReader3.defaultOptions = { size: "canvas", constraints: { audio: false, video: true } };
        return VideoReader3;
      }();
      exports2.VideoReader = VideoReader2;
    }, { "../util": 62 }], 6: [function(require2, module2, exports2) {
      (function(Buffer2) {
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve2) {
              resolve2(value);
            });
          }
          return new (P || (P = Promise))(function(resolve2, reject2) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject2(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject2(e);
              }
            }
            function step(result) {
              result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        var __generator = this && this.__generator || function(thisArg, body) {
          var _ = { label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        var __importDefault = this && this.__importDefault || function(mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        var assert_1 = require2("assert");
        var cross_fetch_1 = __importDefault(require2("cross-fetch"));
        var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
        var imageCreation_1 = require2("./browser/imageCreation");
        var format_1 = require2("./format");
        var base64_1 = require2("./util/base64");
        var fileUtil_1 = require2("./util/fileUtil");
        var imageUtil_1 = require2("./util/imageUtil");
        var fileType2 = require2("file-type");
        var File = function() {
          function File2(name, _mat) {
            this.name = name;
            this._mat = _mat;
          }
          File2.prototype.size = function() {
            return { width: this._mat.cols, height: this._mat.rows };
          };
          File2.prototype.getMimeType = function() {
            return misc_utils_of_mine_generic_1.getMimeTypeForExtension(this.getExtension());
          };
          File2.prototype.getExtension = function() {
            return misc_utils_of_mine_generic_1.getFileExtension(this.name).toLowerCase();
          };
          File2.prototype.asMat = function() {
            return this._mat;
          };
          File2.prototype.asImageData = function() {
            return imageUtil_1.toImageData(this._mat);
          };
          File2.prototype.asHTMLImageData = function() {
            return imageCreation_1.asHtmlImageData(this._mat);
          };
          File2.prototype.asDataUrl = function() {
            return "data:" + this.getMimeType() + ";" + this.name + ";base64," + this.asBase64();
          };
          Object.defineProperty(File2.prototype, "width", { get: function() {
            return this._mat.cols;
          }, enumerable: true, configurable: true });
          Object.defineProperty(File2.prototype, "height", { get: function() {
            return this._mat.rows;
          }, enumerable: true, configurable: true });
          Object.defineProperty(File2.prototype, "mat", { get: function() {
            return this._mat;
          }, enumerable: true, configurable: true });
          File2.prototype.remove = function(deleteMat) {
            if (deleteMat === void 0) {
              deleteMat = true;
            }
            deleteMat && this.delete();
            this.name && fileUtil_1.isFile(this.name) && fileUtil_1.removeFile(this.name);
            return this;
          };
          File2.prototype.asArrayBuffer = function(format) {
            if (format === void 0) {
              format = this.getExtension();
            }
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, format_1.encodeOrThrow(this.asImageData(), format)];
                  case 1:
                    return [2, _a.sent()];
                }
              });
            });
          };
          File2.prototype.write = function(path, format) {
            if (path === void 0) {
              path = this.name;
            }
            if (format === void 0) {
              format = this.getExtension();
            }
            return __awaiter(this, void 0, void 0, function() {
              var a;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, this.asArrayBuffer(format)];
                  case 1:
                    a = _a.sent();
                    fileUtil_1.writeFile(path, new Uint8ClampedArray(a));
                    return [2, this];
                }
              });
            });
          };
          File2.prototype.setMat = function(mat) {
            this.delete();
            this._mat = mat;
            return this;
          };
          File2.prototype.show = function(el) {
            cv.imshow(el, this.asMat());
            return this;
          };
          File2.prototype.asBase64 = function(format) {
            if (format === void 0) {
              format = this.getExtension();
            }
            return __awaiter(this, void 0, void 0, function() {
              var encoded;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, this.asArrayBuffer(format)];
                  case 1:
                    encoded = _a.sent();
                    return [2, base64_1.arrayBufferToBase64(encoded)];
                }
              });
            });
          };
          File2.prototype.delete = function() {
            try {
              this._mat && this._mat.delete();
            } catch (error) {
            }
          };
          File2.prototype.toRgba = function() {
            var dst = imageUtil_1.toRgba(this.mat);
            this.mat.delete();
            this._mat = dst;
            return this;
          };
          File2.prototype.clone = function(name) {
            if (name === void 0) {
              name = this.name;
            }
            return File2.fromMat(this.mat.clone(), name);
          };
          File2.fromBase64 = function(base64, name) {
            var buffer = Buffer2.from(base64, "base64");
            return File2.fromArrayBuffer(buffer, name || File2.getBufferFileName(buffer));
          };
          File2.fromArrayBuffer = function(buffer, name) {
            return __awaiter(this, void 0, void 0, function() {
              var format, data, error_1;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 2, , 3]);
                    name = name || File2.getBufferFileName(buffer);
                    format = misc_utils_of_mine_generic_1.getFileExtension(name);
                    return [4, format_1.decodeOrThrow(buffer, format)];
                  case 1:
                    data = _a.sent();
                    return [2, File2.fromData(data, name)];
                  case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    throw error_1;
                  case 3:
                    return [2];
                }
              });
            });
          };
          File2.fromArrayBufferView = function(a, name) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, File2.fromArrayBuffer(a.buffer, name)];
              });
            });
          };
          File2.getBufferFileType = function(a) {
            var t = File2.fileType(a);
            if (!t) {
              throw new Error("Could not get file type for buffer");
            }
            return t;
          };
          File2.fileType = function(a) {
            var t = fileType2(a);
            if (!t) {
              var s2 = base64_1.arrayBufferToString(a);
              if (s2.includes("<svg")) {
                t = { ext: "svg", mime: "image/svg+xml" };
              }
            }
            return t;
          };
          File2.getBufferFileName = function(a) {
            var t = File2.getBufferFileType(a);
            return misc_utils_of_mine_generic_1.unique("file") + t.ext;
          };
          File2.fromDataUrl = function(dataUrl, name) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, File2.fromBase64(base64_1.urlToBase64(dataUrl), name)];
                  case 1:
                    return [2, _a.sent()];
                }
              });
            });
          };
          File2.fromHtmlFileInputElement = function(el) {
            var _this = this;
            if (!misc_utils_of_mine_generic_1.inBrowser()) {
              throw new Error("This method is only supported in the browser");
            }
            return Promise.all(Array.from(el.files).map(function(file) {
              return new Promise(function(resolve2, reject2) {
                var reader = new FileReader();
                reader.addEventListener("loadend", function(e) {
                  return __awaiter(_this, void 0, void 0, function() {
                    var _a;
                    return __generator(this, function(_b) {
                      switch (_b.label) {
                        case 0:
                          _a = resolve2;
                          return [4, File2.fromArrayBuffer(reader.result, file.name)];
                        case 1:
                          return [2, _a.apply(void 0, [_b.sent()])];
                      }
                    });
                  });
                });
                reader.readAsArrayBuffer(file);
              });
            }));
          };
          File2.fromCanvas = function(el) {
            if (!misc_utils_of_mine_generic_1.inBrowser()) {
              throw new Error("This method is only supported in the browser");
            }
            return File2.fromMat(cv.imread(el));
          };
          File2.resolveOne = function(files) {
            return __awaiter(this, void 0, void 0, function() {
              var a;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, File2.resolve(files)];
                  case 1:
                    a = _a.sent();
                    return [2, a.length > 0 ? a[0] : void 0];
                }
              });
            });
          };
          File2.resolve = function(files) {
            return __awaiter(this, void 0, void 0, function() {
              var a, result;
              var _this = this;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    a = misc_utils_of_mine_generic_1.asArray(files || []).filter(misc_utils_of_mine_generic_1.notUndefined);
                    return [4, misc_utils_of_mine_generic_1.serial(a.map(function(f) {
                      return function() {
                        return __awaiter(_this, void 0, void 0, function() {
                          return __generator(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                if (!(typeof f === "string"))
                                  return [3, 5];
                                if (!fileUtil_1.isFile(f))
                                  return [3, 2];
                                return [4, File2.fromFile(f)];
                              case 1:
                                return [2, _a2.sent()];
                              case 2:
                                return [4, File2.fromUrl(f)];
                              case 3:
                                return [2, _a2.sent()];
                              case 4:
                                return [3, 6];
                              case 5:
                                assert_1.ok(ArrayBuffer.isView(f._mat.data.buffer));
                                return [2, f];
                              case 6:
                                return [2];
                            }
                          });
                        });
                      };
                    }))];
                  case 1:
                    result = _a.sent();
                    return [2, result.filter(misc_utils_of_mine_generic_1.notUndefined)];
                }
              });
            });
          };
          File2.isFile = function(f) {
            return !!f && !!f.name && !!f._mat && !!f._mat.data && typeof f.constructor !== "undefined" && !!f.asImageData && !!f.asMat;
          };
          File2.asPath = function(f) {
            return typeof f === "string" ? f : f.name;
          };
          File2.fromData = function(data, name) {
            return new File2(File2._buildName(name), cv.matFromImageData(data));
          };
          File2._buildName = function(name) {
            return name || misc_utils_of_mine_generic_1.unique("file") + ".png";
          };
          File2.fromMat = function(mat, name) {
            return new File2(File2._buildName(name), mat);
          };
          File2.prototype.toString = function() {
            return '[File "' + this.name + '"]';
          };
          File2.fromUrl = function(url, o) {
            if (o === void 0) {
              o = {};
            }
            return __awaiter(this, void 0, void 0, function() {
              var response, buffer, data;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    format_1.getDefaultCodec();
                    return [4, cross_fetch_1.default(url)];
                  case 1:
                    response = _a.sent();
                    return [4, response.arrayBuffer()];
                  case 2:
                    buffer = _a.sent();
                    return [4, format_1.decodeOrThrow(buffer)];
                  case 3:
                    data = _a.sent();
                    return [2, File2.fromData(data, o.name || misc_utils_of_mine_generic_1.getFileNameFromUrl(url))];
                }
              });
            });
          };
          File2.fromFile = function(path, name) {
            if (name === void 0) {
              name = misc_utils_of_mine_generic_1.basename(path);
            }
            return __awaiter(this, void 0, void 0, function() {
              var data;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, format_1.decodeOrThrow(fileUtil_1.readFile(path).buffer)];
                  case 1:
                    data = _a.sent();
                    return [2, File2.fromData(data, name)];
                }
              });
            });
          };
          return File2;
        }();
        exports2.File = File;
      }).call(this, require2("buffer").Buffer);
    }, { "./browser/imageCreation": 3, "./format": 9, "./util/base64": 58, "./util/fileUtil": 59, "./util/imageUtil": 61, assert: 64, buffer: 70, "cross-fetch": 71, "file-type": 72, "misc-utils-of-mine-generic": 92 }], 7: [function(require2, module2, exports2) {
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
      var canvasRender_1 = require2("../browser/canvasRender");
      var file_1 = require2("../file");
      var base64_1 = require2("../util/base64");
      var CanvasCodec = function() {
        function CanvasCodec2() {
        }
        CanvasCodec2.prototype.decode = function(buffer, format) {
          return __awaiter(this, void 0, void 0, function() {
            var tt, mime, _a, canvas, height, width, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  mime = format ? misc_utils_of_mine_generic_1.getMimeTypeForExtension(format) : (tt = file_1.File.fileType(buffer)) && tt.mime || void 0;
                  if (!mime) {
                    return [2];
                  }
                  if (!(mime === "image/svg+xml"))
                    return [3, 2];
                  return [4, canvasRender_1.renderSvgInCanvas(base64_1.arrayBufferToString(buffer))];
                case 1:
                  _b = _c.sent();
                  return [3, 4];
                case 2:
                  return [4, canvasRender_1.renderArrayBufferInCanvas(buffer, mime)];
                case 3:
                  _b = _c.sent();
                  _c.label = 4;
                case 4:
                  _a = _b, canvas = _a.canvas, height = _a.height, width = _a.width;
                  return [2, canvas.getContext("2d").getImageData(0, 0, width, height)];
              }
            });
          });
        };
        CanvasCodec2.prototype.encode = function(data, format, quality) {
          return __awaiter(this, void 0, void 0, function() {
            var mat, canvas_1;
            return __generator(this, function(_a) {
              try {
                mat = cv.matFromImageData(data);
                canvas_1 = canvasRender_1.renderInCanvas(mat, { forceSameSize: true, rgba: true });
                mat.delete();
                return [2, new Promise(function(resolve2, reject2) {
                  canvas_1.toBlob(function(b) {
                    if (!b) {
                      return resolve2(void 0);
                    }
                    var r = new FileReader();
                    r.onloadend = function(a) {
                      resolve2(r.result || void 0);
                    };
                    r.onerror = r.onabort = function() {
                      r.error ? reject2(r.error) : resolve2(void 0);
                    };
                    r.readAsArrayBuffer(b);
                  }, misc_utils_of_mine_generic_1.getMimeTypeForExtension(format) || "image/png", quality);
                })];
              } catch (error) {
                console.error(error);
              }
              return [2];
            });
          });
        };
        return CanvasCodec2;
      }();
      exports2.CanvasCodec = CanvasCodec;
    }, { "../browser/canvasRender": 2, "../file": 6, "../util/base64": 58, "misc-utils-of-mine-generic": 92 }], 8: [function(require2, module2, exports2) {
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
      var file_1 = require2("../file");
      function installFormatProxy(proxy) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            proxies.push(proxy);
            return [2];
          });
        });
      }
      exports2.installFormatProxy = installFormatProxy;
      function unInstallFormatProxies() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            proxies.length = 0;
            return [2];
          });
        });
      }
      exports2.unInstallFormatProxies = unInstallFormatProxies;
      var proxies = [];
      var codecs = [];
      var _proxyLoaded = false;
      function createCodec(proxy) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                if (!(typeof proxy === "function"))
                  return [3, 2];
                return [4, proxy()];
              case 1:
                _a = _b.sent();
                return [3, 4];
              case 2:
                return [4, proxy.create()];
              case 3:
                _a = _b.sent();
                _b.label = 4;
              case 4:
                return [2, _a];
            }
          });
        });
      }
      function loadFormatProxies() {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          var _this = this;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                if (!!_proxyLoaded)
                  return [3, 3];
                _proxyLoaded = true;
                _a = proxies.length;
                if (!_a)
                  return [3, 2];
                return [4, misc_utils_of_mine_generic_1.serial(proxies.map(function(proxy) {
                  return function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var p;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, createCodec(proxy)];
                          case 1:
                            p = _a2.sent();
                            codecs.push(p);
                            return [2];
                        }
                      });
                    });
                  };
                }))];
              case 1:
                _a = _b.sent();
                _b.label = 2;
              case 2:
                _b.label = 3;
              case 3:
                return [2];
            }
          });
        });
      }
      exports2.loadFormatProxies = loadFormatProxies;
      function unloadFormatProxies() {
        codecs.length = 0;
      }
      exports2.unloadFormatProxies = unloadFormatProxies;
      function getDefaultCodec() {
        var c = codecs.length ? codecs[0] : void 0;
        if (!c) {
          throw new Error("No codec found. you need to provide a proxy and wait for loadFormatProxies()");
        }
        return c;
      }
      exports2.getDefaultCodec = getDefaultCodec;
      function decodeOrThrow(buffer, format) {
        return __awaiter(this, void 0, void 0, function() {
          var r;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, getDefaultCodec().decode(buffer, format)];
              case 1:
                r = _a.sent();
                misc_utils_of_mine_generic_1.checkThrow(r, "Fail to decode buffer. " + (format ? "requested format: " + format : "") + ". Detected format: " + (file_1.File.getBufferFileType(buffer) && file_1.File.getBufferFileType(buffer).mime || "unknown"));
                return [2, r];
            }
          });
        });
      }
      exports2.decodeOrThrow = decodeOrThrow;
      function encodeOrThrow(data, format, quality) {
        return __awaiter(this, void 0, void 0, function() {
          var r;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, getDefaultCodec().encode(data, format, quality)];
              case 1:
                r = _a.sent();
                misc_utils_of_mine_generic_1.checkThrow(r, "Fail to encode to requested format " + format + ". Given: " + format);
                return [2, r];
            }
          });
        });
      }
      exports2.encodeOrThrow = encodeOrThrow;
    }, { "../file": 6, "misc-utils-of-mine-generic": 92 }], 9: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      var __importStar = this && this.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k))
              result[k] = mod[k];
        }
        result["default"] = mod;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./canvasCodec"));
      __export(require2("./format"));
      __export(require2("./jimpCodec"));
      var canvasCodec = __importStar(require2("./canvasCodec"));
      var f = __importStar(require2("./format"));
      var jimpCodec = __importStar(require2("./jimpCodec"));
      exports2.format = __assign(__assign(__assign({}, canvasCodec), f), jimpCodec);
    }, { "./canvasCodec": 7, "./format": 8, "./jimpCodec": 10 }], 10: [function(require2, module2, exports2) {
      (function(Buffer2) {
        var __assign = this && this.__assign || function() {
          __assign = Object.assign || function(t) {
            for (var s2, i = 1, n = arguments.length; i < n; i++) {
              s2 = arguments[i];
              for (var p in s2)
                if (Object.prototype.hasOwnProperty.call(s2, p))
                  t[p] = s2[p];
            }
            return t;
          };
          return __assign.apply(this, arguments);
        };
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve2) {
              resolve2(value);
            });
          }
          return new (P || (P = Promise))(function(resolve2, reject2) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject2(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject2(e);
              }
            }
            function step(result) {
              result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        var __generator = this && this.__generator || function(thisArg, body) {
          var _ = { label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
        var JimpCodec = function() {
          function JimpCodec2(jimp) {
            this.jimp = jimp;
          }
          JimpCodec2.prototype.decode = function(buffer) {
            return __awaiter(this, void 0, void 0, function() {
              var img;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, this.jimp.create(Buffer2.from(buffer))];
                  case 1:
                    img = _a.sent();
                    return [2, img.bitmap];
                }
              });
            });
          };
          JimpCodec2.prototype.encode = function(data, format, quality) {
            return __awaiter(this, void 0, void 0, function() {
              var mime, img, buffer;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    mime = misc_utils_of_mine_generic_1.getMimeTypeForExtension(format);
                    if (!mime) {
                      throw new Error("format not supported" + format);
                    }
                    img = new this.jimp(__assign(__assign({}, data), { data: Buffer2.from(data.data.buffer) }));
                    return [4, img.getBufferAsync(mime)];
                  case 1:
                    buffer = _a.sent();
                    return [2, buffer];
                }
              });
            });
          };
          return JimpCodec2;
        }();
        exports2.JimpCodec = JimpCodec;
      }).call(this, require2("buffer").Buffer);
    }, { buffer: 70, "misc-utils-of-mine-generic": 92 }], 11: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./browser"));
      __export(require2("./file"));
      __export(require2("./format/"));
      __export(require2("./opencvReady"));
      __export(require2("./types/opencv"));
      __export(require2("./util"));
      require2("./types/_cv");
    }, { "./browser": 4, "./file": 6, "./format/": 9, "./opencvReady": 12, "./types/_cv": 13, "./types/opencv": 52, "./util": 62 }], 12: [function(require2, module2, exports2) {
      (function(process) {
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve2) {
              resolve2(value);
            });
          }
          return new (P || (P = Promise))(function(resolve2, reject2) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject2(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject2(e);
              }
            }
            function step(result) {
              result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        var __generator = this && this.__generator || function(thisArg, body) {
          var _ = { label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        var __spreadArrays = this && this.__spreadArrays || function() {
          for (var s2 = 0, i = 0, il = arguments.length; i < il; i++)
            s2 += arguments[i].length;
          for (var r = Array(s2), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        var fs_1 = require2("fs");
        var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
        var format_1 = require2("./format");
        var misc_1 = require2("./util/misc");
        exports2.FS_ROOT = "/work";
        var FS_;
        function getFS() {
          return FS_;
        }
        exports2.getFS = getFS;
        var opencvLoaded = false;
        function loadOpencv(options) {
          if (options === void 0) {
            options = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var formatProxies;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (options.force) {
                    opencvLoaded = false;
                    misc_utils_of_mine_generic_1.getGlobal().Module = void 0;
                    FS_ = void 0;
                  }
                  if (opencvLoaded) {
                    options.onloadCallback && options.onloadCallback();
                    return [2];
                  }
                  formatProxies = options.formatProxies || __spreadArrays(misc_utils_of_mine_generic_1.isNode() ? [] : [function() {
                    return new format_1.CanvasCodec();
                  }]);
                  return [4, misc_utils_of_mine_generic_1.serial(formatProxies.map(function(p) {
                    return function() {
                      return __awaiter(_this, void 0, void 0, function() {
                        return __generator(this, function(_a2) {
                          switch (_a2.label) {
                            case 0:
                              return [4, format_1.installFormatProxy(p)];
                            case 1:
                              _a2.sent();
                              return [2];
                          }
                        });
                      });
                    };
                  }))];
                case 1:
                  _a.sent();
                  return [4, format_1.loadFormatProxies()];
                case 2:
                  _a.sent();
                  if (!misc_utils_of_mine_generic_1.isNode())
                    return [3, 4];
                  return [4, loadOpencvNode(options)];
                case 3:
                  _a.sent();
                  return [3, 6];
                case 4:
                  return [4, loadOpencvBrowser(options)];
                case 5:
                  _a.sent();
                  _a.label = 6;
                case 6:
                  return [2];
              }
            });
          });
        }
        exports2.loadOpencv = loadOpencv;
        function loadOpencvNode(o) {
          var _this = this;
          return new Promise(function(resolve2) {
            var fileName = o.opencvJsExceptions ? "opencv_exception.js" : "opencv.js";
            var paths = [o.opencvJsLocation, "./node_modules/mirada/dist/src/" + fileName, "./dist/src/" + fileName].filter(misc_utils_of_mine_generic_1.notFalsy);
            var g = misc_utils_of_mine_generic_1.getGlobal();
            var path = paths.find(fs_1.existsSync);
            var resolved = path && misc_1.resolveNodeModule(path);
            if (!resolved) {
              throw misc_1.buildError(fileName + " not found. in any of these: " + paths.join(", "));
            }
            g.Module = { preRun: function() {
              if (typeof window !== "object" && !g.Module.FS.analyzePath(exports2.FS_ROOT).exists) {
                g.Module.FS.mkdir(exports2.FS_ROOT);
                g.Module.FS.mount(g.Module.FS.filesystems.NODEFS, { root: o.cwd || process.cwd() || "." }, exports2.FS_ROOT);
              }
            }, onRuntimeInitialized: function() {
              return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                  opencvLoaded = true;
                  FS_ = misc_utils_of_mine_generic_1.getGlobal().Module.FS;
                  o.onloadCallback && o.onloadCallback();
                  resolve2();
                  return [2];
                });
              });
            }, onAbort: function(e) {
              console.error("Error has occurred in WebAssembly Module", e, e.stack);
              console.trace();
            } };
            try {
              g.cv = require2(resolved);
            } catch (error) {
              console.error("An error occurred when trying to load " + fileName + " form " + resolved, error, error.stack);
              throw error;
            }
          });
        }
        function loadOpencvBrowser(o) {
          var _this = this;
          return new Promise(function(resolve2, reject2) {
            var script = document.createElement("script");
            script.setAttribute("async", "");
            script.setAttribute("type", "text/javascript");
            script.addEventListener("load", function() {
              return __awaiter(_this, void 0, void 0, function() {
                var g;
                var _this2 = this;
                return __generator(this, function(_a) {
                  g = misc_utils_of_mine_generic_1.getGlobal();
                  if (typeof g.cv !== "undefined" && typeof g.cv.getBuildInformation !== "undefined") {
                    opencvLoaded = true;
                    FS_ = misc_utils_of_mine_generic_1.getGlobal().Module.FS;
                    o.onloadCallback && o.onloadCallback();
                    resolve2();
                  } else {
                    g.cv = typeof g.cv === "undefined" ? {} : g.cv;
                    g.cv.onRuntimeInitialized = function() {
                      return __awaiter(_this2, void 0, void 0, function() {
                        return __generator(this, function(_a2) {
                          opencvLoaded = true;
                          FS_ = misc_utils_of_mine_generic_1.getGlobal().Module.FS;
                          o.onloadCallback && o.onloadCallback();
                          resolve2();
                          return [2];
                        });
                      });
                    };
                  }
                  return [2];
                });
              });
            });
            var src = o.opencvJsLocation || (o.opencvJsExceptions ? "opencv_exception.js" : "opencv.js");
            script.addEventListener("error", function() {
              reject2("Failed to load " + src);
            });
            script.src = src;
            var node = document.getElementsByTagName("script")[0];
            node.parentNode.insertBefore(script, node);
          });
        }
      }).call(this, require2("_process"));
    }, { "./format": 9, "./util/misc": 63, _process: 121, fs: 69, "misc-utils-of-mine-generic": 92 }], 13: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 14: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 15: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      require2("./_types");
    }, { "./_types": 35 }], 16: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 17: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 18: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 19: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      require2("./_types");
    }, { "./_types": 35 }], 20: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 21: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 22: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 23: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 24: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 25: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 26: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 27: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      require2("./_types");
    }, { "./_types": 35 }], 28: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      require2("./_types");
    }, { "./_types": 35 }], 29: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 30: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 31: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 32: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 33: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 34: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Mat_1 = require2("./Mat");
      exports2.InputArray = Mat_1.Mat;
      exports2.InputArrayOfArrays = Mat_1.Mat;
      exports2.InputOutputArray = Mat_1.Mat;
      exports2.InputOutputArrayOfArrays = Mat_1.Mat;
      exports2.MatVector = Mat_1.Mat;
      exports2.OutputArray = Mat_1.Mat;
      exports2.OutputArrayOfArrays = Mat_1.Mat;
      require2(".");
      require2("../_cv");
    }, { ".": 52, "../_cv": 13, "./Mat": 27 }], 35: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./Affine3"));
      __export(require2("./Algorithm"));
      __export(require2("./AutoBuffer"));
      __export(require2("./BFMatcher"));
      __export(require2("./BOWTrainer"));
      __export(require2("./calib3d"));
      __export(require2("./CascadeClassifier"));
      __export(require2("./core_array"));
      __export(require2("./core_cluster"));
      __export(require2("./core_hal_interface"));
      __export(require2("./core_utils"));
      __export(require2("./DescriptorMatcher"));
      __export(require2("./dnn"));
      __export(require2("./DynamicBitset"));
      __export(require2("./Exception"));
      __export(require2("./features2d_draw"));
      __export(require2("./FlannBasedMatcher"));
      __export(require2("./HOGDescriptor"));
      __export(require2("./imgproc_color_conversions"));
      __export(require2("./imgproc_draw"));
      __export(require2("./imgproc_feature"));
      __export(require2("./imgproc_filter"));
      __export(require2("./imgproc_hist"));
      __export(require2("./imgproc_misc"));
      __export(require2("./imgproc_object"));
      __export(require2("./imgproc_shape"));
      __export(require2("./imgproc_transform"));
      __export(require2("./Logger"));
      __export(require2("./LshTable"));
      __export(require2("./Mat"));
      __export(require2("./MatExpr"));
      __export(require2("./MatOp"));
      __export(require2("./Matx"));
      __export(require2("./Node"));
      __export(require2("./objdetect"));
      __export(require2("./PCA"));
      __export(require2("./photo_inpaint"));
      __export(require2("./RotatedRect"));
      __export(require2("./softdouble"));
      __export(require2("./softfloat"));
      __export(require2("./video_track"));
      __export(require2("./_hacks"));
    }, { "./Affine3": 14, "./Algorithm": 15, "./AutoBuffer": 16, "./BFMatcher": 17, "./BOWTrainer": 18, "./CascadeClassifier": 19, "./DescriptorMatcher": 20, "./DynamicBitset": 21, "./Exception": 22, "./FlannBasedMatcher": 23, "./HOGDescriptor": 24, "./Logger": 25, "./LshTable": 26, "./Mat": 27, "./MatExpr": 28, "./MatOp": 29, "./Matx": 30, "./Node": 31, "./PCA": 32, "./RotatedRect": 33, "./_hacks": 34, "./calib3d": 36, "./core_array": 37, "./core_cluster": 38, "./core_hal_interface": 39, "./core_utils": 40, "./dnn": 41, "./features2d_draw": 42, "./imgproc_color_conversions": 43, "./imgproc_draw": 44, "./imgproc_feature": 45, "./imgproc_filter": 46, "./imgproc_hist": 47, "./imgproc_misc": 48, "./imgproc_object": 49, "./imgproc_shape": 50, "./imgproc_transform": 51, "./objdetect": 53, "./photo_inpaint": 54, "./softdouble": 55, "./softfloat": 56, "./video_track": 57 }], 36: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 37: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 38: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 39: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 40: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 41: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 42: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 43: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 44: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 45: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 46: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 47: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 48: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 49: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 50: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 51: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 52: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./_hacks"));
      __export(require2("./_types"));
    }, { "./_hacks": 34, "./_types": 35 }], 53: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 54: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 55: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 56: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 57: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
    }, {}], 58: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var buffer_1 = require2("buffer/");
      function dataToUrl(data, mimeType, fileName) {
        return base64ToUrl(dataToBase64(data), mimeType, fileName);
      }
      exports2.dataToUrl = dataToUrl;
      function dataToBase64(data) {
        return buffer_1.Buffer.from(data).toString("base64");
      }
      exports2.dataToBase64 = dataToBase64;
      function base64ToUrl(base64, mimeType, fileName) {
        return "data:" + mimeType + (fileName ? ";name=" + fileName : "") + ";base64," + base64;
      }
      exports2.base64ToUrl = base64ToUrl;
      function urlToBase64(s2) {
        return s2.substring(s2.indexOf(";base64,") + ";base64,".length);
      }
      exports2.urlToBase64 = urlToBase64;
      function getDataUrlFileName(url) {
        var p = url && url.split(";base64,");
        var q = p.length ? p[0].split(";").find(function(s2) {
          return s2.includes("name=");
        }) : "";
        p = q ? q.split("=") : [];
        return p[p.length - 1];
      }
      exports2.getDataUrlFileName = getDataUrlFileName;
      function arrayBufferToBase64(buffer) {
        return buffer_1.Buffer.from(buffer).toString("base64");
      }
      exports2.arrayBufferToBase64 = arrayBufferToBase64;
      function arrayBufferToUrl(buffer, mime, name) {
        var b64 = arrayBufferToBase64(buffer);
        return base64ToUrl(b64, mime, name);
      }
      exports2.arrayBufferToUrl = arrayBufferToUrl;
      function arrayBufferToString(buffer) {
        return buffer_1.Buffer.from(buffer).toString();
      }
      exports2.arrayBufferToString = arrayBufferToString;
    }, { "buffer/": 70 }], 59: [function(require2, module2, exports2) {
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      var __importDefault = this && this.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var cross_fetch_1 = __importDefault(require2("cross-fetch"));
      var opencvReady_1 = require2("../opencvReady");
      function readFile(f, FS) {
        if (FS === void 0) {
          FS = cv.FS;
        }
        return FS.readFile(getFilePath(f));
      }
      exports2.readFile = readFile;
      function getFileName(path) {
        return path.startsWith(opencvReady_1.FS_ROOT + "/") ? path.substring((opencvReady_1.FS_ROOT + "/").length, path.length) : "" + path;
      }
      exports2.getFileName = getFileName;
      function getFilePath(path) {
        return path.startsWith(opencvReady_1.FS_ROOT + "/") ? path : opencvReady_1.FS_ROOT + "/" + path;
      }
      exports2.getFilePath = getFilePath;
      function writeFile(name, f, FS) {
        if (FS === void 0) {
          FS = cv.FS;
        }
        FS.writeFile(getFilePath(name), f);
      }
      exports2.writeFile = writeFile;
      function removeFile(f, FS) {
        if (FS === void 0) {
          FS = cv.FS;
        }
        FS.unlink(getFilePath(getFilePath(f)));
      }
      exports2.removeFile = removeFile;
      function isDir(f, FS) {
        if (FS === void 0) {
          FS = cv.FS;
        }
        try {
          return FS.isDir(FS.stat(getFilePath(f)).mode);
        } catch (error) {
          return false;
        }
      }
      exports2.isDir = isDir;
      function isFile(f, FS) {
        if (FS === void 0) {
          FS = cv.FS;
        }
        try {
          return FS.isFile(FS.stat(getFilePath(f)).mode);
        } catch (error) {
          return false;
        }
      }
      exports2.isFile = isFile;
      exports2.fileUtil = { isDir, isFile, removeFile, writeFile, getFilePath, readFile, getFileName };
      function loadDataFile(url, name) {
        return __awaiter(this, void 0, void 0, function() {
          var r, _a, _b, _c, _d;
          return __generator(this, function(_e) {
            switch (_e.label) {
              case 0:
                name = name || url.substring(url.lastIndexOf("/") + 1, url.length);
                if (!!cv.FS.readdir("/").includes(name))
                  return [3, 4];
                return [4, cross_fetch_1.default(url)];
              case 1:
                r = _e.sent();
                _b = (_a = cv.FS).createDataFile;
                _c = ["/", name];
                _d = Uint8ClampedArray.bind;
                return [4, r.arrayBuffer()];
              case 2:
                return [4, _b.apply(_a, _c.concat([new (_d.apply(Uint8ClampedArray, [void 0, _e.sent()]))(), true, false, false]))];
              case 3:
                _e.sent();
                _e.label = 4;
              case 4:
                return [2, name];
            }
          });
        });
      }
      exports2.loadDataFile = loadDataFile;
    }, { "../opencvReady": 12, "cross-fetch": 71 }], 60: [function(require2, module2, exports2) {
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var __1 = require2("..");
      var imageUtil_1 = require2("./imageUtil");
      function grabCut_obsolete(o) {
        return __awaiter(this, void 0, void 0, function() {
          var src, mask, bgdModel, fgdModel, rect, i, j, point1, point2, rgbaImg, image;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, __1.loadOpencv()];
              case 1:
                _a.sent();
                src = o.image.asMat();
                cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
                mask = new cv.Mat();
                bgdModel = new cv.Mat();
                fgdModel = new cv.Mat();
                rect = new cv.Rect(o.x, o.y, o.width, o.height);
                cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
                for (i = 0; i < src.rows; i++) {
                  for (j = 0; j < src.cols; j++) {
                    if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                      src.ucharPtr(i, j)[0] = 0;
                      src.ucharPtr(i, j)[1] = 0;
                      src.ucharPtr(i, j)[2] = 0;
                    }
                  }
                }
                if (o.frameColor) {
                  point1 = new cv.Point(rect.x, rect.y);
                  point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
                  cv.rectangle(src, point1, point2, o.frameColor);
                }
                rgbaImg = imageUtil_1.toRgba(src);
                image = __1.toImageData(rgbaImg);
                mask.delete();
                rgbaImg.delete();
                bgdModel.delete();
                fgdModel.delete();
                return [2, { image }];
            }
          });
        });
      }
      exports2.grabCut_obsolete = grabCut_obsolete;
    }, { "..": 11, "./imageUtil": 61 }], 61: [function(require2, module2, exports2) {
      (function(Buffer2) {
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve2) {
              resolve2(value);
            });
          }
          return new (P || (P = Promise))(function(resolve2, reject2) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject2(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject2(e);
              }
            }
            function step(result) {
              result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        var __generator = this && this.__generator || function(thisArg, body) {
          var _ = { label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
        var file_1 = require2("../file");
        function toImageData(img) {
          return { data: new Uint8ClampedArray(img.data), width: img.cols, height: img.rows };
        }
        exports2.toImageData = toImageData;
        exports2.asImageData = toImageData;
        function isMat(m) {
          return m && typeof m.rows === "number" && typeof m.cols === "number" && typeof m.data === "object" && typeof m.copyTo === "function";
        }
        exports2.isMat = isMat;
        function toRgba(mat, dst) {
          if (dst === void 0) {
            dst = new cv.Mat();
          }
          var depth = mat.type() % 8;
          var scale = depth <= cv.CV_8S ? 1 : depth <= cv.CV_32S ? 1 / 256 : 255;
          var shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128 : 0;
          mat.convertTo(dst, cv.CV_8U, scale, shift);
          switch (dst.type()) {
            case cv.CV_8UC1:
              cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
              break;
            case cv.CV_8UC3:
              cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
              break;
            case cv.CV_8UC4:
              break;
            default:
              throw new Error("Bad number of channels (Source image must have 1, 3 or 4 channels)");
          }
          return dst;
        }
        exports2.toRgba = toRgba;
        function fromFile(f) {
          return __awaiter(this, void 0, void 0, function() {
            var file;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, file_1.File.fromFile(f)];
                case 1:
                  file = _a.sent();
                  return [2, file.asMat()];
              }
            });
          });
        }
        exports2.fromFile = fromFile;
        function fromArrayBuffer(a) {
          return __awaiter(this, void 0, void 0, function() {
            var file;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, file_1.File.fromArrayBuffer(a)];
                case 1:
                  file = _a.sent();
                  return [2, file.asMat()];
              }
            });
          });
        }
        exports2.fromArrayBuffer = fromArrayBuffer;
        function fromUrl(f) {
          return __awaiter(this, void 0, void 0, function() {
            var file;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, file_1.File.fromUrl(f)];
                case 1:
                  file = _a.sent();
                  return [2, file.asMat()];
              }
            });
          });
        }
        exports2.fromUrl = fromUrl;
        function compareL2(f1, f2, destroyBoth) {
          if (destroyBoth === void 0) {
            destroyBoth = false;
          }
          var a = asMat(f1), b = asMat(f2);
          if (a.rows > 0 && a.rows == b.rows && a.cols > 0 && a.cols == a.cols) {
            var errorL2 = cv.norm1(a, b, cv.NORM_L2);
            var similarity = errorL2 / (a.rows * a.cols);
            destroyBoth && del(a, b);
            return similarity;
          } else {
            return 1;
          }
        }
        exports2.compareL2 = compareL2;
        function asMat(f) {
          return file_1.File.isFile(f) ? f.asMat() : f;
        }
        exports2.asMat = asMat;
        function del() {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
          }
          m.filter(function(m2) {
            return !m2.isDeleted();
          }).forEach(function(m2) {
            return m2.delete();
          });
        }
        exports2.del = del;
        function set(m, x, y, val) {
          var c = m.channels();
          var view = m.data;
          for (var i = 0; i < val.length; i++) {
            view[y * c * m.cols + x * c + i] = val[i];
          }
        }
        exports2.set = set;
        function get(m, x, y) {
          var c = m.channels();
          var view = m.data;
          var v = [];
          for (var i = 0; i < c; i++) {
            v.push(view[y * c * m.cols + x * c + i]);
          }
          return v;
        }
        exports2.get = get;
        function map(mat, dst, fn) {
          for (var y = 0; y < mat.rows; y++) {
            for (var x = 0; x < mat.cols; x++) {
              var v = fn(get(mat, x, y), x, y);
              set(dst, x, y, v);
            }
          }
        }
        exports2.map = map;
        var _noArray;
        function noArray() {
          if (!_noArray) {
            _noArray = cv.Mat.ones(0, 0, cv.CV_8U);
          }
          return _noArray;
        }
        exports2.noArray = noArray;
        function pointToSize(p) {
          return new cv.Size(p.x, p.y);
        }
        exports2.pointToSize = pointToSize;
        function sizeToPoint(s2) {
          return new cv.Point(s2.width, s2.height);
        }
        exports2.sizeToPoint = sizeToPoint;
        function isSize(size) {
          return typeof size === "object" && typeof size.width === "number";
        }
        exports2.isSize = isSize;
        function mat2data(m) {
          return { rows: m.rows, cols: m.cols, type: m.type(), data: ab2str(m.data) };
        }
        exports2.mat2data = mat2data;
        function data2mat(d) {
          return cv.matFromArray(d.rows, d.cols, d.type, str2ab(d.data));
        }
        exports2.data2mat = data2mat;
        function isMatData(d) {
          return d && typeof d === "object" && typeof d.rows === "number" && typeof d.cols === "number" && typeof d.type !== "undefined" && Object.keys(d).sort().join(",") === "cols,data,rows,type";
        }
        exports2.isMatData = isMatData;
        var _Buffer = require2("buffer/").Buffer;
        if (misc_utils_of_mine_generic_1.isNode() && typeof _Buffer !== "undefined") {
          _Buffer = Buffer2;
        }
        function ab2str(buf) {
          return _Buffer.from(buf).toString("base64");
        }
        function str2ab(str) {
          return new Uint8Array(_Buffer.from(str, "base64"));
        }
        function jsonStringifyWithMat(s2) {
          return JSON.stringify(s2, function(key, value) {
            if (isMat(value)) {
              return mat2data(value);
            } else {
              return value;
            }
          });
        }
        exports2.jsonStringifyWithMat = jsonStringifyWithMat;
        function jsonParseWithMat(d) {
          return JSON.parse(d, function(key, value) {
            if (isMatData(value)) {
              return data2mat(value);
            } else {
              return value;
            }
          });
        }
        exports2.jsonParseWithMat = jsonParseWithMat;
      }).call(this, require2("buffer").Buffer);
    }, { "../file": 6, buffer: 70, "buffer/": 70, "misc-utils-of-mine-generic": 92 }], 62: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      var __importStar = this && this.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k))
              result[k] = mod[k];
        }
        result["default"] = mod;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var fileUtil_1 = require2("./fileUtil");
      exports2.fileUtil = fileUtil_1.fileUtil;
      exports2.loadDataFile = fileUtil_1.loadDataFile;
      __export(require2("./grabCut"));
      __export(require2("./imageUtil"));
      var file = __importStar(require2("./fileUtil"));
      exports2.file = file;
    }, { "./fileUtil": 59, "./grabCut": 60, "./imageUtil": 61 }], 63: [function(require2, module2, exports2) {
      (function(__dirname) {
        Object.defineProperty(exports2, "__esModule", { value: true });
        var misc_utils_of_mine_generic_1 = require2("misc-utils-of-mine-generic");
        var path_1 = require2("path");
        function buildError(e) {
          console.error(e);
          if (typeof e.stack !== "undefined") {
            console.log((e.stack + "").split("\n").join("\n"));
          }
          return e instanceof Error ? e : new Error(e);
        }
        exports2.buildError = buildError;
        function resolveNodeModule(p) {
          var r = misc_utils_of_mine_generic_1.withoutExtension(path_1.relative(path_1.join(__dirname, ".."), path_1.resolve(p)));
          if (!r.startsWith(".")) {
            r = "./" + r;
          }
          return r;
        }
        exports2.resolveNodeModule = resolveNodeModule;
        function msFrom(t0) {
          return (now() - t0) / 1e6;
        }
        exports2.msFrom = msFrom;
        function timeFrom(t0) {
          return ((now() - t0) / 1e6).toPrecision(1) + " ms";
        }
        exports2.timeFrom = timeFrom;
        var isBrowser = typeof performance !== "undefined" && typeof performance.now === "function";
        function now() {
          return isBrowser ? performance.now() : 0;
        }
        exports2.now = now;
      }).call(this, "/dist/src/util");
    }, { "misc-utils-of-mine-generic": 92, path: 120 }], 64: [function(require2, module2, exports2) {
      (function(global2) {
        var objectAssign = require2("object-assign");
        function compare(a, b) {
          if (a === b) {
            return 0;
          }
          var x = a.length;
          var y = b.length;
          for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
              x = a[i];
              y = b[i];
              break;
            }
          }
          if (x < y) {
            return -1;
          }
          if (y < x) {
            return 1;
          }
          return 0;
        }
        function isBuffer(b) {
          if (global2.Buffer && typeof global2.Buffer.isBuffer === "function") {
            return global2.Buffer.isBuffer(b);
          }
          return !!(b != null && b._isBuffer);
        }
        var util = require2("util/");
        var hasOwn = Object.prototype.hasOwnProperty;
        var pSlice = Array.prototype.slice;
        var functionsHaveNames = function() {
          return function foo() {
          }.name === "foo";
        }();
        function pToString(obj) {
          return Object.prototype.toString.call(obj);
        }
        function isView(arrbuf) {
          if (isBuffer(arrbuf)) {
            return false;
          }
          if (typeof global2.ArrayBuffer !== "function") {
            return false;
          }
          if (typeof ArrayBuffer.isView === "function") {
            return ArrayBuffer.isView(arrbuf);
          }
          if (!arrbuf) {
            return false;
          }
          if (arrbuf instanceof DataView) {
            return true;
          }
          if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
            return true;
          }
          return false;
        }
        var assert = module2.exports = ok;
        var regex = /\s*function\s+([^\(\s]*)\s*/;
        function getName(func) {
          if (!util.isFunction(func)) {
            return;
          }
          if (functionsHaveNames) {
            return func.name;
          }
          var str = func.toString();
          var match = str.match(regex);
          return match && match[1];
        }
        assert.AssertionError = function AssertionError(options) {
          this.name = "AssertionError";
          this.actual = options.actual;
          this.expected = options.expected;
          this.operator = options.operator;
          if (options.message) {
            this.message = options.message;
            this.generatedMessage = false;
          } else {
            this.message = getMessage(this);
            this.generatedMessage = true;
          }
          var stackStartFunction = options.stackStartFunction || fail;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, stackStartFunction);
          } else {
            var err = new Error();
            if (err.stack) {
              var out = err.stack;
              var fn_name = getName(stackStartFunction);
              var idx = out.indexOf("\n" + fn_name);
              if (idx >= 0) {
                var next_line = out.indexOf("\n", idx + 1);
                out = out.substring(next_line + 1);
              }
              this.stack = out;
            }
          }
        };
        util.inherits(assert.AssertionError, Error);
        function truncate(s2, n) {
          if (typeof s2 === "string") {
            return s2.length < n ? s2 : s2.slice(0, n);
          } else {
            return s2;
          }
        }
        function inspect(something) {
          if (functionsHaveNames || !util.isFunction(something)) {
            return util.inspect(something);
          }
          var rawname = getName(something);
          var name = rawname ? ": " + rawname : "";
          return "[Function" + name + "]";
        }
        function getMessage(self2) {
          return truncate(inspect(self2.actual), 128) + " " + self2.operator + " " + truncate(inspect(self2.expected), 128);
        }
        function fail(actual, expected, message, operator, stackStartFunction) {
          throw new assert.AssertionError({ message, actual, expected, operator, stackStartFunction });
        }
        assert.fail = fail;
        function ok(value, message) {
          if (!value)
            fail(value, true, message, "==", assert.ok);
        }
        assert.ok = ok;
        assert.equal = function equal(actual, expected, message) {
          if (actual != expected)
            fail(actual, expected, message, "==", assert.equal);
        };
        assert.notEqual = function notEqual(actual, expected, message) {
          if (actual == expected) {
            fail(actual, expected, message, "!=", assert.notEqual);
          }
        };
        assert.deepEqual = function deepEqual(actual, expected, message) {
          if (!_deepEqual(actual, expected, false)) {
            fail(actual, expected, message, "deepEqual", assert.deepEqual);
          }
        };
        assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
          if (!_deepEqual(actual, expected, true)) {
            fail(actual, expected, message, "deepStrictEqual", assert.deepStrictEqual);
          }
        };
        function _deepEqual(actual, expected, strict2, memos) {
          if (actual === expected) {
            return true;
          } else if (isBuffer(actual) && isBuffer(expected)) {
            return compare(actual, expected) === 0;
          } else if (util.isDate(actual) && util.isDate(expected)) {
            return actual.getTime() === expected.getTime();
          } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
            return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;
          } else if ((actual === null || typeof actual !== "object") && (expected === null || typeof expected !== "object")) {
            return strict2 ? actual === expected : actual == expected;
          } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
            return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0;
          } else if (isBuffer(actual) !== isBuffer(expected)) {
            return false;
          } else {
            memos = memos || { actual: [], expected: [] };
            var actualIndex = memos.actual.indexOf(actual);
            if (actualIndex !== -1) {
              if (actualIndex === memos.expected.indexOf(expected)) {
                return true;
              }
            }
            memos.actual.push(actual);
            memos.expected.push(expected);
            return objEquiv(actual, expected, strict2, memos);
          }
        }
        function isArguments(object) {
          return Object.prototype.toString.call(object) == "[object Arguments]";
        }
        function objEquiv(a, b, strict2, actualVisitedObjects) {
          if (a === null || a === void 0 || b === null || b === void 0)
            return false;
          if (util.isPrimitive(a) || util.isPrimitive(b))
            return a === b;
          if (strict2 && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
            return false;
          var aIsArgs = isArguments(a);
          var bIsArgs = isArguments(b);
          if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs)
            return false;
          if (aIsArgs) {
            a = pSlice.call(a);
            b = pSlice.call(b);
            return _deepEqual(a, b, strict2);
          }
          var ka = objectKeys(a);
          var kb = objectKeys(b);
          var key, i;
          if (ka.length !== kb.length)
            return false;
          ka.sort();
          kb.sort();
          for (i = ka.length - 1; i >= 0; i--) {
            if (ka[i] !== kb[i])
              return false;
          }
          for (i = ka.length - 1; i >= 0; i--) {
            key = ka[i];
            if (!_deepEqual(a[key], b[key], strict2, actualVisitedObjects))
              return false;
          }
          return true;
        }
        assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
          if (_deepEqual(actual, expected, false)) {
            fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
          }
        };
        assert.notDeepStrictEqual = notDeepStrictEqual;
        function notDeepStrictEqual(actual, expected, message) {
          if (_deepEqual(actual, expected, true)) {
            fail(actual, expected, message, "notDeepStrictEqual", notDeepStrictEqual);
          }
        }
        assert.strictEqual = function strictEqual(actual, expected, message) {
          if (actual !== expected) {
            fail(actual, expected, message, "===", assert.strictEqual);
          }
        };
        assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
          if (actual === expected) {
            fail(actual, expected, message, "!==", assert.notStrictEqual);
          }
        };
        function expectedException(actual, expected) {
          if (!actual || !expected) {
            return false;
          }
          if (Object.prototype.toString.call(expected) == "[object RegExp]") {
            return expected.test(actual);
          }
          try {
            if (actual instanceof expected) {
              return true;
            }
          } catch (e) {
          }
          if (Error.isPrototypeOf(expected)) {
            return false;
          }
          return expected.call({}, actual) === true;
        }
        function _tryBlock(block) {
          var error;
          try {
            block();
          } catch (e) {
            error = e;
          }
          return error;
        }
        function _throws(shouldThrow, block, expected, message) {
          var actual;
          if (typeof block !== "function") {
            throw new TypeError('"block" argument must be a function');
          }
          if (typeof expected === "string") {
            message = expected;
            expected = null;
          }
          actual = _tryBlock(block);
          message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : ".");
          if (shouldThrow && !actual) {
            fail(actual, expected, "Missing expected exception" + message);
          }
          var userProvidedMessage = typeof message === "string";
          var isUnwantedException = !shouldThrow && util.isError(actual);
          var isUnexpectedException = !shouldThrow && actual && !expected;
          if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
            fail(actual, expected, "Got unwanted exception" + message);
          }
          if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
            throw actual;
          }
        }
        assert.throws = function(block, error, message) {
          _throws(true, block, error, message);
        };
        assert.doesNotThrow = function(block, error, message) {
          _throws(false, block, error, message);
        };
        assert.ifError = function(err) {
          if (err)
            throw err;
        };
        function strict(value, message) {
          if (!value)
            fail(value, true, message, "==", strict);
        }
        assert.strict = objectAssign(strict, assert, { equal: assert.strictEqual, deepEqual: assert.deepStrictEqual, notEqual: assert.notStrictEqual, notDeepEqual: assert.notDeepStrictEqual });
        assert.strict.strict = assert.strict;
        var objectKeys = Object.keys || function(obj) {
          var keys = [];
          for (var key in obj) {
            if (hasOwn.call(obj, key))
              keys.push(key);
          }
          return keys;
        };
      }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "object-assign": 119, "util/": 67 }], 65: [function(require2, module2, exports2) {
      if (typeof Object.create === "function") {
        module2.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, { constructor: { value: ctor, enumerable: false, writable: true, configurable: true } });
        };
      } else {
        module2.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}], 66: [function(require2, module2, exports2) {
      module2.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }, {}], 67: [function(require2, module2, exports2) {
      (function(process, global2) {
        var formatRegExp = /%[sdj%]/g;
        exports2.format = function(f) {
          if (!isString(f)) {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {
              objects.push(inspect(arguments[i]));
            }
            return objects.join(" ");
          }
          var i = 1;
          var args = arguments;
          var len = args.length;
          var str = String(f).replace(formatRegExp, function(x2) {
            if (x2 === "%%")
              return "%";
            if (i >= len)
              return x2;
            switch (x2) {
              case "%s":
                return String(args[i++]);
              case "%d":
                return Number(args[i++]);
              case "%j":
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return "[Circular]";
                }
              default:
                return x2;
            }
          });
          for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
              str += " " + x;
            } else {
              str += " " + inspect(x);
            }
          }
          return str;
        };
        exports2.deprecate = function(fn, msg) {
          if (isUndefined(global2.process)) {
            return function() {
              return exports2.deprecate(fn, msg).apply(this, arguments);
            };
          }
          if (process.noDeprecation === true) {
            return fn;
          }
          var warned = false;
          function deprecated() {
            if (!warned) {
              if (process.throwDeprecation) {
                throw new Error(msg);
              } else if (process.traceDeprecation) {
                console.trace(msg);
              } else {
                console.error(msg);
              }
              warned = true;
            }
            return fn.apply(this, arguments);
          }
          return deprecated;
        };
        var debugs = {};
        var debugEnviron;
        exports2.debuglog = function(set) {
          if (isUndefined(debugEnviron))
            debugEnviron = "";
          set = set.toUpperCase();
          if (!debugs[set]) {
            if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
              var pid = process.pid;
              debugs[set] = function() {
                var msg = exports2.format.apply(exports2, arguments);
                console.error("%s %d: %s", set, pid, msg);
              };
            } else {
              debugs[set] = function() {
              };
            }
          }
          return debugs[set];
        };
        function inspect(obj, opts) {
          var ctx = { seen: [], stylize: stylizeNoColor };
          if (arguments.length >= 3)
            ctx.depth = arguments[2];
          if (arguments.length >= 4)
            ctx.colors = arguments[3];
          if (isBoolean(opts)) {
            ctx.showHidden = opts;
          } else if (opts) {
            exports2._extend(ctx, opts);
          }
          if (isUndefined(ctx.showHidden))
            ctx.showHidden = false;
          if (isUndefined(ctx.depth))
            ctx.depth = 2;
          if (isUndefined(ctx.colors))
            ctx.colors = false;
          if (isUndefined(ctx.customInspect))
            ctx.customInspect = true;
          if (ctx.colors)
            ctx.stylize = stylizeWithColor;
          return formatValue(ctx, obj, ctx.depth);
        }
        exports2.inspect = inspect;
        inspect.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] };
        inspect.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" };
        function stylizeWithColor(str, styleType) {
          var style = inspect.styles[styleType];
          if (style) {
            return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m";
          } else {
            return str;
          }
        }
        function stylizeNoColor(str, styleType) {
          return str;
        }
        function arrayToHash(array) {
          var hash = {};
          array.forEach(function(val, idx) {
            hash[val] = true;
          });
          return hash;
        }
        function formatValue(ctx, value, recurseTimes) {
          if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports2.inspect && !(value.constructor && value.constructor.prototype === value)) {
            var ret = value.inspect(recurseTimes, ctx);
            if (!isString(ret)) {
              ret = formatValue(ctx, ret, recurseTimes);
            }
            return ret;
          }
          var primitive = formatPrimitive(ctx, value);
          if (primitive) {
            return primitive;
          }
          var keys = Object.keys(value);
          var visibleKeys = arrayToHash(keys);
          if (ctx.showHidden) {
            keys = Object.getOwnPropertyNames(value);
          }
          if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
            return formatError(value);
          }
          if (keys.length === 0) {
            if (isFunction(value)) {
              var name = value.name ? ": " + value.name : "";
              return ctx.stylize("[Function" + name + "]", "special");
            }
            if (isRegExp(value)) {
              return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
            }
            if (isDate(value)) {
              return ctx.stylize(Date.prototype.toString.call(value), "date");
            }
            if (isError(value)) {
              return formatError(value);
            }
          }
          var base = "", array = false, braces = ["{", "}"];
          if (isArray(value)) {
            array = true;
            braces = ["[", "]"];
          }
          if (isFunction(value)) {
            var n = value.name ? ": " + value.name : "";
            base = " [Function" + n + "]";
          }
          if (isRegExp(value)) {
            base = " " + RegExp.prototype.toString.call(value);
          }
          if (isDate(value)) {
            base = " " + Date.prototype.toUTCString.call(value);
          }
          if (isError(value)) {
            base = " " + formatError(value);
          }
          if (keys.length === 0 && (!array || value.length == 0)) {
            return braces[0] + base + braces[1];
          }
          if (recurseTimes < 0) {
            if (isRegExp(value)) {
              return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
            } else {
              return ctx.stylize("[Object]", "special");
            }
          }
          ctx.seen.push(value);
          var output;
          if (array) {
            output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
          } else {
            output = keys.map(function(key) {
              return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
            });
          }
          ctx.seen.pop();
          return reduceToSingleString(output, base, braces);
        }
        function formatPrimitive(ctx, value) {
          if (isUndefined(value))
            return ctx.stylize("undefined", "undefined");
          if (isString(value)) {
            var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
            return ctx.stylize(simple, "string");
          }
          if (isNumber(value))
            return ctx.stylize("" + value, "number");
          if (isBoolean(value))
            return ctx.stylize("" + value, "boolean");
          if (isNull(value))
            return ctx.stylize("null", "null");
        }
        function formatError(value) {
          return "[" + Error.prototype.toString.call(value) + "]";
        }
        function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
          var output = [];
          for (var i = 0, l = value.length; i < l; ++i) {
            if (hasOwnProperty(value, String(i))) {
              output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
            } else {
              output.push("");
            }
          }
          keys.forEach(function(key) {
            if (!key.match(/^\d+$/)) {
              output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
            }
          });
          return output;
        }
        function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
          var name, str, desc;
          desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
          if (desc.get) {
            if (desc.set) {
              str = ctx.stylize("[Getter/Setter]", "special");
            } else {
              str = ctx.stylize("[Getter]", "special");
            }
          } else {
            if (desc.set) {
              str = ctx.stylize("[Setter]", "special");
            }
          }
          if (!hasOwnProperty(visibleKeys, key)) {
            name = "[" + key + "]";
          }
          if (!str) {
            if (ctx.seen.indexOf(desc.value) < 0) {
              if (isNull(recurseTimes)) {
                str = formatValue(ctx, desc.value, null);
              } else {
                str = formatValue(ctx, desc.value, recurseTimes - 1);
              }
              if (str.indexOf("\n") > -1) {
                if (array) {
                  str = str.split("\n").map(function(line) {
                    return "  " + line;
                  }).join("\n").substr(2);
                } else {
                  str = "\n" + str.split("\n").map(function(line) {
                    return "   " + line;
                  }).join("\n");
                }
              }
            } else {
              str = ctx.stylize("[Circular]", "special");
            }
          }
          if (isUndefined(name)) {
            if (array && key.match(/^\d+$/)) {
              return str;
            }
            name = JSON.stringify("" + key);
            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
              name = name.substr(1, name.length - 2);
              name = ctx.stylize(name, "name");
            } else {
              name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
              name = ctx.stylize(name, "string");
            }
          }
          return name + ": " + str;
        }
        function reduceToSingleString(output, base, braces) {
          var length = output.reduce(function(prev, cur) {
            if (cur.indexOf("\n") >= 0)
              ;
            return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
          }, 0);
          if (length > 60) {
            return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
          }
          return braces[0] + base + " " + output.join(", ") + " " + braces[1];
        }
        function isArray(ar) {
          return Array.isArray(ar);
        }
        exports2.isArray = isArray;
        function isBoolean(arg) {
          return typeof arg === "boolean";
        }
        exports2.isBoolean = isBoolean;
        function isNull(arg) {
          return arg === null;
        }
        exports2.isNull = isNull;
        function isNullOrUndefined(arg) {
          return arg == null;
        }
        exports2.isNullOrUndefined = isNullOrUndefined;
        function isNumber(arg) {
          return typeof arg === "number";
        }
        exports2.isNumber = isNumber;
        function isString(arg) {
          return typeof arg === "string";
        }
        exports2.isString = isString;
        function isSymbol(arg) {
          return typeof arg === "symbol";
        }
        exports2.isSymbol = isSymbol;
        function isUndefined(arg) {
          return arg === void 0;
        }
        exports2.isUndefined = isUndefined;
        function isRegExp(re) {
          return isObject(re) && objectToString(re) === "[object RegExp]";
        }
        exports2.isRegExp = isRegExp;
        function isObject(arg) {
          return typeof arg === "object" && arg !== null;
        }
        exports2.isObject = isObject;
        function isDate(d) {
          return isObject(d) && objectToString(d) === "[object Date]";
        }
        exports2.isDate = isDate;
        function isError(e) {
          return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
        }
        exports2.isError = isError;
        function isFunction(arg) {
          return typeof arg === "function";
        }
        exports2.isFunction = isFunction;
        function isPrimitive(arg) {
          return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
        }
        exports2.isPrimitive = isPrimitive;
        exports2.isBuffer = require2("./support/isBuffer");
        function objectToString(o) {
          return Object.prototype.toString.call(o);
        }
        function pad(n) {
          return n < 10 ? "0" + n.toString(10) : n.toString(10);
        }
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        function timestamp() {
          var d = new Date();
          var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
          return [d.getDate(), months[d.getMonth()], time].join(" ");
        }
        exports2.log = function() {
          console.log("%s - %s", timestamp(), exports2.format.apply(exports2, arguments));
        };
        exports2.inherits = require2("inherits");
        exports2._extend = function(origin, add) {
          if (!add || !isObject(add))
            return origin;
          var keys = Object.keys(add);
          var i = keys.length;
          while (i--) {
            origin[keys[i]] = add[keys[i]];
          }
          return origin;
        };
        function hasOwnProperty(obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        }
      }).call(this, require2("_process"), typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./support/isBuffer": 66, _process: 121, inherits: 65 }], 68: [function(require2, module2, exports2) {
      exports2.byteLength = byteLength;
      exports2.toByteArray = toByteArray;
      exports2.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1)
          validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
        }
        return parts.join("");
      }
    }, {}], 69: [function(require2, module2, exports2) {
    }, {}], 70: [function(require2, module2, exports2) {
      (function(Buffer2) {
        var base64 = require2("base64-js");
        var ieee754 = require2("ieee754");
        var customInspectSymbol = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
        exports2.Buffer = Buffer2;
        exports2.SlowBuffer = SlowBuffer;
        exports2.INSPECT_MAX_BYTES = 50;
        var K_MAX_LENGTH = 2147483647;
        exports2.kMaxLength = K_MAX_LENGTH;
        Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
        if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
          console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
        }
        function typedArraySupport() {
          try {
            var arr = new Uint8Array(1);
            var proto = { foo: function() {
              return 42;
            } };
            Object.setPrototypeOf(proto, Uint8Array.prototype);
            Object.setPrototypeOf(arr, proto);
            return arr.foo() === 42;
          } catch (e) {
            return false;
          }
        }
        Object.defineProperty(Buffer2.prototype, "parent", { enumerable: true, get: function() {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.buffer;
        } });
        Object.defineProperty(Buffer2.prototype, "offset", { enumerable: true, get: function() {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.byteOffset;
        } });
        function createBuffer(length) {
          if (length > K_MAX_LENGTH) {
            throw new RangeError('The value "' + length + '" is invalid for option "size"');
          }
          var buf = new Uint8Array(length);
          Object.setPrototypeOf(buf, Buffer2.prototype);
          return buf;
        }
        function Buffer2(arg, encodingOrOffset, length) {
          if (typeof arg === "number") {
            if (typeof encodingOrOffset === "string") {
              throw new TypeError('The "string" argument must be of type string. Received type number');
            }
            return allocUnsafe(arg);
          }
          return from(arg, encodingOrOffset, length);
        }
        if (typeof Symbol !== "undefined" && Symbol.species != null && Buffer2[Symbol.species] === Buffer2) {
          Object.defineProperty(Buffer2, Symbol.species, { value: null, configurable: true, enumerable: false, writable: false });
        }
        Buffer2.poolSize = 8192;
        function from(value, encodingOrOffset, length) {
          if (typeof value === "string") {
            return fromString(value, encodingOrOffset);
          }
          if (ArrayBuffer.isView(value)) {
            return fromArrayLike(value);
          }
          if (value == null) {
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
          }
          if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
            return fromArrayBuffer(value, encodingOrOffset, length);
          }
          if (typeof value === "number") {
            throw new TypeError('The "value" argument must not be of type number. Received type number');
          }
          var valueOf = value.valueOf && value.valueOf();
          if (valueOf != null && valueOf !== value) {
            return Buffer2.from(valueOf, encodingOrOffset, length);
          }
          var b = fromObject(value);
          if (b)
            return b;
          if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
            return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
          }
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
        }
        Buffer2.from = function(value, encodingOrOffset, length) {
          return from(value, encodingOrOffset, length);
        };
        Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
        Object.setPrototypeOf(Buffer2, Uint8Array);
        function assertSize(size) {
          if (typeof size !== "number") {
            throw new TypeError('"size" argument must be of type number');
          } else if (size < 0) {
            throw new RangeError('The value "' + size + '" is invalid for option "size"');
          }
        }
        function alloc(size, fill, encoding) {
          assertSize(size);
          if (size <= 0) {
            return createBuffer(size);
          }
          if (fill !== void 0) {
            return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
          }
          return createBuffer(size);
        }
        Buffer2.alloc = function(size, fill, encoding) {
          return alloc(size, fill, encoding);
        };
        function allocUnsafe(size) {
          assertSize(size);
          return createBuffer(size < 0 ? 0 : checked(size) | 0);
        }
        Buffer2.allocUnsafe = function(size) {
          return allocUnsafe(size);
        };
        Buffer2.allocUnsafeSlow = function(size) {
          return allocUnsafe(size);
        };
        function fromString(string, encoding) {
          if (typeof encoding !== "string" || encoding === "") {
            encoding = "utf8";
          }
          if (!Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          var length = byteLength(string, encoding) | 0;
          var buf = createBuffer(length);
          var actual = buf.write(string, encoding);
          if (actual !== length) {
            buf = buf.slice(0, actual);
          }
          return buf;
        }
        function fromArrayLike(array) {
          var length = array.length < 0 ? 0 : checked(array.length) | 0;
          var buf = createBuffer(length);
          for (var i = 0; i < length; i += 1) {
            buf[i] = array[i] & 255;
          }
          return buf;
        }
        function fromArrayBuffer(array, byteOffset, length) {
          if (byteOffset < 0 || array.byteLength < byteOffset) {
            throw new RangeError('"offset" is outside of buffer bounds');
          }
          if (array.byteLength < byteOffset + (length || 0)) {
            throw new RangeError('"length" is outside of buffer bounds');
          }
          var buf;
          if (byteOffset === void 0 && length === void 0) {
            buf = new Uint8Array(array);
          } else if (length === void 0) {
            buf = new Uint8Array(array, byteOffset);
          } else {
            buf = new Uint8Array(array, byteOffset, length);
          }
          Object.setPrototypeOf(buf, Buffer2.prototype);
          return buf;
        }
        function fromObject(obj) {
          if (Buffer2.isBuffer(obj)) {
            var len = checked(obj.length) | 0;
            var buf = createBuffer(len);
            if (buf.length === 0) {
              return buf;
            }
            obj.copy(buf, 0, 0, len);
            return buf;
          }
          if (obj.length !== void 0) {
            if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
              return createBuffer(0);
            }
            return fromArrayLike(obj);
          }
          if (obj.type === "Buffer" && Array.isArray(obj.data)) {
            return fromArrayLike(obj.data);
          }
        }
        function checked(length) {
          if (length >= K_MAX_LENGTH) {
            throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
          }
          return length | 0;
        }
        function SlowBuffer(length) {
          if (+length != length) {
            length = 0;
          }
          return Buffer2.alloc(+length);
        }
        Buffer2.isBuffer = function isBuffer(b) {
          return b != null && b._isBuffer === true && b !== Buffer2.prototype;
        };
        Buffer2.compare = function compare(a, b) {
          if (isInstance(a, Uint8Array))
            a = Buffer2.from(a, a.offset, a.byteLength);
          if (isInstance(b, Uint8Array))
            b = Buffer2.from(b, b.offset, b.byteLength);
          if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
            throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
          }
          if (a === b)
            return 0;
          var x = a.length;
          var y = b.length;
          for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
              x = a[i];
              y = b[i];
              break;
            }
          }
          if (x < y)
            return -1;
          if (y < x)
            return 1;
          return 0;
        };
        Buffer2.isEncoding = function isEncoding(encoding) {
          switch (String(encoding).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        };
        Buffer2.concat = function concat(list, length) {
          if (!Array.isArray(list)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          }
          if (list.length === 0) {
            return Buffer2.alloc(0);
          }
          var i;
          if (length === void 0) {
            length = 0;
            for (i = 0; i < list.length; ++i) {
              length += list[i].length;
            }
          }
          var buffer = Buffer2.allocUnsafe(length);
          var pos = 0;
          for (i = 0; i < list.length; ++i) {
            var buf = list[i];
            if (isInstance(buf, Uint8Array)) {
              buf = Buffer2.from(buf);
            }
            if (!Buffer2.isBuffer(buf)) {
              throw new TypeError('"list" argument must be an Array of Buffers');
            }
            buf.copy(buffer, pos);
            pos += buf.length;
          }
          return buffer;
        };
        function byteLength(string, encoding) {
          if (Buffer2.isBuffer(string)) {
            return string.length;
          }
          if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
            return string.byteLength;
          }
          if (typeof string !== "string") {
            throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
          }
          var len = string.length;
          var mustMatch = arguments.length > 2 && arguments[2] === true;
          if (!mustMatch && len === 0)
            return 0;
          var loweredCase = false;
          for (; ; ) {
            switch (encoding) {
              case "ascii":
              case "latin1":
              case "binary":
                return len;
              case "utf8":
              case "utf-8":
                return utf8ToBytes(string).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return len * 2;
              case "hex":
                return len >>> 1;
              case "base64":
                return base64ToBytes(string).length;
              default:
                if (loweredCase) {
                  return mustMatch ? -1 : utf8ToBytes(string).length;
                }
                encoding = ("" + encoding).toLowerCase();
                loweredCase = true;
            }
          }
        }
        Buffer2.byteLength = byteLength;
        function slowToString(encoding, start, end) {
          var loweredCase = false;
          if (start === void 0 || start < 0) {
            start = 0;
          }
          if (start > this.length) {
            return "";
          }
          if (end === void 0 || end > this.length) {
            end = this.length;
          }
          if (end <= 0) {
            return "";
          }
          end >>>= 0;
          start >>>= 0;
          if (end <= start) {
            return "";
          }
          if (!encoding)
            encoding = "utf8";
          while (true) {
            switch (encoding) {
              case "hex":
                return hexSlice(this, start, end);
              case "utf8":
              case "utf-8":
                return utf8Slice(this, start, end);
              case "ascii":
                return asciiSlice(this, start, end);
              case "latin1":
              case "binary":
                return latin1Slice(this, start, end);
              case "base64":
                return base64Slice(this, start, end);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return utf16leSlice(this, start, end);
              default:
                if (loweredCase)
                  throw new TypeError("Unknown encoding: " + encoding);
                encoding = (encoding + "").toLowerCase();
                loweredCase = true;
            }
          }
        }
        Buffer2.prototype._isBuffer = true;
        function swap(b, n, m) {
          var i = b[n];
          b[n] = b[m];
          b[m] = i;
        }
        Buffer2.prototype.swap16 = function swap16() {
          var len = this.length;
          if (len % 2 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 16-bits");
          }
          for (var i = 0; i < len; i += 2) {
            swap(this, i, i + 1);
          }
          return this;
        };
        Buffer2.prototype.swap32 = function swap32() {
          var len = this.length;
          if (len % 4 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 32-bits");
          }
          for (var i = 0; i < len; i += 4) {
            swap(this, i, i + 3);
            swap(this, i + 1, i + 2);
          }
          return this;
        };
        Buffer2.prototype.swap64 = function swap64() {
          var len = this.length;
          if (len % 8 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 64-bits");
          }
          for (var i = 0; i < len; i += 8) {
            swap(this, i, i + 7);
            swap(this, i + 1, i + 6);
            swap(this, i + 2, i + 5);
            swap(this, i + 3, i + 4);
          }
          return this;
        };
        Buffer2.prototype.toString = function toString() {
          var length = this.length;
          if (length === 0)
            return "";
          if (arguments.length === 0)
            return utf8Slice(this, 0, length);
          return slowToString.apply(this, arguments);
        };
        Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
        Buffer2.prototype.equals = function equals(b) {
          if (!Buffer2.isBuffer(b))
            throw new TypeError("Argument must be a Buffer");
          if (this === b)
            return true;
          return Buffer2.compare(this, b) === 0;
        };
        Buffer2.prototype.inspect = function inspect() {
          var str = "";
          var max = exports2.INSPECT_MAX_BYTES;
          str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
          if (this.length > max)
            str += " ... ";
          return "<Buffer " + str + ">";
        };
        if (customInspectSymbol) {
          Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
        }
        Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
          if (isInstance(target, Uint8Array)) {
            target = Buffer2.from(target, target.offset, target.byteLength);
          }
          if (!Buffer2.isBuffer(target)) {
            throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
          }
          if (start === void 0) {
            start = 0;
          }
          if (end === void 0) {
            end = target ? target.length : 0;
          }
          if (thisStart === void 0) {
            thisStart = 0;
          }
          if (thisEnd === void 0) {
            thisEnd = this.length;
          }
          if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
            throw new RangeError("out of range index");
          }
          if (thisStart >= thisEnd && start >= end) {
            return 0;
          }
          if (thisStart >= thisEnd) {
            return -1;
          }
          if (start >= end) {
            return 1;
          }
          start >>>= 0;
          end >>>= 0;
          thisStart >>>= 0;
          thisEnd >>>= 0;
          if (this === target)
            return 0;
          var x = thisEnd - thisStart;
          var y = end - start;
          var len = Math.min(x, y);
          var thisCopy = this.slice(thisStart, thisEnd);
          var targetCopy = target.slice(start, end);
          for (var i = 0; i < len; ++i) {
            if (thisCopy[i] !== targetCopy[i]) {
              x = thisCopy[i];
              y = targetCopy[i];
              break;
            }
          }
          if (x < y)
            return -1;
          if (y < x)
            return 1;
          return 0;
        };
        function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
          if (buffer.length === 0)
            return -1;
          if (typeof byteOffset === "string") {
            encoding = byteOffset;
            byteOffset = 0;
          } else if (byteOffset > 2147483647) {
            byteOffset = 2147483647;
          } else if (byteOffset < -2147483648) {
            byteOffset = -2147483648;
          }
          byteOffset = +byteOffset;
          if (numberIsNaN(byteOffset)) {
            byteOffset = dir ? 0 : buffer.length - 1;
          }
          if (byteOffset < 0)
            byteOffset = buffer.length + byteOffset;
          if (byteOffset >= buffer.length) {
            if (dir)
              return -1;
            else
              byteOffset = buffer.length - 1;
          } else if (byteOffset < 0) {
            if (dir)
              byteOffset = 0;
            else
              return -1;
          }
          if (typeof val === "string") {
            val = Buffer2.from(val, encoding);
          }
          if (Buffer2.isBuffer(val)) {
            if (val.length === 0) {
              return -1;
            }
            return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
          } else if (typeof val === "number") {
            val = val & 255;
            if (typeof Uint8Array.prototype.indexOf === "function") {
              if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
              } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
              }
            }
            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
          }
          throw new TypeError("val must be string, number or Buffer");
        }
        function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
          var indexSize = 1;
          var arrLength = arr.length;
          var valLength = val.length;
          if (encoding !== void 0) {
            encoding = String(encoding).toLowerCase();
            if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
              if (arr.length < 2 || val.length < 2) {
                return -1;
              }
              indexSize = 2;
              arrLength /= 2;
              valLength /= 2;
              byteOffset /= 2;
            }
          }
          function read(buf, i2) {
            if (indexSize === 1) {
              return buf[i2];
            } else {
              return buf.readUInt16BE(i2 * indexSize);
            }
          }
          var i;
          if (dir) {
            var foundIndex = -1;
            for (i = byteOffset; i < arrLength; i++) {
              if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1)
                  foundIndex = i;
                if (i - foundIndex + 1 === valLength)
                  return foundIndex * indexSize;
              } else {
                if (foundIndex !== -1)
                  i -= i - foundIndex;
                foundIndex = -1;
              }
            }
          } else {
            if (byteOffset + valLength > arrLength)
              byteOffset = arrLength - valLength;
            for (i = byteOffset; i >= 0; i--) {
              var found = true;
              for (var j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val, j)) {
                  found = false;
                  break;
                }
              }
              if (found)
                return i;
            }
          }
          return -1;
        }
        Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
          return this.indexOf(val, byteOffset, encoding) !== -1;
        };
        Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
        };
        Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
        };
        function hexWrite(buf, string, offset, length) {
          offset = Number(offset) || 0;
          var remaining = buf.length - offset;
          if (!length) {
            length = remaining;
          } else {
            length = Number(length);
            if (length > remaining) {
              length = remaining;
            }
          }
          var strLen = string.length;
          if (length > strLen / 2) {
            length = strLen / 2;
          }
          for (var i = 0; i < length; ++i) {
            var parsed = parseInt(string.substr(i * 2, 2), 16);
            if (numberIsNaN(parsed))
              return i;
            buf[offset + i] = parsed;
          }
          return i;
        }
        function utf8Write(buf, string, offset, length) {
          return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
        }
        function asciiWrite(buf, string, offset, length) {
          return blitBuffer(asciiToBytes(string), buf, offset, length);
        }
        function latin1Write(buf, string, offset, length) {
          return asciiWrite(buf, string, offset, length);
        }
        function base64Write(buf, string, offset, length) {
          return blitBuffer(base64ToBytes(string), buf, offset, length);
        }
        function ucs2Write(buf, string, offset, length) {
          return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
        }
        Buffer2.prototype.write = function write(string, offset, length, encoding) {
          if (offset === void 0) {
            encoding = "utf8";
            length = this.length;
            offset = 0;
          } else if (length === void 0 && typeof offset === "string") {
            encoding = offset;
            length = this.length;
            offset = 0;
          } else if (isFinite(offset)) {
            offset = offset >>> 0;
            if (isFinite(length)) {
              length = length >>> 0;
              if (encoding === void 0)
                encoding = "utf8";
            } else {
              encoding = length;
              length = void 0;
            }
          } else {
            throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          }
          var remaining = this.length - offset;
          if (length === void 0 || length > remaining)
            length = remaining;
          if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
            throw new RangeError("Attempt to write outside buffer bounds");
          }
          if (!encoding)
            encoding = "utf8";
          var loweredCase = false;
          for (; ; ) {
            switch (encoding) {
              case "hex":
                return hexWrite(this, string, offset, length);
              case "utf8":
              case "utf-8":
                return utf8Write(this, string, offset, length);
              case "ascii":
                return asciiWrite(this, string, offset, length);
              case "latin1":
              case "binary":
                return latin1Write(this, string, offset, length);
              case "base64":
                return base64Write(this, string, offset, length);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return ucs2Write(this, string, offset, length);
              default:
                if (loweredCase)
                  throw new TypeError("Unknown encoding: " + encoding);
                encoding = ("" + encoding).toLowerCase();
                loweredCase = true;
            }
          }
        };
        Buffer2.prototype.toJSON = function toJSON() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        };
        function base64Slice(buf, start, end) {
          if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf);
          } else {
            return base64.fromByteArray(buf.slice(start, end));
          }
        }
        function utf8Slice(buf, start, end) {
          end = Math.min(buf.length, end);
          var res = [];
          var i = start;
          while (i < end) {
            var firstByte = buf[i];
            var codePoint = null;
            var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
            if (i + bytesPerSequence <= end) {
              var secondByte, thirdByte, fourthByte, tempCodePoint;
              switch (bytesPerSequence) {
                case 1:
                  if (firstByte < 128) {
                    codePoint = firstByte;
                  }
                  break;
                case 2:
                  secondByte = buf[i + 1];
                  if ((secondByte & 192) === 128) {
                    tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                    if (tempCodePoint > 127) {
                      codePoint = tempCodePoint;
                    }
                  }
                  break;
                case 3:
                  secondByte = buf[i + 1];
                  thirdByte = buf[i + 2];
                  if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                    tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                    if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                      codePoint = tempCodePoint;
                    }
                  }
                  break;
                case 4:
                  secondByte = buf[i + 1];
                  thirdByte = buf[i + 2];
                  fourthByte = buf[i + 3];
                  if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                    tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                    if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                      codePoint = tempCodePoint;
                    }
                  }
              }
            }
            if (codePoint === null) {
              codePoint = 65533;
              bytesPerSequence = 1;
            } else if (codePoint > 65535) {
              codePoint -= 65536;
              res.push(codePoint >>> 10 & 1023 | 55296);
              codePoint = 56320 | codePoint & 1023;
            }
            res.push(codePoint);
            i += bytesPerSequence;
          }
          return decodeCodePointsArray(res);
        }
        var MAX_ARGUMENTS_LENGTH = 4096;
        function decodeCodePointsArray(codePoints) {
          var len = codePoints.length;
          if (len <= MAX_ARGUMENTS_LENGTH) {
            return String.fromCharCode.apply(String, codePoints);
          }
          var res = "";
          var i = 0;
          while (i < len) {
            res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
          }
          return res;
        }
        function asciiSlice(buf, start, end) {
          var ret = "";
          end = Math.min(buf.length, end);
          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i] & 127);
          }
          return ret;
        }
        function latin1Slice(buf, start, end) {
          var ret = "";
          end = Math.min(buf.length, end);
          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i]);
          }
          return ret;
        }
        function hexSlice(buf, start, end) {
          var len = buf.length;
          if (!start || start < 0)
            start = 0;
          if (!end || end < 0 || end > len)
            end = len;
          var out = "";
          for (var i = start; i < end; ++i) {
            out += hexSliceLookupTable[buf[i]];
          }
          return out;
        }
        function utf16leSlice(buf, start, end) {
          var bytes = buf.slice(start, end);
          var res = "";
          for (var i = 0; i < bytes.length; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
          }
          return res;
        }
        Buffer2.prototype.slice = function slice(start, end) {
          var len = this.length;
          start = ~~start;
          end = end === void 0 ? len : ~~end;
          if (start < 0) {
            start += len;
            if (start < 0)
              start = 0;
          } else if (start > len) {
            start = len;
          }
          if (end < 0) {
            end += len;
            if (end < 0)
              end = 0;
          } else if (end > len) {
            end = len;
          }
          if (end < start)
            end = start;
          var newBuf = this.subarray(start, end);
          Object.setPrototypeOf(newBuf, Buffer2.prototype);
          return newBuf;
        };
        function checkOffset(offset, ext, length) {
          if (offset % 1 !== 0 || offset < 0)
            throw new RangeError("offset is not uint");
          if (offset + ext > length)
            throw new RangeError("Trying to access beyond buffer length");
        }
        Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength2, this.length);
          var val = this[offset];
          var mul = 1;
          var i = 0;
          while (++i < byteLength2 && (mul *= 256)) {
            val += this[offset + i] * mul;
          }
          return val;
        };
        Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert) {
            checkOffset(offset, byteLength2, this.length);
          }
          var val = this[offset + --byteLength2];
          var mul = 1;
          while (byteLength2 > 0 && (mul *= 256)) {
            val += this[offset + --byteLength2] * mul;
          }
          return val;
        };
        Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 1, this.length);
          return this[offset];
        };
        Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          return this[offset] | this[offset + 1] << 8;
        };
        Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          return this[offset] << 8 | this[offset + 1];
        };
        Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
        };
        Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
        };
        Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength2, this.length);
          var val = this[offset];
          var mul = 1;
          var i = 0;
          while (++i < byteLength2 && (mul *= 256)) {
            val += this[offset + i] * mul;
          }
          mul *= 128;
          if (val >= mul)
            val -= Math.pow(2, 8 * byteLength2);
          return val;
        };
        Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength2, this.length);
          var i = byteLength2;
          var mul = 1;
          var val = this[offset + --i];
          while (i > 0 && (mul *= 256)) {
            val += this[offset + --i] * mul;
          }
          mul *= 128;
          if (val >= mul)
            val -= Math.pow(2, 8 * byteLength2);
          return val;
        };
        Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 1, this.length);
          if (!(this[offset] & 128))
            return this[offset];
          return (255 - this[offset] + 1) * -1;
        };
        Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          var val = this[offset] | this[offset + 1] << 8;
          return val & 32768 ? val | 4294901760 : val;
        };
        Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          var val = this[offset + 1] | this[offset] << 8;
          return val & 32768 ? val | 4294901760 : val;
        };
        Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
        };
        Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
        };
        Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return ieee754.read(this, offset, true, 23, 4);
        };
        Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return ieee754.read(this, offset, false, 23, 4);
        };
        Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 8, this.length);
          return ieee754.read(this, offset, true, 52, 8);
        };
        Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
          offset = offset >>> 0;
          if (!noAssert)
            checkOffset(offset, 8, this.length);
          return ieee754.read(this, offset, false, 52, 8);
        };
        function checkInt(buf, value, offset, ext, max, min) {
          if (!Buffer2.isBuffer(buf))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (value > max || value < min)
            throw new RangeError('"value" argument is out of bounds');
          if (offset + ext > buf.length)
            throw new RangeError("Index out of range");
        }
        Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
          value = +value;
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
            checkInt(this, value, offset, byteLength2, maxBytes, 0);
          }
          var mul = 1;
          var i = 0;
          this[offset] = value & 255;
          while (++i < byteLength2 && (mul *= 256)) {
            this[offset + i] = value / mul & 255;
          }
          return offset + byteLength2;
        };
        Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
          value = +value;
          offset = offset >>> 0;
          byteLength2 = byteLength2 >>> 0;
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
            checkInt(this, value, offset, byteLength2, maxBytes, 0);
          }
          var i = byteLength2 - 1;
          var mul = 1;
          this[offset + i] = value & 255;
          while (--i >= 0 && (mul *= 256)) {
            this[offset + i] = value / mul & 255;
          }
          return offset + byteLength2;
        };
        Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 1, 255, 0);
          this[offset] = value & 255;
          return offset + 1;
        };
        Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 65535, 0);
          this[offset] = value & 255;
          this[offset + 1] = value >>> 8;
          return offset + 2;
        };
        Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 65535, 0);
          this[offset] = value >>> 8;
          this[offset + 1] = value & 255;
          return offset + 2;
        };
        Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 4294967295, 0);
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = value & 255;
          return offset + 4;
        };
        Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 4294967295, 0);
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 255;
          return offset + 4;
        };
        Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength2 - 1);
            checkInt(this, value, offset, byteLength2, limit - 1, -limit);
          }
          var i = 0;
          var mul = 1;
          var sub = 0;
          this[offset] = value & 255;
          while (++i < byteLength2 && (mul *= 256)) {
            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
              sub = 1;
            }
            this[offset + i] = (value / mul >> 0) - sub & 255;
          }
          return offset + byteLength2;
        };
        Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength2 - 1);
            checkInt(this, value, offset, byteLength2, limit - 1, -limit);
          }
          var i = byteLength2 - 1;
          var mul = 1;
          var sub = 0;
          this[offset + i] = value & 255;
          while (--i >= 0 && (mul *= 256)) {
            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
              sub = 1;
            }
            this[offset + i] = (value / mul >> 0) - sub & 255;
          }
          return offset + byteLength2;
        };
        Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 1, 127, -128);
          if (value < 0)
            value = 255 + value + 1;
          this[offset] = value & 255;
          return offset + 1;
        };
        Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 32767, -32768);
          this[offset] = value & 255;
          this[offset + 1] = value >>> 8;
          return offset + 2;
        };
        Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 32767, -32768);
          this[offset] = value >>> 8;
          this[offset + 1] = value & 255;
          return offset + 2;
        };
        Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 2147483647, -2147483648);
          this[offset] = value & 255;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
          return offset + 4;
        };
        Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 2147483647, -2147483648);
          if (value < 0)
            value = 4294967295 + value + 1;
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 255;
          return offset + 4;
        };
        function checkIEEE754(buf, value, offset, ext, max, min) {
          if (offset + ext > buf.length)
            throw new RangeError("Index out of range");
          if (offset < 0)
            throw new RangeError("Index out of range");
        }
        function writeFloat(buf, value, offset, littleEndian, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            checkIEEE754(buf, value, offset, 4);
          }
          ieee754.write(buf, value, offset, littleEndian, 23, 4);
          return offset + 4;
        }
        Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
          return writeFloat(this, value, offset, true, noAssert);
        };
        Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
          return writeFloat(this, value, offset, false, noAssert);
        };
        function writeDouble(buf, value, offset, littleEndian, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            checkIEEE754(buf, value, offset, 8);
          }
          ieee754.write(buf, value, offset, littleEndian, 52, 8);
          return offset + 8;
        }
        Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
          return writeDouble(this, value, offset, true, noAssert);
        };
        Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
          return writeDouble(this, value, offset, false, noAssert);
        };
        Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
          if (!Buffer2.isBuffer(target))
            throw new TypeError("argument should be a Buffer");
          if (!start)
            start = 0;
          if (!end && end !== 0)
            end = this.length;
          if (targetStart >= target.length)
            targetStart = target.length;
          if (!targetStart)
            targetStart = 0;
          if (end > 0 && end < start)
            end = start;
          if (end === start)
            return 0;
          if (target.length === 0 || this.length === 0)
            return 0;
          if (targetStart < 0) {
            throw new RangeError("targetStart out of bounds");
          }
          if (start < 0 || start >= this.length)
            throw new RangeError("Index out of range");
          if (end < 0)
            throw new RangeError("sourceEnd out of bounds");
          if (end > this.length)
            end = this.length;
          if (target.length - targetStart < end - start) {
            end = target.length - targetStart + start;
          }
          var len = end - start;
          if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
            this.copyWithin(targetStart, start, end);
          } else if (this === target && start < targetStart && targetStart < end) {
            for (var i = len - 1; i >= 0; --i) {
              target[i + targetStart] = this[i + start];
            }
          } else {
            Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
          }
          return len;
        };
        Buffer2.prototype.fill = function fill(val, start, end, encoding) {
          if (typeof val === "string") {
            if (typeof start === "string") {
              encoding = start;
              start = 0;
              end = this.length;
            } else if (typeof end === "string") {
              encoding = end;
              end = this.length;
            }
            if (encoding !== void 0 && typeof encoding !== "string") {
              throw new TypeError("encoding must be a string");
            }
            if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
              throw new TypeError("Unknown encoding: " + encoding);
            }
            if (val.length === 1) {
              var code = val.charCodeAt(0);
              if (encoding === "utf8" && code < 128 || encoding === "latin1") {
                val = code;
              }
            }
          } else if (typeof val === "number") {
            val = val & 255;
          } else if (typeof val === "boolean") {
            val = Number(val);
          }
          if (start < 0 || this.length < start || this.length < end) {
            throw new RangeError("Out of range index");
          }
          if (end <= start) {
            return this;
          }
          start = start >>> 0;
          end = end === void 0 ? this.length : end >>> 0;
          if (!val)
            val = 0;
          var i;
          if (typeof val === "number") {
            for (i = start; i < end; ++i) {
              this[i] = val;
            }
          } else {
            var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
            var len = bytes.length;
            if (len === 0) {
              throw new TypeError('The value "' + val + '" is invalid for argument "value"');
            }
            for (i = 0; i < end - start; ++i) {
              this[i + start] = bytes[i % len];
            }
          }
          return this;
        };
        var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
        function base64clean(str) {
          str = str.split("=")[0];
          str = str.trim().replace(INVALID_BASE64_RE, "");
          if (str.length < 2)
            return "";
          while (str.length % 4 !== 0) {
            str = str + "=";
          }
          return str;
        }
        function utf8ToBytes(string, units) {
          units = units || Infinity;
          var codePoint;
          var length = string.length;
          var leadSurrogate = null;
          var bytes = [];
          for (var i = 0; i < length; ++i) {
            codePoint = string.charCodeAt(i);
            if (codePoint > 55295 && codePoint < 57344) {
              if (!leadSurrogate) {
                if (codePoint > 56319) {
                  if ((units -= 3) > -1)
                    bytes.push(239, 191, 189);
                  continue;
                } else if (i + 1 === length) {
                  if ((units -= 3) > -1)
                    bytes.push(239, 191, 189);
                  continue;
                }
                leadSurrogate = codePoint;
                continue;
              }
              if (codePoint < 56320) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                leadSurrogate = codePoint;
                continue;
              }
              codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
            } else if (leadSurrogate) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
            }
            leadSurrogate = null;
            if (codePoint < 128) {
              if ((units -= 1) < 0)
                break;
              bytes.push(codePoint);
            } else if (codePoint < 2048) {
              if ((units -= 2) < 0)
                break;
              bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
            } else if (codePoint < 65536) {
              if ((units -= 3) < 0)
                break;
              bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
            } else if (codePoint < 1114112) {
              if ((units -= 4) < 0)
                break;
              bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
            } else {
              throw new Error("Invalid code point");
            }
          }
          return bytes;
        }
        function asciiToBytes(str) {
          var byteArray = [];
          for (var i = 0; i < str.length; ++i) {
            byteArray.push(str.charCodeAt(i) & 255);
          }
          return byteArray;
        }
        function utf16leToBytes(str, units) {
          var c, hi, lo;
          var byteArray = [];
          for (var i = 0; i < str.length; ++i) {
            if ((units -= 2) < 0)
              break;
            c = str.charCodeAt(i);
            hi = c >> 8;
            lo = c % 256;
            byteArray.push(lo);
            byteArray.push(hi);
          }
          return byteArray;
        }
        function base64ToBytes(str) {
          return base64.toByteArray(base64clean(str));
        }
        function blitBuffer(src, dst, offset, length) {
          for (var i = 0; i < length; ++i) {
            if (i + offset >= dst.length || i >= src.length)
              break;
            dst[i + offset] = src[i];
          }
          return i;
        }
        function isInstance(obj, type) {
          return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
        }
        function numberIsNaN(obj) {
          return obj !== obj;
        }
        var hexSliceLookupTable = function() {
          var alphabet = "0123456789abcdef";
          var table = new Array(256);
          for (var i = 0; i < 16; ++i) {
            var i16 = i * 16;
            for (var j = 0; j < 16; ++j) {
              table[i16 + j] = alphabet[i] + alphabet[j];
            }
          }
          return table;
        }();
      }).call(this, require2("buffer").Buffer);
    }, { "base64-js": 68, buffer: 70, ieee754: 75 }], 71: [function(require2, module2, exports2) {
      var __self__ = function(root) {
        function F() {
          this.fetch = false;
          this.DOMException = root.DOMException;
        }
        F.prototype = root;
        return new F();
      }(typeof self !== "undefined" ? self : this);
      (function(self2) {
        (function(exports3) {
          var support = { searchParams: "URLSearchParams" in self2, iterable: "Symbol" in self2 && "iterator" in Symbol, blob: "FileReader" in self2 && "Blob" in self2 && function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(), formData: "FormData" in self2, arrayBuffer: "ArrayBuffer" in self2 };
          function isDataView(obj) {
            return obj && DataView.prototype.isPrototypeOf(obj);
          }
          if (support.arrayBuffer) {
            var viewClasses = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"];
            var isArrayBufferView = ArrayBuffer.isView || function(obj) {
              return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
            };
          }
          function normalizeName(name) {
            if (typeof name !== "string") {
              name = String(name);
            }
            if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
              throw new TypeError("Invalid character in header field name");
            }
            return name.toLowerCase();
          }
          function normalizeValue(value) {
            if (typeof value !== "string") {
              value = String(value);
            }
            return value;
          }
          function iteratorFor(items) {
            var iterator = { next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            } };
            if (support.iterable) {
              iterator[Symbol.iterator] = function() {
                return iterator;
              };
            }
            return iterator;
          }
          function Headers(headers) {
            this.map = {};
            if (headers instanceof Headers) {
              headers.forEach(function(value, name) {
                this.append(name, value);
              }, this);
            } else if (Array.isArray(headers)) {
              headers.forEach(function(header) {
                this.append(header[0], header[1]);
              }, this);
            } else if (headers) {
              Object.getOwnPropertyNames(headers).forEach(function(name) {
                this.append(name, headers[name]);
              }, this);
            }
          }
          Headers.prototype.append = function(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var oldValue = this.map[name];
            this.map[name] = oldValue ? oldValue + ", " + value : value;
          };
          Headers.prototype["delete"] = function(name) {
            delete this.map[normalizeName(name)];
          };
          Headers.prototype.get = function(name) {
            name = normalizeName(name);
            return this.has(name) ? this.map[name] : null;
          };
          Headers.prototype.has = function(name) {
            return this.map.hasOwnProperty(normalizeName(name));
          };
          Headers.prototype.set = function(name, value) {
            this.map[normalizeName(name)] = normalizeValue(value);
          };
          Headers.prototype.forEach = function(callback, thisArg) {
            for (var name in this.map) {
              if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
              }
            }
          };
          Headers.prototype.keys = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push(name);
            });
            return iteratorFor(items);
          };
          Headers.prototype.values = function() {
            var items = [];
            this.forEach(function(value) {
              items.push(value);
            });
            return iteratorFor(items);
          };
          Headers.prototype.entries = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
            });
            return iteratorFor(items);
          };
          if (support.iterable) {
            Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
          }
          function consumed(body) {
            if (body.bodyUsed) {
              return Promise.reject(new TypeError("Already read"));
            }
            body.bodyUsed = true;
          }
          function fileReaderReady(reader) {
            return new Promise(function(resolve2, reject2) {
              reader.onload = function() {
                resolve2(reader.result);
              };
              reader.onerror = function() {
                reject2(reader.error);
              };
            });
          }
          function readBlobAsArrayBuffer(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsArrayBuffer(blob);
            return promise;
          }
          function readBlobAsText(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsText(blob);
            return promise;
          }
          function readArrayBufferAsText(buf) {
            var view = new Uint8Array(buf);
            var chars = new Array(view.length);
            for (var i = 0; i < view.length; i++) {
              chars[i] = String.fromCharCode(view[i]);
            }
            return chars.join("");
          }
          function bufferClone(buf) {
            if (buf.slice) {
              return buf.slice(0);
            } else {
              var view = new Uint8Array(buf.byteLength);
              view.set(new Uint8Array(buf));
              return view.buffer;
            }
          }
          function Body() {
            this.bodyUsed = false;
            this._initBody = function(body) {
              this._bodyInit = body;
              if (!body) {
                this._bodyText = "";
              } else if (typeof body === "string") {
                this._bodyText = body;
              } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
              } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
              } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
              } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
              } else {
                this._bodyText = body = Object.prototype.toString.call(body);
              }
              if (!this.headers.get("content-type")) {
                if (typeof body === "string") {
                  this.headers.set("content-type", "text/plain;charset=UTF-8");
                } else if (this._bodyBlob && this._bodyBlob.type) {
                  this.headers.set("content-type", this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                  this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                }
              }
            };
            if (support.blob) {
              this.blob = function() {
                var rejected = consumed(this);
                if (rejected) {
                  return rejected;
                }
                if (this._bodyBlob) {
                  return Promise.resolve(this._bodyBlob);
                } else if (this._bodyArrayBuffer) {
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                } else if (this._bodyFormData) {
                  throw new Error("could not read FormData body as blob");
                } else {
                  return Promise.resolve(new Blob([this._bodyText]));
                }
              };
              this.arrayBuffer = function() {
                if (this._bodyArrayBuffer) {
                  return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
                } else {
                  return this.blob().then(readBlobAsArrayBuffer);
                }
              };
            }
            this.text = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as text");
              } else {
                return Promise.resolve(this._bodyText);
              }
            };
            if (support.formData) {
              this.formData = function() {
                return this.text().then(decode);
              };
            }
            this.json = function() {
              return this.text().then(JSON.parse);
            };
            return this;
          }
          var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
          function normalizeMethod(method) {
            var upcased = method.toUpperCase();
            return methods.indexOf(upcased) > -1 ? upcased : method;
          }
          function Request(input, options) {
            options = options || {};
            var body = options.body;
            if (input instanceof Request) {
              if (input.bodyUsed) {
                throw new TypeError("Already read");
              }
              this.url = input.url;
              this.credentials = input.credentials;
              if (!options.headers) {
                this.headers = new Headers(input.headers);
              }
              this.method = input.method;
              this.mode = input.mode;
              this.signal = input.signal;
              if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
              }
            } else {
              this.url = String(input);
            }
            this.credentials = options.credentials || this.credentials || "same-origin";
            if (options.headers || !this.headers) {
              this.headers = new Headers(options.headers);
            }
            this.method = normalizeMethod(options.method || this.method || "GET");
            this.mode = options.mode || this.mode || null;
            this.signal = options.signal || this.signal;
            this.referrer = null;
            if ((this.method === "GET" || this.method === "HEAD") && body) {
              throw new TypeError("Body not allowed for GET or HEAD requests");
            }
            this._initBody(body);
          }
          Request.prototype.clone = function() {
            return new Request(this, { body: this._bodyInit });
          };
          function decode(body) {
            var form = new FormData();
            body.trim().split("&").forEach(function(bytes) {
              if (bytes) {
                var split = bytes.split("=");
                var name = split.shift().replace(/\+/g, " ");
                var value = split.join("=").replace(/\+/g, " ");
                form.append(decodeURIComponent(name), decodeURIComponent(value));
              }
            });
            return form;
          }
          function parseHeaders(rawHeaders) {
            var headers = new Headers();
            var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
            preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
              var parts = line.split(":");
              var key = parts.shift().trim();
              if (key) {
                var value = parts.join(":").trim();
                headers.append(key, value);
              }
            });
            return headers;
          }
          Body.call(Request.prototype);
          function Response(bodyInit, options) {
            if (!options) {
              options = {};
            }
            this.type = "default";
            this.status = options.status === void 0 ? 200 : options.status;
            this.ok = this.status >= 200 && this.status < 300;
            this.statusText = "statusText" in options ? options.statusText : "OK";
            this.headers = new Headers(options.headers);
            this.url = options.url || "";
            this._initBody(bodyInit);
          }
          Body.call(Response.prototype);
          Response.prototype.clone = function() {
            return new Response(this._bodyInit, { status: this.status, statusText: this.statusText, headers: new Headers(this.headers), url: this.url });
          };
          Response.error = function() {
            var response = new Response(null, { status: 0, statusText: "" });
            response.type = "error";
            return response;
          };
          var redirectStatuses = [301, 302, 303, 307, 308];
          Response.redirect = function(url, status) {
            if (redirectStatuses.indexOf(status) === -1) {
              throw new RangeError("Invalid status code");
            }
            return new Response(null, { status, headers: { location: url } });
          };
          exports3.DOMException = self2.DOMException;
          try {
            new exports3.DOMException();
          } catch (err) {
            exports3.DOMException = function(message, name) {
              this.message = message;
              this.name = name;
              var error = Error(message);
              this.stack = error.stack;
            };
            exports3.DOMException.prototype = Object.create(Error.prototype);
            exports3.DOMException.prototype.constructor = exports3.DOMException;
          }
          function fetch(input, init) {
            return new Promise(function(resolve2, reject2) {
              var request = new Request(input, init);
              if (request.signal && request.signal.aborted) {
                return reject2(new exports3.DOMException("Aborted", "AbortError"));
              }
              var xhr = new XMLHttpRequest();
              function abortXhr() {
                xhr.abort();
              }
              xhr.onload = function() {
                var options = { status: xhr.status, statusText: xhr.statusText, headers: parseHeaders(xhr.getAllResponseHeaders() || "") };
                options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
                var body = "response" in xhr ? xhr.response : xhr.responseText;
                resolve2(new Response(body, options));
              };
              xhr.onerror = function() {
                reject2(new TypeError("Network request failed"));
              };
              xhr.ontimeout = function() {
                reject2(new TypeError("Network request failed"));
              };
              xhr.onabort = function() {
                reject2(new exports3.DOMException("Aborted", "AbortError"));
              };
              xhr.open(request.method, request.url, true);
              if (request.credentials === "include") {
                xhr.withCredentials = true;
              } else if (request.credentials === "omit") {
                xhr.withCredentials = false;
              }
              if ("responseType" in xhr && support.blob) {
                xhr.responseType = "blob";
              }
              request.headers.forEach(function(value, name) {
                xhr.setRequestHeader(name, value);
              });
              if (request.signal) {
                request.signal.addEventListener("abort", abortXhr);
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    request.signal.removeEventListener("abort", abortXhr);
                  }
                };
              }
              xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
            });
          }
          fetch.polyfill = true;
          if (!self2.fetch) {
            self2.fetch = fetch;
            self2.Headers = Headers;
            self2.Request = Request;
            self2.Response = Response;
          }
          exports3.Headers = Headers;
          exports3.Request = Request;
          exports3.Response = Response;
          exports3.fetch = fetch;
          return exports3;
        })({});
      })(__self__);
      delete __self__.fetch.polyfill;
      exports2 = __self__.fetch;
      exports2.default = __self__.fetch;
      exports2.fetch = __self__.fetch;
      exports2.Headers = __self__.Headers;
      exports2.Request = __self__.Request;
      exports2.Response = __self__.Response;
      module2.exports = exports2;
    }, {}], 72: [function(require, module, exports) {
      (function(Buffer) {
        const { multiByteIndexOf, stringToBytes, readUInt64LE, tarHeaderChecksumMatches, uint8ArrayUtf8ByteString } = require("./util");
        const supported = require("./supported");
        const xpiZipFilename = stringToBytes("META-INF/mozilla.rsa");
        const oxmlContentTypes = stringToBytes("[Content_Types].xml");
        const oxmlRels = stringToBytes("_rels/.rels");
        const fileType = (input) => {
          if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
            throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
          }
          const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
          if (!(buffer && buffer.length > 1)) {
            return;
          }
          const check = (header, options) => {
            options = __spreadValues({ offset: 0 }, options);
            for (let i = 0; i < header.length; i++) {
              if (options.mask) {
                if (header[i] !== (options.mask[i] & buffer[i + options.offset])) {
                  return false;
                }
              } else if (header[i] !== buffer[i + options.offset]) {
                return false;
              }
            }
            return true;
          };
          const checkString = (header, options) => check(stringToBytes(header), options);
          if (check([255, 216, 255])) {
            return { ext: "jpg", mime: "image/jpeg" };
          }
          if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
            const startIndex = 33;
            const firstImageDataChunkIndex = buffer.findIndex((el, i) => i >= startIndex && buffer[i] === 73 && buffer[i + 1] === 68 && buffer[i + 2] === 65 && buffer[i + 3] === 84);
            const sliced = buffer.subarray(startIndex, firstImageDataChunkIndex);
            if (sliced.findIndex((el, i) => sliced[i] === 97 && sliced[i + 1] === 99 && sliced[i + 2] === 84 && sliced[i + 3] === 76) >= 0) {
              return { ext: "apng", mime: "image/apng" };
            }
            return { ext: "png", mime: "image/png" };
          }
          if (check([71, 73, 70])) {
            return { ext: "gif", mime: "image/gif" };
          }
          if (check([87, 69, 66, 80], { offset: 8 })) {
            return { ext: "webp", mime: "image/webp" };
          }
          if (check([70, 76, 73, 70])) {
            return { ext: "flif", mime: "image/flif" };
          }
          if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
            return { ext: "cr2", mime: "image/x-canon-cr2" };
          }
          if (check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
            return { ext: "orf", mime: "image/x-olympus-orf" };
          }
          if (check([73, 73, 42, 0]) && (check([16, 251, 134, 1], { offset: 4 }) || check([8, 0, 0, 0, 19, 0], { offset: 4 }) || check([8, 0, 0, 0, 18, 0], { offset: 4 }))) {
            return { ext: "arw", mime: "image/x-sony-arw" };
          }
          if (check([73, 73, 42, 0, 8, 0, 0, 0]) && (check([45, 0, 254, 0], { offset: 8 }) || check([39, 0, 254, 0], { offset: 8 }))) {
            return { ext: "dng", mime: "image/x-adobe-dng" };
          }
          if (check([73, 73, 42, 0]) && check([28, 0, 254, 0], { offset: 8 })) {
            return { ext: "nef", mime: "image/x-nikon-nef" };
          }
          if (check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
            return { ext: "rw2", mime: "image/x-panasonic-rw2" };
          }
          if (checkString("FUJIFILMCCD-RAW")) {
            return { ext: "raf", mime: "image/x-fujifilm-raf" };
          }
          if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
            return { ext: "tif", mime: "image/tiff" };
          }
          if (check([66, 77])) {
            return { ext: "bmp", mime: "image/bmp" };
          }
          if (check([73, 73, 188])) {
            return { ext: "jxr", mime: "image/vnd.ms-photo" };
          }
          if (check([56, 66, 80, 83])) {
            return { ext: "psd", mime: "image/vnd.adobe.photoshop" };
          }
          const zipHeader = [80, 75, 3, 4];
          if (check(zipHeader)) {
            if (check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
              return { ext: "epub", mime: "application/epub+zip" };
            }
            if (check(xpiZipFilename, { offset: 30 })) {
              return { ext: "xpi", mime: "application/x-xpinstall" };
            }
            if (checkString("mimetypeapplication/vnd.oasis.opendocument.text", { offset: 30 })) {
              return { ext: "odt", mime: "application/vnd.oasis.opendocument.text" };
            }
            if (checkString("mimetypeapplication/vnd.oasis.opendocument.spreadsheet", { offset: 30 })) {
              return { ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet" };
            }
            if (checkString("mimetypeapplication/vnd.oasis.opendocument.presentation", { offset: 30 })) {
              return { ext: "odp", mime: "application/vnd.oasis.opendocument.presentation" };
            }
            let zipHeaderIndex = 0;
            let oxmlFound = false;
            let type;
            do {
              const offset = zipHeaderIndex + 30;
              if (!oxmlFound) {
                oxmlFound = check(oxmlContentTypes, { offset }) || check(oxmlRels, { offset });
              }
              if (!type) {
                if (checkString("word/", { offset })) {
                  type = { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
                } else if (checkString("ppt/", { offset })) {
                  type = { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" };
                } else if (checkString("xl/", { offset })) {
                  type = { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
                }
              }
              if (oxmlFound && type) {
                return type;
              }
              zipHeaderIndex = multiByteIndexOf(buffer, zipHeader, offset);
            } while (zipHeaderIndex >= 0);
            if (type) {
              return type;
            }
          }
          if (check([80, 75]) && (buffer[2] === 3 || buffer[2] === 5 || buffer[2] === 7) && (buffer[3] === 4 || buffer[3] === 6 || buffer[3] === 8)) {
            return { ext: "zip", mime: "application/zip" };
          }
          if (check([48, 48, 48, 48, 48, 48], { offset: 148, mask: [248, 248, 248, 248, 248, 248] }) && tarHeaderChecksumMatches(buffer)) {
            return { ext: "tar", mime: "application/x-tar" };
          }
          if (check([82, 97, 114, 33, 26, 7]) && (buffer[6] === 0 || buffer[6] === 1)) {
            return { ext: "rar", mime: "application/x-rar-compressed" };
          }
          if (check([31, 139, 8])) {
            return { ext: "gz", mime: "application/gzip" };
          }
          if (check([66, 90, 104])) {
            return { ext: "bz2", mime: "application/x-bzip2" };
          }
          if (check([55, 122, 188, 175, 39, 28])) {
            return { ext: "7z", mime: "application/x-7z-compressed" };
          }
          if (check([120, 1])) {
            return { ext: "dmg", mime: "application/x-apple-diskimage" };
          }
          if (check([102, 114, 101, 101], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([109, 111, 111, 118], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
            return { ext: "mov", mime: "video/quicktime" };
          }
          if (check([102, 116, 121, 112], { offset: 4 }) && (buffer[8] & 96) !== 0 && (buffer[9] & 96) !== 0 && (buffer[10] & 96) !== 0 && (buffer[11] & 96) !== 0) {
            const brandMajor = uint8ArrayUtf8ByteString(buffer, 8, 12);
            switch (brandMajor) {
              case "mif1":
                return { ext: "heic", mime: "image/heif" };
              case "msf1":
                return { ext: "heic", mime: "image/heif-sequence" };
              case "heic":
              case "heix":
                return { ext: "heic", mime: "image/heic" };
              case "hevc":
              case "hevx":
                return { ext: "heic", mime: "image/heic-sequence" };
              case "qt  ":
                return { ext: "mov", mime: "video/quicktime" };
              case "M4V ":
              case "M4VH":
              case "M4VP":
                return { ext: "m4v", mime: "video/x-m4v" };
              case "M4P ":
                return { ext: "m4p", mime: "video/mp4" };
              case "M4B ":
                return { ext: "m4b", mime: "audio/mp4" };
              case "M4A ":
                return { ext: "m4a", mime: "audio/x-m4a" };
              case "F4V ":
                return { ext: "f4v", mime: "video/mp4" };
              case "F4P ":
                return { ext: "f4p", mime: "video/mp4" };
              case "F4A ":
                return { ext: "f4a", mime: "audio/mp4" };
              case "F4B ":
                return { ext: "f4b", mime: "audio/mp4" };
              default:
                if (brandMajor.startsWith("3g")) {
                  if (brandMajor.startsWith("3g2")) {
                    return { ext: "3g2", mime: "video/3gpp2" };
                  }
                  return { ext: "3gp", mime: "video/3gpp" };
                }
                return { ext: "mp4", mime: "video/mp4" };
            }
          }
          if (check([77, 84, 104, 100])) {
            return { ext: "mid", mime: "audio/midi" };
          }
          if (check([26, 69, 223, 163])) {
            const sliced = buffer.subarray(4, 4 + 4096);
            const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
            if (idPos !== -1) {
              const docTypePos = idPos + 3;
              const findDocType = (type) => [...type].every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
              if (findDocType("matroska")) {
                return { ext: "mkv", mime: "video/x-matroska" };
              }
              if (findDocType("webm")) {
                return { ext: "webm", mime: "video/webm" };
              }
            }
          }
          if (check([82, 73, 70, 70])) {
            if (check([65, 86, 73], { offset: 8 })) {
              return { ext: "avi", mime: "video/vnd.avi" };
            }
            if (check([87, 65, 86, 69], { offset: 8 })) {
              return { ext: "wav", mime: "audio/vnd.wave" };
            }
            if (check([81, 76, 67, 77], { offset: 8 })) {
              return { ext: "qcp", mime: "audio/qcelp" };
            }
          }
          if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
            let offset = 30;
            do {
              const objectSize = readUInt64LE(buffer, offset + 16);
              if (check([145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101], { offset })) {
                if (check([64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], { offset: offset + 24 })) {
                  return { ext: "wma", mime: "audio/x-ms-wma" };
                }
                if (check([192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], { offset: offset + 24 })) {
                  return { ext: "wmv", mime: "video/x-ms-asf" };
                }
                break;
              }
              offset += objectSize;
            } while (offset + 24 <= buffer.length);
            return { ext: "asf", mime: "application/vnd.ms-asf" };
          }
          if (check([0, 0, 1, 186]) || check([0, 0, 1, 179])) {
            return { ext: "mpg", mime: "video/mpeg" };
          }
          for (let start = 0; start < 2 && start < buffer.length - 16; start++) {
            if (check([73, 68, 51], { offset: start }) || check([255, 226], { offset: start, mask: [255, 230] })) {
              return { ext: "mp3", mime: "audio/mpeg" };
            }
            if (check([255, 228], { offset: start, mask: [255, 230] })) {
              return { ext: "mp2", mime: "audio/mpeg" };
            }
            if (check([255, 248], { offset: start, mask: [255, 252] })) {
              return { ext: "mp2", mime: "audio/mpeg" };
            }
            if (check([255, 240], { offset: start, mask: [255, 252] })) {
              return { ext: "mp4", mime: "audio/mpeg" };
            }
          }
          if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
            return { ext: "opus", mime: "audio/opus" };
          }
          if (check([79, 103, 103, 83])) {
            if (check([128, 116, 104, 101, 111, 114, 97], { offset: 28 })) {
              return { ext: "ogv", mime: "video/ogg" };
            }
            if (check([1, 118, 105, 100, 101, 111, 0], { offset: 28 })) {
              return { ext: "ogm", mime: "video/ogg" };
            }
            if (check([127, 70, 76, 65, 67], { offset: 28 })) {
              return { ext: "oga", mime: "audio/ogg" };
            }
            if (check([83, 112, 101, 101, 120, 32, 32], { offset: 28 })) {
              return { ext: "spx", mime: "audio/ogg" };
            }
            if (check([1, 118, 111, 114, 98, 105, 115], { offset: 28 })) {
              return { ext: "ogg", mime: "audio/ogg" };
            }
            return { ext: "ogx", mime: "application/ogg" };
          }
          if (check([102, 76, 97, 67])) {
            return { ext: "flac", mime: "audio/x-flac" };
          }
          if (check([77, 65, 67, 32])) {
            return { ext: "ape", mime: "audio/ape" };
          }
          if (check([119, 118, 112, 107])) {
            return { ext: "wv", mime: "audio/wavpack" };
          }
          if (check([35, 33, 65, 77, 82, 10])) {
            return { ext: "amr", mime: "audio/amr" };
          }
          if (check([37, 80, 68, 70])) {
            return { ext: "pdf", mime: "application/pdf" };
          }
          if (check([77, 90])) {
            return { ext: "exe", mime: "application/x-msdownload" };
          }
          if ((buffer[0] === 67 || buffer[0] === 70) && check([87, 83], { offset: 1 })) {
            return { ext: "swf", mime: "application/x-shockwave-flash" };
          }
          if (check([123, 92, 114, 116, 102])) {
            return { ext: "rtf", mime: "application/rtf" };
          }
          if (check([0, 97, 115, 109])) {
            return { ext: "wasm", mime: "application/wasm" };
          }
          if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
            return { ext: "woff", mime: "font/woff" };
          }
          if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
            return { ext: "woff2", mime: "font/woff2" };
          }
          if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
            return { ext: "eot", mime: "application/vnd.ms-fontobject" };
          }
          if (check([0, 1, 0, 0, 0])) {
            return { ext: "ttf", mime: "font/ttf" };
          }
          if (check([79, 84, 84, 79, 0])) {
            return { ext: "otf", mime: "font/otf" };
          }
          if (check([0, 0, 1, 0])) {
            return { ext: "ico", mime: "image/x-icon" };
          }
          if (check([0, 0, 2, 0])) {
            return { ext: "cur", mime: "image/x-icon" };
          }
          if (check([70, 76, 86, 1])) {
            return { ext: "flv", mime: "video/x-flv" };
          }
          if (check([37, 33])) {
            return { ext: "ps", mime: "application/postscript" };
          }
          if (check([253, 55, 122, 88, 90, 0])) {
            return { ext: "xz", mime: "application/x-xz" };
          }
          if (check([83, 81, 76, 105])) {
            return { ext: "sqlite", mime: "application/x-sqlite3" };
          }
          if (check([78, 69, 83, 26])) {
            return { ext: "nes", mime: "application/x-nintendo-nes-rom" };
          }
          if (check([67, 114, 50, 52])) {
            return { ext: "crx", mime: "application/x-google-chrome-extension" };
          }
          if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
            return { ext: "cab", mime: "application/vnd.ms-cab-compressed" };
          }
          if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
            return { ext: "deb", mime: "application/x-deb" };
          }
          if (check([33, 60, 97, 114, 99, 104, 62])) {
            return { ext: "ar", mime: "application/x-unix-archive" };
          }
          if (check([237, 171, 238, 219])) {
            return { ext: "rpm", mime: "application/x-rpm" };
          }
          if (check([31, 160]) || check([31, 157])) {
            return { ext: "Z", mime: "application/x-compress" };
          }
          if (check([76, 90, 73, 80])) {
            return { ext: "lz", mime: "application/x-lzip" };
          }
          if (check([208, 207, 17, 224, 161, 177, 26, 225, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62])) {
            return { ext: "msi", mime: "application/x-msi" };
          }
          if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
            return { ext: "mxf", mime: "application/mxf" };
          }
          if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
            return { ext: "mts", mime: "video/mp2t" };
          }
          if (check([66, 76, 69, 78, 68, 69, 82])) {
            return { ext: "blend", mime: "application/x-blender" };
          }
          if (check([66, 80, 71, 251])) {
            return { ext: "bpg", mime: "image/bpg" };
          }
          if (check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
            if (check([106, 112, 50, 32], { offset: 20 })) {
              return { ext: "jp2", mime: "image/jp2" };
            }
            if (check([106, 112, 120, 32], { offset: 20 })) {
              return { ext: "jpx", mime: "image/jpx" };
            }
            if (check([106, 112, 109, 32], { offset: 20 })) {
              return { ext: "jpm", mime: "image/jpm" };
            }
            if (check([109, 106, 112, 50], { offset: 20 })) {
              return { ext: "mj2", mime: "image/mj2" };
            }
          }
          if (check([70, 79, 82, 77])) {
            return { ext: "aif", mime: "audio/aiff" };
          }
          if (checkString("<?xml ")) {
            return { ext: "xml", mime: "application/xml" };
          }
          if (check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
            return { ext: "mobi", mime: "application/x-mobipocket-ebook" };
          }
          if (check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
            return { ext: "ktx", mime: "image/ktx" };
          }
          if (check([68, 73, 67, 77], { offset: 128 })) {
            return { ext: "dcm", mime: "application/dicom" };
          }
          if (check([77, 80, 43])) {
            return { ext: "mpc", mime: "audio/x-musepack" };
          }
          if (check([77, 80, 67, 75])) {
            return { ext: "mpc", mime: "audio/x-musepack" };
          }
          if (check([66, 69, 71, 73, 78, 58])) {
            return { ext: "ics", mime: "text/calendar" };
          }
          if (check([103, 108, 84, 70, 2, 0, 0, 0])) {
            return { ext: "glb", mime: "model/gltf-binary" };
          }
          if (check([212, 195, 178, 161]) || check([161, 178, 195, 212])) {
            return { ext: "pcap", mime: "application/vnd.tcpdump.pcap" };
          }
          if (check([68, 83, 68, 32])) {
            return { ext: "dsf", mime: "audio/x-dsf" };
          }
          if (check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
            return { ext: "lnk", mime: "application/x.ms.shortcut" };
          }
          if (check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
            return { ext: "alias", mime: "application/x.apple.alias" };
          }
          if (checkString("Creative Voice File")) {
            return { ext: "voc", mime: "audio/x-voc" };
          }
          if (check([11, 119])) {
            return { ext: "ac3", mime: "audio/vnd.dolby.dd-raw" };
          }
          if ((check([126, 16, 4]) || check([126, 24, 4])) && check([48, 77, 73, 69], { offset: 4 })) {
            return { ext: "mie", mime: "application/x-mie" };
          }
        };
        module.exports = fileType;
        Object.defineProperty(fileType, "minimumBytes", { value: 4100 });
        fileType.stream = (readableStream) => new Promise((resolve, reject) => {
          const stream = eval("require")("stream");
          readableStream.on("error", reject);
          readableStream.once("readable", () => {
            const pass = new stream.PassThrough();
            const chunk = readableStream.read(module.exports.minimumBytes) || readableStream.read();
            try {
              pass.fileType = fileType(chunk);
            } catch (error) {
              reject(error);
            }
            readableStream.unshift(chunk);
            if (stream.pipeline) {
              resolve(stream.pipeline(readableStream, pass, () => {
              }));
            } else {
              resolve(readableStream.pipe(pass));
            }
          });
        });
        Object.defineProperty(fileType, "extensions", { get() {
          return new Set(supported.extensions);
        } });
        Object.defineProperty(fileType, "mimeTypes", { get() {
          return new Set(supported.mimeTypes);
        } });
      }).call(this, { isBuffer: require("../is-buffer/index.js") });
    }, { "../is-buffer/index.js": 76, "./supported": 73, "./util": 74 }], 73: [function(require2, module2, exports2) {
      module2.exports = { extensions: ["jpg", "png", "apng", "gif", "webp", "flif", "cr2", "orf", "arw", "dng", "nef", "rw2", "raf", "tif", "bmp", "jxr", "psd", "zip", "tar", "rar", "gz", "bz2", "7z", "dmg", "mp4", "mid", "mkv", "webm", "mov", "avi", "mpg", "mp2", "mp3", "m4a", "oga", "ogg", "ogv", "opus", "flac", "wav", "spx", "amr", "pdf", "epub", "exe", "swf", "rtf", "wasm", "woff", "woff2", "eot", "ttf", "otf", "ico", "flv", "ps", "xz", "sqlite", "nes", "crx", "xpi", "cab", "deb", "ar", "rpm", "Z", "lz", "msi", "mxf", "mts", "blend", "bpg", "docx", "pptx", "xlsx", "3gp", "3g2", "jp2", "jpm", "jpx", "mj2", "aif", "qcp", "odt", "ods", "odp", "xml", "mobi", "heic", "cur", "ktx", "ape", "wv", "wmv", "wma", "dcm", "ics", "glb", "pcap", "dsf", "lnk", "alias", "voc", "ac3", "m4v", "m4p", "m4b", "f4v", "f4p", "f4b", "f4a", "mie", "asf", "ogm", "ogx", "mpc"], mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/flif", "image/x-canon-cr2", "image/tiff", "image/bmp", "image/vnd.ms-photo", "image/vnd.adobe.photoshop", "application/epub+zip", "application/x-xpinstall", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip", "application/x-tar", "application/x-rar-compressed", "application/gzip", "application/x-bzip2", "application/x-7z-compressed", "application/x-apple-diskimage", "video/mp4", "audio/midi", "video/x-matroska", "video/webm", "video/quicktime", "video/vnd.avi", "audio/vnd.wave", "audio/qcelp", "audio/x-ms-wma", "video/x-ms-asf", "application/vnd.ms-asf", "video/mpeg", "video/3gpp", "audio/mpeg", "audio/mp4", "audio/opus", "video/ogg", "audio/ogg", "application/ogg", "audio/x-flac", "audio/ape", "audio/wavpack", "audio/amr", "application/pdf", "application/x-msdownload", "application/x-shockwave-flash", "application/rtf", "application/wasm", "font/woff", "font/woff2", "application/vnd.ms-fontobject", "font/ttf", "font/otf", "image/x-icon", "video/x-flv", "application/postscript", "application/x-xz", "application/x-sqlite3", "application/x-nintendo-nes-rom", "application/x-google-chrome-extension", "application/vnd.ms-cab-compressed", "application/x-deb", "application/x-unix-archive", "application/x-rpm", "application/x-compress", "application/x-lzip", "application/x-msi", "application/x-mie", "application/mxf", "video/mp2t", "application/x-blender", "image/bpg", "image/jp2", "image/jpx", "image/jpm", "image/mj2", "audio/aiff", "application/xml", "application/x-mobipocket-ebook", "image/heif", "image/heif-sequence", "image/heic", "image/heic-sequence", "image/ktx", "application/dicom", "audio/x-musepack", "text/calendar", "model/gltf-binary", "application/vnd.tcpdump.pcap", "audio/x-dsf", "application/x.ms.shortcut", "application/x.apple.alias", "audio/x-voc", "audio/vnd.dolby.dd-raw", "audio/x-m4a", "image/apng", "image/x-olympus-orf", "image/x-sony-arw", "image/x-adobe-dng", "image/x-nikon-nef", "image/x-panasonic-rw2", "image/x-fujifilm-raf", "video/x-m4v", "video/3gpp2"] };
    }, {}], 74: [function(require2, module2, exports2) {
      (function(Buffer2) {
        exports2.stringToBytes = (string) => [...string].map((character) => character.charCodeAt(0));
        const uint8ArrayUtf8ByteString2 = (array, start, end) => {
          return String.fromCharCode(...array.slice(start, end));
        };
        exports2.readUInt64LE = (buffer, offset = 0) => {
          let n = buffer[offset];
          let mul = 1;
          let i = 0;
          while (++i < 8) {
            mul *= 256;
            n += buffer[offset + i] * mul;
          }
          return n;
        };
        exports2.tarHeaderChecksumMatches = (buffer) => {
          if (buffer.length < 512) {
            return false;
          }
          const MASK_8TH_BIT = 128;
          let sum = 256;
          let signedBitSum = 0;
          for (let i = 0; i < 148; i++) {
            const byte = buffer[i];
            sum += byte;
            signedBitSum += byte & MASK_8TH_BIT;
          }
          for (let i = 156; i < 512; i++) {
            const byte = buffer[i];
            sum += byte;
            signedBitSum += byte & MASK_8TH_BIT;
          }
          const readSum = parseInt(uint8ArrayUtf8ByteString2(buffer, 148, 154), 8);
          return readSum === sum || readSum === sum - (signedBitSum << 1);
        };
        exports2.multiByteIndexOf = (buffer, bytesToSearch, startAt = 0) => {
          if (Buffer2 && Buffer2.isBuffer(buffer)) {
            return buffer.indexOf(Buffer2.from(bytesToSearch), startAt);
          }
          const nextBytesMatch = (buffer2, bytes, startIndex) => {
            for (let i = 1; i < bytes.length; i++) {
              if (bytes[i] !== buffer2[startIndex + i]) {
                return false;
              }
            }
            return true;
          };
          let index = buffer.indexOf(bytesToSearch[0], startAt);
          while (index >= 0) {
            if (nextBytesMatch(buffer, bytesToSearch, index)) {
              return index;
            }
            index = buffer.indexOf(bytesToSearch[0], index + 1);
          }
          return -1;
        };
        exports2.uint8ArrayUtf8ByteString = uint8ArrayUtf8ByteString2;
      }).call(this, require2("buffer").Buffer);
    }, { buffer: 70 }], 75: [function(require2, module2, exports2) {
      exports2.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s2 = buffer[offset + i];
        i += d;
        e = s2 & (1 << -nBits) - 1;
        s2 >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s2 ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s2 ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports2.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s2 = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s2 * 128;
      };
    }, {}], 76: [function(require2, module2, exports2) {
      module2.exports = function(obj) {
        return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
      };
      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
      }
      function isSlowBuffer(obj) {
        return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
      }
    }, {}], 77: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function array(n, sample) {
        var a = [];
        for (var i = 0; i < n; i++) {
          a.push(typeof sample === "undefined" ? i : sample);
        }
        return a;
      }
      exports2.array = array;
      function asArray(selectors) {
        return Array.isArray(selectors) ? selectors : [selectors];
      }
      exports2.asArray = asArray;
      function seq(start, step, max) {
        if (start === void 0) {
          start = 0;
        }
        if (step === void 0) {
          step = 1;
        }
        if (max === void 0) {
          max = 0;
        }
        var result = [];
        for (var i = start; i < max; i += step) {
          result.push(i);
        }
        return result;
      }
      exports2.seq = seq;
    }, {}], 78: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function enumKeys(anEnum) {
        var a = [];
        for (var i in anEnum) {
          a.push(i);
        }
        return a;
      }
      exports2.enumKeys = enumKeys;
      function enumNoValueKeys(anEnum) {
        return Object.keys(anEnum).map(function(i) {
          return anEnum[i];
        }).filter(function(s2, i, a) {
          return typeof s2 === "string" && a.indexOf(s2) === i;
        });
      }
      exports2.enumNoValueKeys = enumNoValueKeys;
    }, {}], 79: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function dedup(a, p) {
        return a.filter(function(n, i, a2) {
          return i === a2.findIndex(function(x) {
            return p(n, x);
          });
        });
      }
      exports2.dedup = dedup;
      function notSame(t, i, a) {
        return a.indexOf(t) === i;
      }
      exports2.notSame = notSame;
      function notSameNotFalsy(t, i, a) {
        return a.indexOf(t) === i;
      }
      exports2.notSameNotFalsy = notSameNotFalsy;
    }, {}], 80: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function flatDeep(arr1) {
        return arr1.reduce(function(acc, val) {
          return Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat(val);
        }, []);
      }
      exports2.flatDeep = flatDeep;
      function flat(arr) {
        return arr.reduce(function(a, b) {
          return a.concat(b);
        });
      }
      exports2.flat = flat;
      function flatReadOnly(arr) {
        return arr && arr.length ? arr.reduce(function(a, b) {
          return a.concat(b);
        }) : [];
      }
      exports2.flatReadOnly = flatReadOnly;
    }, {}], 81: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./create"));
      __export(require2("./enumKeys"));
      __export(require2("./filter"));
      __export(require2("./flat"));
      __export(require2("./prototypeFind"));
      __export(require2("./set"));
    }, { "./create": 77, "./enumKeys": 78, "./filter": 79, "./flat": 80, "./prototypeFind": 82, "./set": 83 }], 82: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function arrayPrototypeFind(a, predicate, thisArg) {
        for (var i = 0; i < a.length; i++) {
          var v = a[i];
          if (predicate.apply(thisArg, [v, i, a])) {
            return v;
          }
        }
      }
      exports2.arrayPrototypeFind = arrayPrototypeFind;
      function installArrayPrototypeFind(force) {
        if (force === void 0) {
          force = false;
        }
        Array.prototype.find = typeof Array.prototype.find === "undefined" || force ? function(predicate, thisArg) {
          return arrayPrototypeFind(this, predicate, thisArg);
        } : Array.prototype.find;
      }
      exports2.installArrayPrototypeFind = installArrayPrototypeFind;
    }, {}], 83: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var filter_1 = require2("./filter");
      function unionEquals(a, b, predicate, output) {
        if (predicate === void 0) {
          predicate = function(a2, b2) {
            return a2 === b2;
          };
        }
        var r = filter_1.dedup(a.concat(b), predicate);
        output && output.push.apply(output, filter_1.dedup(r.concat(output), predicate));
        return r;
      }
      exports2.unionEquals = unionEquals;
      exports2.arrayUnion = unionEquals;
      function arrayInterception(a, b, predicate, output) {
        if (predicate === void 0) {
          predicate = function(a2, b2) {
            return a2 === b2;
          };
        }
        var r = a.filter(function(a2) {
          return b.find(function(b2) {
            return predicate(a2, b2);
          });
        });
        r = filter_1.dedup(r, predicate);
        output && output.push.apply(output, filter_1.dedup(r.concat(output), predicate));
        return r;
      }
      exports2.arrayInterception = arrayInterception;
      function arrayDifference(a, b, predicate, output) {
        if (predicate === void 0) {
          predicate = function(a2, b2) {
            return a2 === b2;
          };
        }
        var r = a.filter(function(a2) {
          return !b.find(function(b2) {
            return predicate(a2, b2);
          });
        }).concat(b.filter(function(b2) {
          return !a.find(function(a2) {
            return predicate(b2, a2);
          });
        }));
        r = filter_1.dedup(r, predicate);
        output && output.push.apply(output, filter_1.dedup(r.concat(output), predicate));
        return r;
      }
      exports2.arrayDifference = arrayDifference;
    }, { "./filter": 79 }], 84: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function rgb2Hex(s2) {
        return s2.match(/[0-9]+/g).reduce(function(a, b) {
          return a + (b | 256).toString(16).slice(1);
        }, "#").toString(16);
      }
      exports2.rgb2Hex = rgb2Hex;
    }, {}], 85: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var array_1 = require2("./array");
      function compareTexts(actual, expected, options) {
        return compareWithMultiplicity(actual, expected, options, compareText);
      }
      exports2.compareTexts = compareTexts;
      function compareText(actual, expected, options) {
        if (actual === expected) {
          return options.negate ? negate(true) : true;
        }
        actual = buildText(actual, options);
        expected = buildText(expected, options);
        if (!options.verb || options.verb === "contains") {
          return options.negate ? negate(actual.includes(expected)) : actual.includes(expected);
        } else if (options.verb === "equals") {
          return options.negate ? negate(actual === expected) : actual === expected;
        } else if (options.verb === "contained") {
          return options.negate ? negate(expected.includes(actual)) : expected.includes(actual);
        } else if (options.verb === "endsWith") {
          return options.negate ? negate(actual.endsWith(expected)) : actual.endsWith(expected);
        } else if (options.verb === "startsWith") {
          return options.negate ? negate(actual.startsWith(expected)) : actual.startsWith(expected);
        } else {
          return options.negate ? negate(false) : false;
        }
      }
      exports2.compareText = compareText;
      function compareWithMultiplicity(_actual, _expected, options, predicate) {
        var actual = array_1.asArray(_actual);
        var expected = array_1.asArray(_expected);
        if (actual === expected) {
          return options.negate ? negate(true) : true;
        }
        if (!options.multiplicity || options.multiplicity === "anyOf") {
          var r = !!actual.find(function(a) {
            return !!expected.find(function(e) {
              return predicate(a, e, options);
            });
          });
          return options.negate ? negate(r) : r;
        } else if (options.multiplicity === "allOf") {
          var r = !actual.find(function(a) {
            return !expected.find(function(e) {
              return predicate(a, e, options);
            });
          });
          return options.negate ? negate(r) : r;
        } else {
          return options.negate ? negate(false) : false;
        }
      }
      function negate(b) {
        return !b;
      }
      function buildText(text, options) {
        if (options.caseInsensitive) {
          text = text.toLowerCase();
        }
        if (options.asCode) {
          text = text.replace(/\s+/g, " ").trim();
        }
        return text;
      }
    }, { "./array": 81 }], 86: [function(require2, module2, exports2) {
      (function(process, global2) {
        Object.defineProperty(exports2, "__esModule", { value: true });
        function isNode() {
          return typeof process !== "undefined" && typeof global2 !== "undefined" && typeof process.exit === "function" && typeof module2 !== "undefined" && typeof require2 === "function" && typeof require2("fs") !== "undefined" && typeof require2("fs").writeFileSync === "function" && typeof require2("child_process") !== "undefined" && typeof require2("child_process").execSync === "function";
        }
        exports2.isNode = isNode;
        function isJSDOM() {
          return isNode() && exports2.isDOM();
        }
        exports2.isJSDOM = isJSDOM;
        exports2.inNode = isNode;
        function inBrowser() {
          return typeof window !== "undefined" && typeof document !== "undefined" && typeof Node !== "undefined" && document.nodeType === Node.DOCUMENT_NODE;
        }
        exports2.inBrowser = inBrowser;
        exports2.isBrowser = inBrowser;
        exports2.inDOM = inBrowser;
        exports2.isDOM = inBrowser;
        function isWebWorker() {
          return !exports2.isDOM() && !isNode() && typeof self !== "undefined" && typeof self.onmessage !== "undefined";
        }
        exports2.isWebWorker = isWebWorker;
        var _this = this;
        function getGlobal() {
          return isWebWorker() ? self : isNode() ? global2 : exports2.isBrowser() ? window : _this;
        }
        exports2.getGlobal = getGlobal;
      }).call(this, require2("_process"), typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { _process: 121 }], 87: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Emitter = function() {
        function Emitter2() {
          this.l = [];
        }
        Emitter2.prototype.add = function(l) {
          this.l.push(l);
        };
        Emitter2.prototype.emit = function(e) {
          this.l.forEach(function(l) {
            return l(e);
          });
        };
        Emitter2.prototype.remove = function(l) {
          this.l = this.l.filter(function(a) {
            return a === l;
          });
        };
        return Emitter2;
      }();
      exports2.Emitter = Emitter;
    }, {}], 88: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function checkThrow(r, msg) {
        if (msg === void 0) {
          msg = "Throwing on undefined value";
        }
        if (!r) {
          throw new Error(msg);
        }
        return r;
      }
      exports2.checkThrow = checkThrow;
      function checkTruthy(r, msg) {
        if (msg === void 0) {
          msg = "Throwing on undefined value";
        }
        if (!r) {
          throw new Error(msg);
        }
        return true;
      }
      exports2.checkTruthy = checkTruthy;
      function tryTo(f, def) {
        try {
          return f();
        } catch (error) {
          return def;
        }
      }
      exports2.tryTo = tryTo;
    }, {}], 89: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function bytesToKiloBytes(fileSizeInBytes) {
        return fileSizeInBytes / 1e3;
      }
      exports2.bytesToKiloBytes = bytesToKiloBytes;
      function withoutExtension(f) {
        var i = slash(f).lastIndexOf(".");
        return i === -1 ? f : f.substring(0, i);
      }
      exports2.withoutExtension = withoutExtension;
      function basename(f, removeExtension) {
        if (removeExtension === void 0) {
          removeExtension = false;
        }
        var i = slash(f).lastIndexOf("/");
        var s2 = i === -1 ? f : f.substring(i + 1, f.length);
        return removeExtension ? withoutExtension(s2) : s2;
      }
      exports2.basename = basename;
      function getFileExtension(s2) {
        var i = s2.lastIndexOf(".");
        if (i == -1 || i === s2.length - 1) {
          return "";
        }
        return s2.substring(i + 1, s2.length);
      }
      exports2.getFileExtension = getFileExtension;
      function dirname(path) {
        var i = slash(path).lastIndexOf("/");
        return i === -1 ? "" : path.substring(0, i);
      }
      exports2.dirname = dirname;
      function getRelativePath(source, target) {
        source = slash(source);
        target = slash(target);
        var sep = "/", targetArr = target.split(sep), sourceArr = source.split(sep), filename = targetArr.pop(), targetPath = targetArr.join(sep);
        if (targetArr.length < 2 && sourceArr.length < 2) {
          return target;
        }
        var relativePath = "";
        while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
          sourceArr.pop();
          relativePath += ".." + sep;
        }
        var relPathArr = targetArr.slice(sourceArr.length);
        relPathArr.length && (relativePath += relPathArr.join(sep) + sep);
        return relativePath + filename;
      }
      exports2.getRelativePath = getRelativePath;
      function pathJoin() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          parts[_i] = arguments[_i];
        }
        var separator = "/";
        var replace = new RegExp(separator + "{1,}", "g");
        return parts.filter(Boolean).map(slash).join(separator).replace(replace, separator);
      }
      exports2.pathJoin = pathJoin;
      function parseGitIgnore(content, options) {
        if (options === void 0) {
          options = { cwd: ".", fileName: ".gitignore" };
        }
        var mapGitIgnorePatternTo = function(base2) {
          return function(ignore) {
            if (ignore.startsWith("!")) {
              return "!" + pathJoin(base2, ignore.slice(1));
            }
            return pathJoin(base2, ignore);
          };
        };
        var base = getRelativePath(options.cwd, dirname(options.fileName));
        return content.split(/\r?\n/).filter(Boolean).filter(function(line) {
          return line.charAt(0) !== "#";
        }).map(mapGitIgnorePatternTo(base));
      }
      exports2.parseGitIgnore = parseGitIgnore;
      function slash(path) {
        var isExtendedLengthPath = /^\\\\\?\\/.test(path);
        var hasNonAscii = /[^\u0000-\u0080]+/.test(path);
        if (isExtendedLengthPath || hasNonAscii) {
          return path;
        }
        return path.replace(/\\/g, "/");
      }
      exports2.slash = slash;
      function detectNewline(s2, def) {
        if (def === void 0) {
          def = "\n";
        }
        var newlines = s2.match(/(?:\r?\n)/g) || [];
        if (newlines.length === 0) {
          return def;
        }
        var crlf = newlines.filter(function(newline) {
          return newline === "\r\n";
        }).length;
        var lf = newlines.length - crlf;
        return crlf > lf ? "\r\n" : "\n";
      }
      exports2.detectNewline = detectNewline;
    }, {}], 90: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function isGenerator(obj) {
        return obj && typeof obj.next === "function" && typeof obj.throw === "function";
      }
      exports2.isGenerator = isGenerator;
      function isGeneratorFunction(fn) {
        return typeof fn === "function" && fn.constructor && fn.constructor.name === "GeneratorFunction";
      }
      exports2.isGeneratorFunction = isGeneratorFunction;
      function isClassConstructorFunction(a) {
        return a && a.prototype && a.prototype.constructor && a.prototype.constructor.toString().startsWith("class");
      }
      exports2.isClassConstructorFunction = isClassConstructorFunction;
    }, {}], 91: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Point = function() {
        function Point2(x, y) {
          this.x = x;
          this.y = y;
          this.set(x, y);
        }
        Point2.prototype.clone = function() {
          return new Point2(this.x, this.y);
        };
        Point2.prototype.set = function(x, y) {
          this.x = x;
          this.y = y;
          return this;
        };
        Point2.prototype.equals = function(x, y) {
          return this.x == x && this.y == y;
        };
        Point2.prototype.toString = function() {
          return "(" + this.x + "," + this.y + ")";
        };
        Point2.prototype.map = function(f) {
          this.x = f(this.x);
          this.y = f(this.y);
          return this;
        };
        Point2.prototype.add = function(x, y) {
          this.x += x;
          this.y += y;
          return this;
        };
        Point2.prototype.subtract = function(x, y) {
          this.x -= x;
          this.y -= y;
          return this;
        };
        Point2.prototype.scale = function(s2) {
          this.x *= s2;
          this.y *= s2;
          return this;
        };
        Point2.prototype.isZero = function() {
          return this.x === 0 && this.y == 0;
        };
        return Point2;
      }();
      exports2.Point = Point;
      var Rect = function() {
        function Rect2(left, top, right, bottom) {
          this.left = left;
          this.top = top;
          this.right = right;
          this.bottom = bottom;
        }
        Object.defineProperty(Rect2.prototype, "x", { get: function() {
          return this.left;
        }, set: function(v) {
          var diff = this.left - v;
          this.left = v;
          this.right -= diff;
        }, enumerable: true, configurable: true });
        Object.defineProperty(Rect2.prototype, "y", { get: function() {
          return this.top;
        }, set: function(v) {
          var diff = this.top - v;
          this.top = v;
          this.bottom -= diff;
        }, enumerable: true, configurable: true });
        Object.defineProperty(Rect2.prototype, "width", { get: function() {
          return this.right - this.left;
        }, set: function(v) {
          this.right = this.left + v;
        }, enumerable: true, configurable: true });
        Object.defineProperty(Rect2.prototype, "height", { get: function() {
          return this.bottom - this.top;
        }, set: function(v) {
          this.bottom = this.top + v;
        }, enumerable: true, configurable: true });
        Rect2.prototype.isEmpty = function() {
          return this.left >= this.right || this.top >= this.bottom;
        };
        Rect2.prototype.setRect = function(x, y, w, h) {
          this.left = x;
          this.top = y;
          this.right = x + w;
          this.bottom = y + h;
          return this;
        };
        Rect2.prototype.setBounds = function(l, t, r, b) {
          this.top = t;
          this.left = l;
          this.bottom = b;
          this.right = r;
          return this;
        };
        Rect2.prototype.equals = function(other) {
          return other && (this.isEmpty() && other.isEmpty() || this.top == other.top && this.left == other.left && this.bottom == other.bottom && this.right == other.right);
        };
        Rect2.prototype.clone = function() {
          return new Rect2(this.left, this.top, this.right - this.left, this.bottom - this.top);
        };
        Rect2.prototype.center = function() {
          if (this.isEmpty()) {
            throw new Error("Empty rectangles do not have centers");
          }
          return new Point(this.left + (this.right - this.left) / 2, this.top + (this.bottom - this.top) / 2);
        };
        Rect2.prototype.copyFrom = function(other) {
          this.top = other.top;
          this.left = other.left;
          this.bottom = other.bottom;
          this.right = other.right;
          return this;
        };
        Rect2.prototype.translate = function(x, y) {
          this.left += x;
          this.right += x;
          this.top += y;
          this.bottom += y;
          return this;
        };
        Rect2.prototype.toString = function() {
          return "[" + this.x + "," + this.y + "," + this.width + "," + this.height + "]";
        };
        Rect2.prototype.union = function(other) {
          return this.clone().expandToContain(other);
        };
        Rect2.prototype.contains = function(other) {
          if (other.isEmpty())
            return true;
          if (this.isEmpty())
            return false;
          return other.left >= this.left && other.right <= this.right && other.top >= this.top && other.bottom <= this.bottom;
        };
        Rect2.prototype.intersect = function(other) {
          return this.clone().restrictTo(other);
        };
        Rect2.prototype.intersects = function(other) {
          if (this.isEmpty() || other.isEmpty()) {
            return false;
          }
          var x1 = Math.max(this.left, other.left);
          var x2 = Math.min(this.right, other.right);
          var y1 = Math.max(this.top, other.top);
          var y2 = Math.min(this.bottom, other.bottom);
          return x1 < x2 && y1 < y2;
        };
        Rect2.prototype.restrictTo = function(other) {
          if (this.isEmpty() || other.isEmpty()) {
            return this.setRect(0, 0, 0, 0);
          }
          var x1 = Math.max(this.left, other.left);
          var x2 = Math.min(this.right, other.right);
          var y1 = Math.max(this.top, other.top);
          var y2 = Math.min(this.bottom, other.bottom);
          return this.setRect(x1, y1, Math.max(0, x2 - x1), Math.max(0, y2 - y1));
        };
        Rect2.prototype.expandToContain = function(other) {
          if (this.isEmpty()) {
            return this.copyFrom(other);
          }
          if (other.isEmpty()) {
            return this;
          }
          var l = Math.min(this.left, other.left);
          var r = Math.max(this.right, other.right);
          var t = Math.min(this.top, other.top);
          var b = Math.max(this.bottom, other.bottom);
          return this.setRect(l, t, r - l, b - t);
        };
        Rect2.prototype.round = function() {
          this.left = Math.floor(this.left);
          this.top = Math.floor(this.top);
          this.right = Math.ceil(this.right);
          this.bottom = Math.ceil(this.bottom);
          return this;
        };
        Rect2.prototype.scale = function(xscl, yscl) {
          this.left *= xscl;
          this.right *= xscl;
          this.top *= yscl;
          this.bottom *= yscl;
          return this;
        };
        Rect2.prototype.map = function(f) {
          this.left = f(this.left);
          this.top = f(this.top);
          this.right = f(this.right);
          this.bottom = f(this.bottom);
          return this;
        };
        Rect2.prototype.translateInside = function(other) {
          var offsetX = 0;
          if (this.left <= other.left) {
            offsetX = other.left - this.left;
          } else if (this.right > other.right) {
            offsetX = other.right - this.right;
          }
          var offsetY = 0;
          if (this.top <= other.top) {
            offsetY = other.top - this.top;
          } else if (this.bottom > other.bottom) {
            offsetY = other.bottom - this.bottom;
          }
          return this.translate(offsetX, offsetY);
        };
        Rect2.prototype.subtract = function(other) {
          var r = new Rect2(0, 0, 0, 0);
          var result = [];
          other = other.intersect(this);
          if (other.isEmpty()) {
            return [this.clone()];
          }
          r.setBounds(this.left, this.top, other.left, this.bottom);
          if (!r.isEmpty()) {
            result.push(r.clone());
          }
          r.setBounds(other.left, this.top, other.right, other.top);
          if (!r.isEmpty()) {
            result.push(r.clone());
          }
          r.setBounds(other.left, other.bottom, other.right, this.bottom);
          if (!r.isEmpty()) {
            result.push(r.clone());
          }
          r.setBounds(other.right, this.top, this.right, this.bottom);
          if (!r.isEmpty()) {
            result.push(r.clone());
          }
          return result;
        };
        Rect2.prototype.blend = function(rect, scalar) {
          return new Rect2(this.left + (rect.left - this.left) * scalar, this.top + (rect.top - this.top) * scalar, this.width + (rect.width - this.width) * scalar, this.height + (rect.height - this.height) * scalar);
        };
        Rect2.prototype.inflate = function(xscl, yscl) {
          var xAdj = (this.width * xscl - this.width) / 2;
          var s2 = arguments.length > 1 ? yscl : xscl;
          var yAdj = (this.height * s2 - this.height) / 2;
          this.left -= xAdj;
          this.right += xAdj;
          this.top -= yAdj;
          this.bottom += yAdj;
          return this;
        };
        Rect2.prototype.inflateFixed = function(fixed) {
          this.left -= fixed;
          this.right += fixed;
          this.top -= fixed;
          this.bottom += fixed;
          return this;
        };
        return Rect2;
      }();
      exports2.Rect = Rect;
    }, {}], 92: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./array"));
      __export(require2("./color"));
      __export(require2("./compareText"));
      __export(require2("./environment"));
      __export(require2("./event"));
      __export(require2("./exceptions"));
      __export(require2("./file"));
      __export(require2("./function"));
      __export(require2("./geometry"));
      __export(require2("./json"));
      __export(require2("./merge"));
      __export(require2("./mime"));
      __export(require2("./number"));
      __export(require2("./object"));
      __export(require2("./promise"));
      __export(require2("./string"));
      __export(require2("./time"));
      __export(require2("./tree"));
      __export(require2("./type"));
      __export(require2("./url"));
    }, { "./array": 81, "./color": 84, "./compareText": 85, "./environment": 86, "./event": 87, "./exceptions": 88, "./file": 89, "./function": 90, "./geometry": 91, "./json": 93, "./merge": 94, "./mime": 95, "./number": 96, "./object": 97, "./promise": 98, "./string": 106, "./time": 111, "./tree": 116, "./type": 117, "./url": 118 }], 93: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var object_1 = require2("./object");
      var type_1 = require2("./type");
      function parseJSON(s2, defaultValue2) {
        if (defaultValue2 === void 0) {
          defaultValue2 = void 0;
        }
        try {
          return JSON.parse(s2);
        } catch (error) {
          return defaultValue2;
        }
      }
      exports2.parseJSON = parseJSON;
      function stringifyJSON(s2, defaultValue2) {
        if (defaultValue2 === void 0) {
          defaultValue2 = void 0;
        }
        try {
          return JSON.stringify(s2);
        } catch (error) {
          return defaultValue2;
        }
      }
      exports2.stringifyJSON = stringifyJSON;
      function cloneJSON(a) {
        return JSON.parse(JSON.stringify(a));
      }
      exports2.cloneJSON = cloneJSON;
      function visitJson(o, v, _name) {
        if (type_1.isArray(o) && o) {
          return v(o, _name) || o.some(function(va, i) {
            return visitJson(va, v, i);
          });
        } else if (typeof o === "object" && o) {
          return v(o, _name) || object_1.objectToArray(o).some(function(o2) {
            return visitJson(o2.value, v, o2.key);
          });
        } else {
          return v(o, _name);
        }
      }
      exports2.visitJson = visitJson;
      function findJson(o, p, _name) {
        var r = void 0;
        visitJson(o, function(value, key) {
          if (p(value, key)) {
            r = { value, key };
            return true;
          }
          return false;
        });
        return r;
      }
      exports2.findJson = findJson;
      function isJSONObject(o) {
        return typeof o === "object" && !Array.isArray(o);
      }
      exports2.isJSONObject = isJSONObject;
    }, { "./object": 97, "./type": 117 }], 94: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var type_1 = require2("./type");
      function recursive(clone2) {
        return merge(clone2 === true, true, arguments);
      }
      exports2.recursive = recursive;
      function clone(input) {
        var output = input, type = type_1.typeOf(input), index, size;
        if (type === "array") {
          output = [];
          size = input.length;
          for (index = 0; index < size; ++index)
            output[index] = clone(input[index]);
        } else if (type === "object") {
          output = {};
          for (index in input)
            output[index] = clone(input[index]);
        }
        return output;
      }
      exports2.clone = clone;
      function mergeRecursive(base, extend) {
        if (type_1.typeOf(base) !== "object")
          return extend;
        for (var key in extend) {
          if (type_1.typeOf(base[key]) === "object" && type_1.typeOf(extend[key]) === "object") {
            base[key] = mergeRecursive(base[key], extend[key]);
          } else {
            base[key] = extend[key];
          }
        }
        return base;
      }
      exports2.mergeRecursive = mergeRecursive;
      function merge(clone_, recursive2) {
        var argv = [];
        for (var _i = 2; _i < arguments.length; _i++) {
          argv[_i - 2] = arguments[_i];
        }
        var result = argv[0], size = argv.length;
        if (clone_ || type_1.typeOf(result) !== "object")
          result = {};
        for (var index = 0; index < size; ++index) {
          var item = argv[index], type = type_1.typeOf(item);
          if (type !== "object")
            continue;
          for (var key in item) {
            if (key === "__proto__")
              continue;
            var sitem = clone_ ? clone(item[key]) : item[key];
            if (recursive2) {
              result[key] = mergeRecursive(result[key], sitem);
            } else {
              result[key] = sitem;
            }
          }
        }
        return result;
      }
      exports2.merge = merge;
    }, { "./type": 117 }], 95: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function getMimeTypeForExtension(extension) {
        return Object.keys(commonExtensionMimeTypeMap).find(function(a) {
          return commonExtensionMimeTypeMap[a].extensions.includes(extension);
        });
      }
      exports2.getMimeTypeForExtension = getMimeTypeForExtension;
      function getExtensionsForMimeType(mimeType) {
        var found = Object.keys(commonExtensionMimeTypeMap).find(function(a) {
          return a === mimeType;
        });
        return found && commonExtensionMimeTypeMap[found].extensions;
      }
      exports2.getExtensionsForMimeType = getExtensionsForMimeType;
      var commonExtensionMimeTypeMap = { "application/atom+xml": { extensions: ["atom"] }, "application/java-archive": { extensions: ["jar", "war", "ear"] }, "application/javascript": { extensions: ["js"] }, "application/json": { extensions: ["json"] }, "application/mac-binhex40": { extensions: ["hqx"] }, "application/msword": { extensions: ["doc"] }, "application/octet-stream": { extensions: ["bin", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm"] }, "application/pdf": { extensions: ["pdf"] }, "application/postscript": { extensions: ["ps", "eps", "ai"] }, "application/rss+xml": { extensions: ["rss"] }, "application/rtf": { extensions: ["rtf"] }, "application/vnd.apple.mpegurl": { extensions: ["m3u8"] }, "application/vnd.google-earth.kml+xml": { extensions: ["kml"] }, "application/vnd.google-earth.kmz": { extensions: ["kmz"] }, "application/vnd.ms-excel": { extensions: ["xls"] }, "application/vnd.ms-fontobject": { extensions: ["eot"] }, "application/vnd.ms-powerpoint": { extensions: ["ppt"] }, "application/vnd.oasis.opendocument.graphics": { extensions: ["odg"] }, "application/vnd.oasis.opendocument.presentation": { extensions: ["odp"] }, "application/vnd.oasis.opendocument.spreadsheet": { extensions: ["ods"] }, "application/vnd.oasis.opendocument.text": { extensions: ["odt"] }, "application/vnd.openxmlformats-officedocument.presentationml.presentation": { extensions: ["pptx"] }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { extensions: ["xlsx"] }, "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { extensions: ["docx"] }, "application/vnd.wap.wmlc": { extensions: ["wmlc"] }, "application/x-7z-compressed": { extensions: ["7z"] }, "application/x-cocoa": { extensions: ["cco"] }, "application/x-java-archive-diff": { extensions: ["jardiff"] }, "application/x-java-jnlp-file": { extensions: ["jnlp"] }, "application/x-makeself": { extensions: ["run"] }, "application/x-perl": { extensions: ["pl", "pm"] }, "application/x-pilot": { extensions: ["prc", "pdb"] }, "application/x-rar-compressed": { extensions: ["rar"] }, "application/x-redhat-package-manager": { extensions: ["rpm"] }, "application/x-sea": { extensions: ["sea"] }, "application/x-shockwave-flash": { extensions: ["swf"] }, "application/x-stuffit": { extensions: ["sit"] }, "application/x-tcl": { extensions: ["tcl", "tk"] }, "application/x-x509-ca-cert": { extensions: ["der", "pem", "crt"] }, "application/x-xpinstall": { extensions: ["xpi"] }, "application/xhtml+xml": { extensions: ["xhtml"] }, "application/xspf+xml": { extensions: ["xspf"] }, "application/zip": { extensions: ["zip"] }, "audio/midi": { extensions: ["mid", "midi", "kar"] }, "audio/mpeg": { extensions: ["mp3"] }, "audio/ogg": { extensions: ["ogg"] }, "audio/x-m4a": { extensions: ["m4a"] }, "audio/x-realaudio": { extensions: ["ra"] }, "font/woff": { extensions: ["woff"] }, "font/woff2": { extensions: ["woff2"] }, "image/gif": { extensions: ["gif"] }, "image/jpeg": { extensions: ["jpeg", "jpg"] }, "image/png": { extensions: ["png"] }, "image/svg+xml": { extensions: ["svg", "svgz"] }, "image/tiff": { extensions: ["tif", "tiff"] }, "image/vnd.wap.wbmp": { extensions: ["wbmp"] }, "image/webp": { extensions: ["webp"] }, "image/x-icon": { extensions: ["ico"] }, "image/x-jng": { extensions: ["jng"] }, "image/x-ms-bmp": { extensions: ["bmp"] }, "text/css": { extensions: ["css"] }, "text/html": { extensions: ["html", "htm", "shtml"] }, "text/mathml": { extensions: ["mml"] }, "text/plain": { extensions: ["txt"] }, "text/vnd.sun.j2me.app-descriptor": { extensions: ["jad"] }, "text/vnd.wap.wml": { extensions: ["wml"] }, "text/x-component": { extensions: ["htc"] }, "text/xml": { extensions: ["xml"] }, "video/3gpp": { extensions: ["3gpp", "3gp"] }, "video/mp2t": { extensions: ["ts"] }, "video/mp4": { extensions: ["mp4"] }, "video/mpeg": { extensions: ["mpeg", "mpg"] }, "video/quicktime": { extensions: ["mov"] }, "video/webm": { extensions: ["webm"] }, "video/x-flv": { extensions: ["flv"] }, "video/x-m4v": { extensions: ["m4v"] }, "video/x-mng": { extensions: ["mng"] }, "video/x-ms-asf": { extensions: ["asx", "asf"] }, "video/x-ms-wmv": { extensions: ["wmv"] }, "video/x-msvideo": { extensions: ["avi"] } };
    }, {}], 96: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var array_1 = require2("./array");
      var _unique = 0;
      function unique(prefix) {
        if (prefix === void 0) {
          prefix = "_";
        }
        return prefix + _unique++;
      }
      exports2.unique = unique;
      function randomIntBetween(a, b) {
        return Math.floor(Math.random() * b) + a;
      }
      exports2.randomIntBetween = randomIntBetween;
      function randomIntsBetween(l, min, max) {
        return array_1.array(l).map(function(n) {
          return randomFloatBetween(min, max);
        });
      }
      exports2.randomIntsBetween = randomIntsBetween;
      exports2.ints = randomIntsBetween;
      exports2.int = randomIntBetween;
      function randomFloatBetween(a, b) {
        return Math.random() * b + a;
      }
      exports2.randomFloatBetween = randomFloatBetween;
      function randomFloatsBetween(l, min, max) {
        return array_1.array(l).map(function(n) {
          return randomFloatBetween(min, max);
        });
      }
      exports2.randomFloatsBetween = randomFloatsBetween;
      exports2.floats = randomFloatsBetween;
      exports2.float = randomFloatBetween;
      function between(n, min, max) {
        return Math.max(min, Math.min(n, max));
      }
      exports2.between = between;
      function intBetween(n, min, max) {
        return Math.trunc(Math.max(min, Math.min(n, max)));
      }
      exports2.intBetween = intBetween;
    }, { "./array": 81 }], 97: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var type_1 = require2("./type");
      function objectKeys(o) {
        return Object.keys(o);
      }
      exports2.objectKeys = objectKeys;
      function objectMapValues(o, p) {
        var r = {};
        objectKeys(o).forEach(function(k) {
          r[k] = p(k, o[k]);
        });
        return r;
      }
      exports2.objectMapValues = objectMapValues;
      exports2.objectMap = objectMapValues;
      function objectToArray(o) {
        return objectKeys(o).map(function(key) {
          return { key, value: o[key] };
        });
      }
      exports2.objectToArray = objectToArray;
      function objectFilter(o, p) {
        var r = {};
        objectKeys(o).filter(function(k, v) {
          return p(k, o[k]);
        }).forEach(function(k) {
          r[k] = o[k];
        });
        return r;
      }
      exports2.objectFilter = objectFilter;
      function arrayToObject(a, fn) {
        var o = {};
        a.filter(type_1.notUndefined).forEach(function(k) {
          o[k] = fn(k);
        });
        return o;
      }
      exports2.arrayToObject = arrayToObject;
      function getObjectProperty(object, path, defaultValue2) {
        if (defaultValue2 === void 0) {
          defaultValue2 = void 0;
        }
        if (!path) {
          return object;
        } else if (object) {
          var tokens = typeof path === "string" ? path.split(".") : path, prev = object, n = 0;
          while (typeof prev !== "undefined" && n < tokens.length) {
            prev = prev[tokens[n++]];
          }
          if (typeof prev !== "undefined") {
            return prev;
          }
        }
        return defaultValue2;
      }
      exports2.getObjectProperty = getObjectProperty;
      function setObjectProperty(object, path, value) {
        if (!path || !object) {
          throw new Error("Insufficient arguments");
        }
        var tokens = typeof path === "string" ? path.split(".") : path, prev = object;
        if (tokens.length === 0) {
          Object.assign(object, value);
          return object;
        }
        for (var i = 0; i < tokens.length - 1; ++i) {
          var currentToken = tokens[i];
          if (typeof prev[currentToken] === "undefined") {
            prev[currentToken] = typeof tokens[i + 1] === "number" ? [] : {};
          } else {
            if (typeof tokens[i + 1] === "number" && !Array.isArray(prev[currentToken])) {
              throw new Error("Detected number path item on non array value. Path: " + path + ", item: " + tokens[i + 1] + ", Value: " + prev[currentToken]);
            }
          }
          prev = prev[currentToken];
        }
        if (tokens.length) {
          prev[tokens[tokens.length - 1]] = value;
        }
        return object;
      }
      exports2.setObjectProperty = setObjectProperty;
      function getObjectPropertyPaths(object, options) {
        if (options === void 0) {
          options = { ignoreArrayElements: true, leafsOnly: false };
        }
        function visit(object2, p3, p22) {
          if (p3 === void 0) {
            p3 = [];
          }
          if (p22 === void 0) {
            p22 = [];
          }
          var objectIsArray = type_1.isArray(object2);
          if (options.ignoreArrayElements && objectIsArray) {
            return;
          }
          for (var i in object2) {
            var v = object2[i];
            var objectName = objectIsArray ? parseInt(i) : i + "";
            var p32 = p22.concat([objectName]);
            if (type_1.isObject(v) || type_1.isArray(v)) {
              visit(v, p3, p32);
            }
            p3.push(p32);
            p3.push(p22);
          }
        }
        var p = [];
        var p2 = [];
        visit(object, p, p2);
        var result = p.filter(function(p3, i, a) {
          return a.length && a.findIndex(function(o) {
            return JSON.stringify(o) === JSON.stringify(p3);
          }) === i;
        }).sort(function(a, b) {
          return a.length - b.length;
        }).filter(function(a) {
          return a.length > 0;
        });
        if (options.leafsOnly) {
          return result.filter(function(p3) {
            return !result.find(function(p22) {
              return p22 !== p3 && p22.length > p3.length && JSON.stringify(p3) === JSON.stringify(p22.slice(0, p3.length));
            });
          });
        } else {
          return result;
        }
      }
      exports2.getObjectPropertyPaths = getObjectPropertyPaths;
    }, { "./type": 117 }], 98: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function serial(p) {
        return new Promise(function(resolve2) {
          p.reduce(function(promiseChain, currentTask) {
            return promiseChain.then(function(chainResults) {
              return currentTask().then(function(currentResult) {
                return chainResults.concat([currentResult]);
              });
            });
          }, Promise.resolve([])).then(function(arrayOfResults) {
            resolve2(arrayOfResults);
          });
        });
      }
      exports2.serial = serial;
      var Deferred = function() {
        function Deferred2(callback) {
          var instance = this;
          this.resolve = null;
          this.reject = null;
          this.status = "pending";
          this.promise = new Promise(function(resolve2, reject2) {
            instance.resolve = function() {
              this.status = "resolved";
              resolve2.apply(this, arguments);
            };
            instance.reject = function() {
              this.status = "rejected";
              reject2.apply(this, arguments);
            };
          });
          if (typeof callback === "function") {
            callback.call(this, this.resolve, this.reject);
          }
        }
        Deferred2.prototype.then = function(resolve2) {
          return this.promise.then(resolve2);
        };
        Deferred2.prototype.catch = function(r) {
          return this.promise.catch(r);
        };
        return Deferred2;
      }();
      exports2.Deferred = Deferred;
    }, {}], 99: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var array_1 = require2("../array");
      var BorderStyle;
      (function(BorderStyle2) {
        BorderStyle2["light"] = "light";
        BorderStyle2["double"] = "double";
        BorderStyle2["round"] = "round";
        BorderStyle2["heavy"] = "heavy";
        BorderStyle2["lightDouble"] = "lightDouble";
        BorderStyle2["doubleLight"] = "doubleLight";
        BorderStyle2["classic"] = "classic";
        BorderStyle2["lightTripleDash"] = "lightTripleDash";
        BorderStyle2["lightQuadrupleDash"] = "lightQuadrupleDash";
        BorderStyle2["lightDoubleDash"] = "lightDoubleDash";
        BorderStyle2["heavier"] = "heavier";
        BorderStyle2["roundDoubleDash"] = "roundDoubleDash";
        BorderStyle2["roundTripleDash"] = "roundTripleDash";
        BorderStyle2["roundQuadrupleDash"] = "roundQuadrupleDash";
        BorderStyle2["heavyDoubleDash"] = "heavyDoubleDash";
        BorderStyle2["heavyTripleDash"] = "heavyTripleDash";
        BorderStyle2["heavyQuadrupleDash"] = "heavyQuadrupleDash";
        BorderStyle2["singleRareCorners"] = "singleRareCorners";
        BorderStyle2["triangleCorners"] = "triangleCorners";
      })(BorderStyle = exports2.BorderStyle || (exports2.BorderStyle = {}));
      exports2.borderStyles = array_1.enumKeys(BorderStyle);
      (function(BorderSide) {
        BorderSide["topLeft"] = "topLeft";
        BorderSide["topRight"] = "topRight";
        BorderSide["bottomRight"] = "bottomRight";
        BorderSide["bottomLeft"] = "bottomLeft";
        BorderSide["left"] = "left";
        BorderSide["bottom"] = "bottom";
        BorderSide["top"] = "top";
        BorderSide["right"] = "right";
      })(exports2.BorderSide || (exports2.BorderSide = {}));
      function getBoxChar(s2, si) {
        return getBoxStyles()[s2][si];
      }
      exports2.getBoxChar = getBoxChar;
      var boxStyles;
      var getBoxStyles = function() {
        if (!boxStyles) {
          boxStyles = { light: { topLeft: "\u250C", topRight: "\u2510", bottomRight: "\u2518", bottomLeft: "\u2514", left: "\u2502", right: "\u2502", bottom: "\u2500", top: "\u2500" }, lightTripleDash: { topLeft: "\u250C", topRight: "\u2510", bottomRight: "\u2518", bottomLeft: "\u2514", left: "\u2506", right: "\u2506", bottom: "\u2504", top: "\u2504" }, lightQuadrupleDash: { topLeft: "\u250C", topRight: "\u2510", bottomRight: "\u2518", bottomLeft: "\u2514", left: "\u250A", right: "\u250A", bottom: "\u2508", top: "\u2508" }, lightDoubleDash: { topLeft: "\u250C", topRight: "\u2510", bottomRight: "\u2518", bottomLeft: "\u2514", left: "\u254E", right: "\u254E", bottom: "\u254C", top: "\u254C" }, double: { topLeft: "\u2554", topRight: "\u2557", bottomRight: "\u255D", bottomLeft: "\u255A", left: "\u2551", right: "\u2551", bottom: "\u2550", top: "\u2550" }, round: { topLeft: "\u256D", topRight: "\u256E", bottomRight: "\u256F", bottomLeft: "\u2570", left: "\u2502", right: "\u2502", bottom: "\u2500", top: "\u2500" }, roundDoubleDash: { topLeft: "\u256D", topRight: "\u256E", bottomRight: "\u256F", bottomLeft: "\u2570", left: "\u254E", right: "\u254E", bottom: "\u254C", top: "\u254C" }, roundTripleDash: { topLeft: "\u256D", topRight: "\u256E", bottomRight: "\u256F", bottomLeft: "\u2570", left: "\u2506", right: "\u2506", bottom: "\u2504", top: "\u2504" }, roundQuadrupleDash: { topLeft: "\u256D", topRight: "\u256E", bottomRight: "\u256F", bottomLeft: "\u2570", left: "\u250A", right: "\u250A", bottom: "\u2508", top: "\u2508" }, heavy: { topLeft: "\u250F", topRight: "\u2513", bottomRight: "\u251B", bottomLeft: "\u2517", left: "\u2503", right: "\u2503", bottom: "\u2501", top: "\u2501" }, heavyDoubleDash: { topLeft: "\u250F", topRight: "\u2513", bottomRight: "\u251B", bottomLeft: "\u2517", left: "\u254F", right: "\u254F", bottom: "\u254D", top: "\u254D" }, heavyTripleDash: { topLeft: "\u250F", topRight: "\u2513", bottomRight: "\u251B", bottomLeft: "\u2517", left: "\u2507", right: "\u2507", bottom: "\u2505", top: "\u2505" }, heavyQuadrupleDash: { topLeft: "\u250F", topRight: "\u2513", bottomRight: "\u251B", bottomLeft: "\u2517", left: "\u250B", right: "\u250B", bottom: "\u2509", top: "\u2509" }, heavier: { topLeft: "\u259B", topRight: "\u259C", bottomRight: "\u259F", bottomLeft: "\u2599", left: "\u258C", right: "\u2590", bottom: "\u2584", top: "\u2580" }, lightDouble: { topLeft: "\u2553", topRight: "\u2556", bottomRight: "\u255C", bottomLeft: "\u2559", left: "\u2551", right: "\u2551", bottom: "\u2500", top: "\u2500" }, singleRareCorners: { bottom: "\u23BD", top: "\u23BA", left: "\u23A2", right: "\u23A5", topLeft: "\u23A1", topRight: "\u23A4", bottomRight: "\u23A6", bottomLeft: "\u23A3" }, triangleCorners: { bottom: "_", top: "\u23BB", left: "\u23B8", right: " \u23B8", topLeft: "\u25F8", topRight: "\u25F9", bottomRight: "\u25FF", bottomLeft: "\u25FA" }, doubleLight: { topLeft: "\u2552", topRight: "\u2555", bottomRight: "\u255B", bottomLeft: "\u2558", left: "\u2502", right: "\u2502", bottom: "\u2550", top: "\u2550" }, classic: { topLeft: "+", topRight: "+", bottomRight: "+", bottomLeft: "+", left: "|", right: "|", bottom: "\u2550", top: "-" } };
        }
        return boxStyles;
      };
    }, { "../array": 81 }], 100: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function changeText(text, toInsert) {
        var s2 = text.split("");
        var indexIncr = 0;
        toInsert.forEach(function(data) {
          data.toAdd = data.toAdd || "";
          data.toRemove = data.toRemove || "";
          s2.splice.apply(s2, [data.pos + indexIncr, data.toRemove.length].concat(data.toAdd.split("")));
          indexIncr += data.toAdd.length - data.toRemove.length;
        });
        return s2.join("");
      }
      exports2.changeText = changeText;
    }, {}], 101: [function(require, module, exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      function evaluate(s, defaultValue) {
        if (defaultValue === void 0) {
          defaultValue = void 0;
        }
        try {
          return eval("(" + s + ")");
        } catch (error) {
          return defaultValue;
        }
      }
      exports.evaluate = evaluate;
      function stringToObject(s2, propSep, nameValueSep) {
        if (s2 === void 0) {
          s2 = "";
        }
        if (propSep === void 0) {
          propSep = ",";
        }
        if (nameValueSep === void 0) {
          nameValueSep = ":";
        }
        var a = s2.split(propSep).map(function(s3) {
          return s3.trim();
        });
        var o = {};
        a.forEach(function(f) {
          var b = f.split(nameValueSep).map(function(a2) {
            return a2.trim();
          });
          if (b.length !== 2) {
            return;
          }
          o[b[0]] = b[1];
        });
        return o;
      }
      exports.stringToObject = stringToObject;
    }, {}], 102: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var array_1 = require2("../array");
      function quote(s2, q) {
        if (q === void 0) {
          q = '"';
        }
        return q + s2.replace(new RegExp(q, "g"), "\\" + q) + q;
      }
      exports2.quote = quote;
      function unquote(s2) {
        return s2.substring(1, s2.length - 1);
      }
      exports2.unquote = unquote;
      function repeat(n, s2) {
        return array_1.array(n, s2).join("");
      }
      exports2.repeat = repeat;
      function indent(i, tabSize) {
        if (i === void 0) {
          i = 1;
        }
        if (tabSize === void 0) {
          tabSize = 2;
        }
        return repeat(i * tabSize, " ");
      }
      exports2.indent = indent;
      function wordWrap(s2, w, newLine) {
        if (newLine === void 0) {
          newLine = "\n";
        }
        var n = newLine.replace(/\\/, "\\\\");
        return s2.replace(new RegExp("(?![^" + n + "]{1," + w + "}$)([^" + n + "]{1," + w + "})\\s", "g"), "$1" + newLine);
      }
      exports2.wordWrap = wordWrap;
    }, { "../array": 81 }], 103: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function getPreviousMatchingPos(text, pos, predicate) {
        pos = text.length <= pos ? text.length : pos;
        if (typeof predicate === "string") {
          var s_1 = predicate;
          predicate = function(c) {
            return c === s_1;
          };
        }
        while (pos >= 0) {
          var char = text[pos];
          if (!predicate(char)) {
            pos--;
          } else {
            break;
          }
        }
        return pos;
      }
      exports2.getPreviousMatchingPos = getPreviousMatchingPos;
      function getPosition(string, subString, n) {
        return string.split(subString, n).join(subString).length;
      }
      exports2.getPosition = getPosition;
    }, {}], 104: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function hashCode(s2) {
        var h = 0, l = s2.length, i = 0;
        if (l > 0) {
          while (i < l) {
            h = (h << 5) - h + s2.charCodeAt(i++) | 0;
          }
        }
        return h;
      }
      exports2.hashCode = hashCode;
    }, {}], 105: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function escapeHtmlAttribute(code) {
        return code.replace(/\"/gim, "&quot;");
      }
      exports2.escapeHtmlAttribute = escapeHtmlAttribute;
      function unEscapeHtmlAttribute(code) {
        return code.replace(/\&quot\;/gim, '"');
      }
      exports2.unEscapeHtmlAttribute = unEscapeHtmlAttribute;
      function wrapInHtml(s2) {
        return '\n  <!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8" />\n  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <title>title</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n' + s2 + "\n</body>\n</html>\n";
      }
      exports2.wrapInHtml = wrapInHtml;
      function styleObjectToCss(o, propertiesSeparator) {
        if (propertiesSeparator === void 0) {
          propertiesSeparator = "";
        }
        return Object.keys(o).map(function(p) {
          return stylePropertyNameToCssSyntax(p) + ": " + o[p] + ";";
        }).join(propertiesSeparator);
      }
      exports2.styleObjectToCss = styleObjectToCss;
      function stylePropertyNameToCssSyntax(s2) {
        var t;
        while (t = /([A-Z])/.exec(s2)) {
          s2 = s2.substring(0, t.index) + "-" + t[1].toLowerCase() + s2.substring(t.index + 1, s2.length);
        }
        return s2;
      }
      exports2.stylePropertyNameToCssSyntax = stylePropertyNameToCssSyntax;
    }, {}], 106: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./boxes"));
      __export(require2("./change"));
      __export(require2("./evaluate"));
      __export(require2("./format"));
      __export(require2("./getPreviousMatchingPos"));
      __export(require2("./hash"));
      __export(require2("./html"));
      __export(require2("./template"));
      __export(require2("./whiteSpace"));
    }, { "./boxes": 99, "./change": 100, "./evaluate": 101, "./format": 102, "./getPreviousMatchingPos": 103, "./hash": 104, "./html": 105, "./template": 107, "./whiteSpace": 108 }], 107: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var cache = {};
      function template(str, data) {
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || template(str) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn;
      }
      exports2.template = template;
    }, {}], 108: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function shorter(text, much) {
        if (much === void 0) {
          much = 10;
        }
        return text.trim().substring(0, Math.min(text.length, much)) + "...";
      }
      exports2.shorter = shorter;
      function removeWhites(s2, replaceWith) {
        if (replaceWith === void 0) {
          replaceWith = " ";
        }
        return s2.replace(/\s+/gm, replaceWith).trim();
      }
      exports2.removeWhites = removeWhites;
      function removeEmptyLines(c, newLine) {
        if (newLine === void 0) {
          newLine = "\n";
        }
        return c.split(newLine).filter(function(l) {
          return !!l.trim();
        }).join(newLine);
      }
      exports2.removeEmptyLines = removeEmptyLines;
      function trimRightLines(s2, newLine) {
        if (newLine === void 0) {
          newLine = "\n";
        }
        return s2.split(newLine).map(function(l) {
          return l.trimRight();
        }).join(newLine);
      }
      exports2.trimRightLines = trimRightLines;
    }, {}], 109: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var type_1 = require2("../type");
      function animate(_a) {
        var duration = _a.duration, draw = _a.draw, timing = _a.timing, lapse = _a.lapse, end = _a.end;
        return new Promise(function(resolve2) {
          if (type_1.isObject(timing)) {
            timing = timing.fn(duration);
          }
          var start = Date.now();
          var progress = 0;
          requestAnimationFrame(function anim(time) {
            var timeFraction = (time - start) / duration;
            if (timeFraction > 1)
              timeFraction = 1;
            progress = timing(timeFraction, time - start, duration);
            draw(progress);
            if (timeFraction < 1) {
              requestAnimationFrame(anim, lapse);
            } else {
              end && end();
              resolve2();
            }
          });
        });
      }
      exports2.animate = animate;
      function requestAnimationFrame(f, lapse) {
        if (lapse === void 0) {
          lapse = 0;
        }
        setTimeout(function() {
          return f(Date.now());
        }, lapse);
      }
      (function(easing) {
        function makeEaseOut(timing) {
          return function(timeFraction) {
            return 1 - timing(1 - timeFraction);
          };
        }
        function bounceFn(timeFraction) {
          for (var a = 0, b_1 = 1; 1; a += b_1, b_1 /= 2) {
            if (timeFraction >= (7 - 4 * a) / 11) {
              return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b_1, 2);
            }
          }
        }
        easing.bounceEasyOut = function() {
          return makeEaseOut(bounceFn);
        };
        function quad(timeFraction) {
          return Math.pow(timeFraction, 2);
        }
        easing.quad = quad;
        easing.back = function(x) {
          if (x === void 0) {
            x = 1.5;
          }
          return function(timeFraction) {
            return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
          };
        };
        easing.elastic = function(x) {
          if (x === void 0) {
            x = 1.5;
          }
          return function(timeFraction) {
            return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction);
          };
        };
        function makeEaseInOut(timing) {
          return function(timeFraction) {
            if (timeFraction < 0.5)
              return timing(2 * timeFraction) / 2;
            else
              return (2 - timing(2 * (1 - timeFraction))) / 2;
          };
        }
        easing.bounceEaseInOut = function() {
          return makeEaseInOut(bounceFn);
        };
        var c = 1;
        var b = 0;
        easing.easeInQuad = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * (t /= d) * t + b;
            };
          } };
        };
        easing.easeOutQuad = function() {
          return { fn: function(d) {
            return function(x, t) {
              return -c * (t /= d) * (t - 2) + b;
            };
          } };
        };
        easing.easeInOutQuad = function() {
          return { fn: function(d) {
            return function(x, t) {
              if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
              return -c / 2 * (--t * (t - 2) - 1) + b;
            };
          } };
        };
        easing.easeInElastic = function() {
          return { fn: function(d) {
            return function(x, t) {
              var s2 = 1.70158;
              var p = 0;
              var a = c;
              if (t == 0)
                return b;
              if ((t /= d) == 1)
                return b + c;
              if (!p)
                p = d * 0.3;
              if (a < Math.abs(c)) {
                a = c;
              } else {
                s2 = p / (2 * Math.PI) * Math.asin(c / a);
              }
              return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s2) * (2 * Math.PI) / p)) + b;
            };
          } };
        };
        easing.easeOutBounce = function() {
          return { fn: function(d) {
            return function(x, t) {
              if ((t /= d) < 1 / 2.75) {
                return c * (7.5625 * t * t) + b;
              } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
              } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
              } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
              }
            };
          } };
        };
        easing.easeInCubic = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * (t /= d) * t * t + b;
            };
          } };
        };
        easing.easeOutCubic = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * ((t = t / d - 1) * t * t + 1) + b;
            };
          } };
        };
        easing.easeInOutCubic = function() {
          return { fn: function(d) {
            return function(x, t) {
              if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
              return c / 2 * ((t -= 2) * t * t + 2) + b;
            };
          } };
        };
        easing.easeInQuart = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * (t /= d) * t * t * t + b;
            };
          } };
        };
        easing.easeInOutQuart = function() {
          return { fn: function(d) {
            return function(x, t) {
              if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
              return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            };
          } };
        };
        easing.easeInQuint = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * (t /= d) * t * t * t * t + b;
            };
          } };
        };
        easing.easeOutQuint = function() {
          return { fn: function(d) {
            return function(x, t) {
              return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            };
          } };
        };
        easing.easeInExpo = function() {
          return { fn: function(d) {
            return function(x, t) {
              return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            };
          } };
        };
        easing.easeInOutQuint = function() {
          return { fn: function(d) {
            return function(x, t) {
              if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
              return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            };
          } };
        };
        easing.easeInSine = function() {
          return { fn: function(d) {
            return function(x, t) {
              return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            };
          } };
        };
        easing.easeInOutElastic = function() {
          return { fn: function(d) {
            return function(x, t) {
              var s2 = 1.70158;
              var p = 0;
              var a = c;
              if (t == 0)
                return b;
              if ((t /= d / 2) == 2)
                return b + c;
              if (!p)
                p = d * (0.3 * 1.5);
              if (a < Math.abs(c)) {
                a = c;
              } else {
                s2 = p / (2 * Math.PI) * Math.asin(c / a);
              }
              if (t < 1)
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s2) * (2 * Math.PI) / p)) + b;
              return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s2) * (2 * Math.PI) / p) * 0.5 + c + b;
            };
          } };
        };
        easing.easeOutElastic = function() {
          return { fn: function(d) {
            return function(x, t) {
              var s2 = 1.70158;
              var p = 0;
              var a = c;
              if (t == 0)
                return b;
              if ((t /= d) == 1)
                return b + c;
              if (!p)
                p = d * 0.3;
              if (a < Math.abs(c)) {
                a = c;
              } else {
                s2 = p / (2 * Math.PI) * Math.asin(c / a);
              }
              return a * Math.pow(2, -10 * t) * Math.sin((t * d - s2) * (2 * Math.PI) / p) + c + b;
            };
          } };
        };
        easing.easeInOutExpo = function() {
          return { fn: function(d) {
            return function(x, t) {
              if (t == 0)
                return b;
              if (t == d)
                return b + c;
              if ((t /= d / 2) < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
              return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            };
          } };
        };
        easing.easeInOutBack = function() {
          return { fn: function(d) {
            return function(x, t) {
              var s2 = 1.70158;
              if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s2 *= 1.525) + 1) * t - s2)) + b;
              return c / 2 * ((t -= 2) * t * (((s2 *= 1.525) + 1) * t + s2) + 2) + b;
            };
          } };
        };
        easing.easeOutBack = function() {
          return { fn: function(d) {
            return function(x, t, d2) {
              var s2 = 1.70158;
              return c * ((t = t / d2 - 1) * t * ((s2 + 1) * t + s2) + 1) + b;
            };
          } };
        };
        easing.easeInBounce = function() {
          return { fn: function(d) {
            return function(x, t, d2) {
              return c - easing.easeOutBounce().fn(d2)(x, d2 - t, 0, c, d2) + b;
            };
          } };
        };
        easing.easeInOutBounce = function() {
          return { fn: function(d) {
            return function(x, t, d2) {
              if (t < d2 / 2)
                return easing.easeInBounce().fn(d2)(x, t * 2, 0, c, d2) * 0.5 + b;
              return easing.easeOutBounce().fn(d2)(x, t * 2 - d2, 0, c, d2) * 0.5 + c * 0.5 + b;
            };
          } };
        };
      })(exports2.easing || (exports2.easing = {}));
    }, { "../type": 117 }], 110: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function formatDate(date, format) {
        if (typeof date === "string") {
          date = new Date(date);
        }
        var dd = date.getDay();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
        if (format === "YYYY-MM-DD") {
          return yyyy + "-" + mm + "-" + dd;
        } else {
          return mm + "/" + dd + "/" + yyyy;
        }
      }
      exports2.formatDate = formatDate;
      function formatDateTime(date, format) {
        if (typeof date === "string") {
          date = new Date(date);
        }
        var hh = ("" + date.getHours()).length < 2 ? "0" + date.getHours() : "" + date.getHours();
        var mm = ("" + date.getMinutes()).length < 2 ? "0" + date.getMinutes() : "" + date.getMinutes();
        return formatDate(date, "YYYY-MM-DD") + "T" + hh + ":" + mm;
      }
      exports2.formatDateTime = formatDateTime;
    }, {}], 111: [function(require2, module2, exports2) {
      function __export(m) {
        for (var p in m)
          if (!exports2.hasOwnProperty(p))
            exports2[p] = m[p];
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
      __export(require2("./anim"));
      __export(require2("./format"));
      __export(require2("./printMs"));
      __export(require2("./sleep"));
      __export(require2("./throttle"));
      __export(require2("./waitFor"));
    }, { "./anim": 109, "./format": 110, "./printMs": 112, "./sleep": 113, "./throttle": 114, "./waitFor": 115 }], 112: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      function printMs(ms, config) {
        if (config === void 0) {
          config = { minutes: false, seconds: true, ms: true };
        }
        config = __assign({ minutes: false, seconds: true, ms: true }, config);
        var seconds = config.seconds && Math.floor(ms / 1e3);
        var minutes = config.minutes && seconds && (config.ms ? Math.floor(seconds / 60) : Math.round(seconds / 60));
        var milliseconds = config.ms && Math.floor(ms % 1e3 || ms);
        return "" + (minutes ? minutes + " minutes " : "") + (seconds ? seconds + " seconds " : "") + (milliseconds ? milliseconds + " ms " : "");
      }
      exports2.printMs = printMs;
    }, {}], 113: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function sleep(ms) {
        return new Promise(function(resolve2) {
          setTimeout(function() {
            resolve2();
          }, ms);
        });
      }
      exports2.sleep = sleep;
      exports2.wait = sleep;
      function withTime(label, fn) {
        console.time(label);
        var r = fn();
        console.timeEnd(label);
        return r;
      }
      exports2.withTime = withTime;
    }, {}], 114: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function throttle(func, wait, options) {
        if (options === void 0) {
          options = {};
        }
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          result = func.apply(context, args);
          context = args = null;
        };
        return function() {
          var now = Date.now();
          if (!previous && options.leading === false)
            previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      }
      exports2.throttle = throttle;
    }, {}], 115: [function(require2, module2, exports2) {
      var __assign = this && this.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve2, reject2) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject2(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject2(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : new P(function(resolve3) {
              resolve3(result.value);
            }).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _1 = require2(".");
      var defaultOptions = { interval: 200, timeout: 3e3 };
      function waitForPredicate(p, options) {
        if (options === void 0) {
          options = { interval: 200, timeout: 3e3 };
        }
        return __awaiter(this, void 0, void 0, function() {
          var o, t, r;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                o = typeof options == "string" ? __assign({}, defaultOptions, { timeoutError: options }) : options;
                t = setTimeout(function() {
                  var msg = o.timeoutError || p.toString().substring(0, Math.min(p.toString().length, 100));
                  throw new Error(msg);
                }, o.timeout || 3e3);
                _a.label = 1;
              case 1:
                if (!!(r = p()))
                  return [3, 3];
                return [4, _1.sleep(o.interval || 200)];
              case 2:
                _a.sent();
                return [3, 1];
              case 3:
                t && clearTimeout(t);
                return [2, r];
            }
          });
        });
      }
      exports2.waitForPredicate = waitForPredicate;
    }, { ".": 111 }], 116: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function visitChildren(n, v) {
        v(n);
        (n.childNodes || []).forEach(function(c) {
          return visitChildren(c, v);
        });
      }
      exports2.visitChildren = visitChildren;
      function mapChildren(n, v) {
        var o = [];
        visitChildren(n, function(c) {
          return o.push(v(c));
        });
        return o;
      }
      exports2.mapChildren = mapChildren;
      function findChildren(n, p) {
        return (n.childNodes || []).find(p);
      }
      exports2.findChildren = findChildren;
      function filterChildren(n, p) {
        return (n.childNodes || []).filter(function(c) {
          return p(c);
        });
      }
      exports2.filterChildren = filterChildren;
      function getChildIndex(node, children) {
        if (children === void 0) {
          children = void 0;
        }
        var result = -1;
        node.parentNode && (children || (node.parentNode ? node.parentNode.childNodes || [] : [])).find(function(c, i) {
          if (c === node) {
            result = i;
            return true;
          }
          return false;
        });
        return result;
      }
      exports2.getChildIndex = getChildIndex;
      function getNextSibling(node) {
        var index = getChildIndex(node, node.childNodes);
        return node.parentNode && index < (node.childNodes || []).length - 1 ? (node.childNodes || [])[index + 1] : void 0;
      }
      exports2.getNextSibling = getNextSibling;
      function getSiblings(node, getChildrenMode) {
        return node.parentNode ? (node.parentNode.childNodes || []).filter(function(c) {
          return c !== node;
        }) : [];
      }
      exports2.getSiblings = getSiblings;
      function getPreviousSibling(node) {
        var index = getChildIndex(node, node.childNodes);
        return index > 0 && node.parentNode ? (node.childNodes || [])[index - 1] : void 0;
      }
      exports2.getPreviousSibling = getPreviousSibling;
      function visitAncestors(n, v, o) {
        return !n || v(n) || !n.parentNode || visitAncestors(n.parentNode, v);
      }
      exports2.visitAncestors = visitAncestors;
      function findAncestor(n, p, o) {
        var a;
        visitAncestors(n, function(c) {
          if (p(c)) {
            a = c;
            return true;
          }
          return false;
        });
        return a;
      }
      exports2.findAncestor = findAncestor;
      function findRootElement(n) {
        return !n ? void 0 : !n.parentNode ? n : findAncestor(n.parentNode, function(p) {
          return !p.parentNode;
        });
      }
      exports2.findRootElement = findRootElement;
      function filterAncestors(n, p, o) {
        var a = [];
        visitAncestors(n, function(c) {
          if (p(c)) {
            a.push(c);
          }
          return false;
        });
        return a;
      }
      exports2.filterAncestors = filterAncestors;
      function visitDescendants(n, v, o, inRecursion) {
        if (o === void 0) {
          o = {};
        }
        if (inRecursion === void 0) {
          inRecursion = false;
        }
        var r = false;
        if (o.childrenFirst) {
          r = (n.childNodes || []).some(function(c) {
            return visitDescendants(c, v, o, true);
          });
          if (r) {
            if (!o.breakOnDescendantSignal && (o.andSelf || inRecursion)) {
              v(n);
            }
            return true;
          } else if (o.andSelf || inRecursion) {
            r = v(n);
          }
          return false;
        } else {
          if (o.andSelf || inRecursion) {
            r = v(n);
          }
          if (r) {
            if (!o.visitDescendantsOnSelfSignalAnyway) {
              return true;
            } else {
              return (n.childNodes || []).some(function(c) {
                return visitDescendants(c, v, o, true);
              }) || true;
            }
          } else {
            return (n.childNodes || []).some(function(c) {
              return visitDescendants(c, v, o, true);
            });
          }
        }
      }
      exports2.visitDescendants = visitDescendants;
      function filterDescendants(n, p, o) {
        if (o === void 0) {
          o = {};
        }
        var a = [];
        visitDescendants(n, function(c) {
          if (p(c)) {
            a.push(c);
          }
          return false;
        }, o);
        return a;
      }
      exports2.filterDescendants = filterDescendants;
      function mapDescendants(n, p, o) {
        if (o === void 0) {
          o = {};
        }
        var a = [];
        visitDescendants(n, function(c) {
          a.push(p(c));
          return false;
        }, o);
        return a;
      }
      exports2.mapDescendants = mapDescendants;
      function findDescendant(n, p, o) {
        if (o === void 0) {
          o = {};
        }
        var a;
        visitDescendants(n, function(c) {
          if (p(c)) {
            a = c;
            return true;
          }
          return false;
        }, o);
        return a;
      }
      exports2.findDescendant = findDescendant;
      function getAncestors(node) {
        var a = node;
        var result = [];
        while (a && (a = a.parentNode)) {
          result.push(a);
        }
        return result;
      }
      exports2.getAncestors = getAncestors;
      function getDistanceToAncestor(node, ancestor) {
        if (node === ancestor || !node || !ancestor) {
          return 0;
        } else {
          return getDistanceToAncestor(node.parentNode, ancestor) + 1;
        }
      }
      exports2.getDistanceToAncestor = getDistanceToAncestor;
    }, {}], 117: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var toStr = Object.prototype.toString;
      function getType(type) {
        return toStr.call(type);
      }
      exports2.getType = getType;
      function isObject(obj) {
        return typeof obj === "object" && getType(obj) === "[object Object]";
      }
      exports2.isObject = isObject;
      exports2.isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === "[object Array]";
      };
      function isString(a) {
        return typeof a === "string";
      }
      exports2.isString = isString;
      function isBoolean(obj) {
        return typeof obj === "boolean" || getType(obj) === "[object Boolean]";
      }
      exports2.isBoolean = isBoolean;
      function typeOf(input) {
        return {}.toString.call(input).slice(8, -1).toLowerCase();
      }
      exports2.typeOf = typeOf;
      function notUndefined(n) {
        return n !== void 0;
      }
      exports2.notUndefined = notUndefined;
      function notFalsy(n) {
        return !!n;
      }
      exports2.notFalsy = notFalsy;
    }, {}], 118: [function(require2, module2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      function getFileNameFromUrl(url) {
        var hashIndex = url.indexOf("#");
        url = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
        return (url.split("/").pop() || "").replace(/[\?].*$/g, "");
      }
      exports2.getFileNameFromUrl = getFileNameFromUrl;
      function getParametersFromUrl(url) {
        var queryString = url.split("?")[1];
        var obj = {};
        if (!queryString) {
          return obj;
        }
        queryString = queryString.split("#")[0];
        var arr = queryString.split("&");
        for (var i = 0; i < arr.length; i++) {
          var a = arr[i].split("=");
          obj[a[0]] = a[1] || "";
        }
        return obj;
      }
      exports2.getParametersFromUrl = getParametersFromUrl;
    }, {}], 119: [function(require2, module2, exports2) {
      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;
      function toObject(val) {
        if (val === null || val === void 0) {
          throw new TypeError("Object.assign cannot be called with null or undefined");
        }
        return Object(val);
      }
      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false;
          }
          var test1 = new String("abc");
          test1[5] = "de";
          if (Object.getOwnPropertyNames(test1)[0] === "5") {
            return false;
          }
          var test2 = {};
          for (var i = 0; i < 10; i++) {
            test2["_" + String.fromCharCode(i)] = i;
          }
          var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
            return test2[n];
          });
          if (order2.join("") !== "0123456789") {
            return false;
          }
          var test3 = {};
          "abcdefghijklmnopqrst".split("").forEach(function(letter) {
            test3[letter] = letter;
          });
          if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
            return false;
          }
          return true;
        } catch (err) {
          return false;
        }
      }
      module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
        var from;
        var to = toObject(target);
        var symbols;
        for (var s2 = 1; s2 < arguments.length; s2++) {
          from = Object(arguments[s2]);
          for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
            }
          }
          if (getOwnPropertySymbols) {
            symbols = getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
              if (propIsEnumerable.call(from, symbols[i])) {
                to[symbols[i]] = from[symbols[i]];
              }
            }
          }
        }
        return to;
      };
    }, {}], 120: [function(require2, module2, exports2) {
      (function(process) {
        function normalizeArray(parts, allowAboveRoot) {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up--; up) {
              parts.unshift("..");
            }
          }
          return parts;
        }
        exports2.resolve = function() {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : process.cwd();
            if (typeof path !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/";
          }
          resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
            return !!p;
          }), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        };
        exports2.normalize = function(path) {
          var isAbsolute = exports2.isAbsolute(path), trailingSlash = substr(path, -1) === "/";
          path = normalizeArray(filter(path.split("/"), function(p) {
            return !!p;
          }), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        };
        exports2.isAbsolute = function(path) {
          return path.charAt(0) === "/";
        };
        exports2.join = function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return exports2.normalize(filter(paths, function(p, index) {
            if (typeof p !== "string") {
              throw new TypeError("Arguments to path.join must be strings");
            }
            return p;
          }).join("/"));
        };
        exports2.relative = function(from, to) {
          from = exports2.resolve(from).substr(1);
          to = exports2.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "")
                break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "")
                break;
            }
            if (start > end)
              return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        };
        exports2.sep = "/";
        exports2.delimiter = ":";
        exports2.dirname = function(path) {
          if (typeof path !== "string")
            path = path + "";
          if (path.length === 0)
            return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1)
            return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) {
            return "/";
          }
          return path.slice(0, end);
        };
        function basename(path) {
          if (typeof path !== "string")
            path = path + "";
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
          }
          if (end === -1)
            return "";
          return path.slice(start, end);
        }
        exports2.basename = function(path, ext) {
          var f = basename(path);
          if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
          }
          return f;
        };
        exports2.extname = function(path) {
          if (typeof path !== "string")
            path = path + "";
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        };
        function filter(xs, f) {
          if (xs.filter)
            return xs.filter(f);
          var res = [];
          for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs))
              res.push(xs[i]);
          }
          return res;
        }
        var substr = "ab".substr(-1) === "b" ? function(str, start, len) {
          return str.substr(start, len);
        } : function(str, start, len) {
          if (start < 0)
            start = str.length + start;
          return str.substr(start, len);
        };
      }).call(this, require2("_process"));
    }, { _process: 121 }], 121: [function(require2, module2, exports2) {
      var process = module2.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      (function() {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e2) {
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = "";
      process.versions = {};
      function noop() {
      }
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function(name) {
        return [];
      };
      process.binding = function(name) {
        throw new Error("process.binding is not supported");
      };
      process.cwd = function() {
        return "/";
      };
      process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
      };
      process.umask = function() {
        return 0;
      };
    }, {}] }, {}, [11])(11);
  });
})(mirada_min);
class VideoReader {
  constructor(constraints, video) {
    this.streaming = false;
    this.settings = null;
    this._constraints = constraints;
    if (video) {
      this.video = video;
    } else {
      this.video = document.createElement("video");
      this.video.muted = true;
      this.video.playsInline = true;
      this.video.style.display = "none";
    }
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";
    document.body.append(this.video);
    document.body.append(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.mat = cv.Mat.zeros(10, 10, cv.CV_8UC4);
    this.streaming = false;
  }
  get isStreaming() {
    return this.streaming;
  }
  get constraints() {
    return this._constraints;
  }
  set constraints(constraint) {
    const wasRunning = this.streaming;
    this.stop();
    this._constraints = constraint;
    if (wasRunning) {
      this.start();
    }
  }
  get deviceId() {
    return this._deviceId;
  }
  read() {
    this.context.drawImage(this.video, 0, 0, this.settings.width, this.settings.height);
    const imageData = this.context.getImageData(0, 0, this.settings.width, this.settings.height);
    this.mat.data.set(imageData.data);
    return this.mat;
  }
  async start() {
    this.stream = this.video.srcObject = await navigator.mediaDevices.getUserMedia(this._constraints);
    const settings = this.settings = this.stream.getVideoTracks()[0].getSettings();
    console.log(settings);
    this._deviceId = settings.deviceId;
    let width = settings.width;
    let height = settings.height;
    this.video.width = width;
    this.video.height = height;
    await this.video.play();
    if (this.video.videoHeight && this.video.videoHeight !== height) {
      height = this.video.videoHeight;
      width = this.video.videoWidth;
      this.video.width = width;
      this.video.height = height;
      this.settings.height = height;
      this.settings.width = width;
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.mat = cv.Mat.zeros(height, width, cv.CV_8UC4);
    this.streaming = true;
    return settings;
  }
  stop() {
    var _a;
    if (this.streaming) {
      (_a = this.stream) == null ? void 0 : _a.getVideoTracks().forEach((t) => t.stop());
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.video.pause();
      this.streaming = false;
      this.mat.delete();
    }
  }
}
class Marker {
  constructor(nodeIndex, regions, action) {
    this.nodeIndex = nodeIndex;
    this.regions = regions;
    this.action = action;
  }
  equals(marker) {
    return marker != null && this.regions.length == marker.regions.length && this.regions.every(function(element, index) {
      return element === marker.regions[index];
    });
  }
}
const NEXT_NODE = 0;
const FIRST_CHILD_NODE = 2;
class MarkerCode {
  constructor(code, action) {
    this.code = code;
    this.action = action;
  }
}
class MarkerDetector {
  constructor(experience) {
    this.maxEmpty = 10;
    this.experience = experience;
    let codes = Array();
    let minValue = 20;
    let maxValue = 1;
    let maxRegions = 20;
    let minRegions = 1;
    this.embeddedChecksum = experience.settings && experience.settings.embeddedChecksum || false;
    experience.actions.forEach((action) => {
      action.codes.forEach((code) => {
        const markerCode = new MarkerCode(code.split(":").map((value) => {
          return Number.parseInt(value);
        }), action);
        codes.push(markerCode);
        maxRegions = Math.min(markerCode.code.length, maxRegions);
        minRegions = Math.max(markerCode.code.length, minRegions);
        markerCode.code.forEach((value) => {
          minValue = Math.min(value, minValue);
          maxValue = Math.max(value, maxValue);
        });
      });
    });
    this.ignoreEmpty = true;
    this.codes = codes;
    this.maxRegions = maxRegions;
    this.minRegions = minRegions;
    this.maxValue = maxValue;
    this.minValue = minValue;
  }
  findMarker(hierarchy) {
    for (let i = 0; i < hierarchy.cols; ++i) {
      let result = this.createMarkerForNode(i, hierarchy);
      if (result != null) {
        return result;
      }
    }
    return null;
  }
  static getFirstChild(hierarchy, nodeIndex) {
    return hierarchy.intPtr(0, nodeIndex)[FIRST_CHILD_NODE];
  }
  static getNextNode(hierarchy, nodeIndex) {
    return hierarchy.intPtr(0, nodeIndex)[NEXT_NODE];
  }
  createMarkerForNode(nodeIndex, hierarchy) {
    let regions = [];
    let checksum = null;
    let empties = 0;
    let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, nodeIndex);
    while (currentNodeIndex >= 0) {
      let leafs = MarkerDetector.countLeafs(currentNodeIndex, hierarchy, this.minValue, this.maxValue);
      if (leafs != null) {
        if (leafs === 0 && this.ignoreEmpty) {
          empties++;
          if (empties > this.maxEmpty) {
            return null;
          }
        } else {
          if (regions.length >= this.maxRegions) {
            return null;
          }
          regions.push(leafs);
        }
      } else if (this.embeddedChecksum && checksum == null) {
        checksum = MarkerDetector.countChecksum(currentNodeIndex, hierarchy);
        if (checksum == null) {
          return null;
        }
      } else {
        return null;
      }
      currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex);
    }
    if (regions.length < this.minRegions) {
      return null;
    }
    regions.sort();
    if (this.embeddedChecksum) {
      if (checksum == null) {
        return null;
      }
      if (!MarkerDetector.isChecksumValid(regions, checksum)) {
        return null;
      }
    }
    for (let code of this.codes) {
      let is_same = code.code.length == regions.length && code.code.every((element, index) => element === regions[index]);
      if (is_same) {
        return new Marker(nodeIndex, regions, code.action);
      }
    }
    return null;
  }
  static isChecksumValid(regions, checksum) {
    const embeddedChecksumModValue = 7;
    let weightedSum = 0;
    let weight = 1;
    regions.forEach((value) => {
      if (weight % embeddedChecksumModValue == 0) {
        weight++;
      }
      weightedSum += value * weight;
      weight++;
    });
    const validChecksum = (weightedSum - 1) % 7 + 1;
    return checksum == validChecksum;
  }
  static countChecksum(regionIndex, hierarchy) {
    let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, regionIndex);
    if (currentNodeIndex < 0) {
      return null;
    }
    let dotCount = 0;
    while (currentNodeIndex >= 0) {
      if (MarkerDetector.isValidHollowDot(currentNodeIndex, hierarchy)) {
        dotCount++;
      } else {
        let leafs = MarkerDetector.countLeafs(currentNodeIndex, hierarchy, 0, 5);
        if (leafs == null) {
          return null;
        }
      }
      currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex);
    }
    return dotCount;
  }
  static isValidHollowDot(nodeIndex, hierarchy) {
    let firstChild = MarkerDetector.getFirstChild(hierarchy, nodeIndex);
    return firstChild >= 0 && MarkerDetector.getNextNode(hierarchy, firstChild) < 0;
  }
  static countLeafs(nodeIndex, hierarchy, minLeaves, maxLeaves) {
    let leafCount = 0;
    let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, nodeIndex);
    while (currentNodeIndex >= 0) {
      if (MarkerDetector.getFirstChild(hierarchy, currentNodeIndex) >= 0) {
        return null;
      }
      leafCount++;
      if (leafCount > maxLeaves) {
        return null;
      }
      currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex);
    }
    if (leafCount < minLeaves) {
      if (leafCount == 0) {
        return 0;
      }
      return null;
    }
    return leafCount;
  }
}
class MovingThresholder {
  constructor() {
    this.step = 4;
    this.range = 128;
    this.threshSize = 301;
    this.threshConst = 0;
    this.lastMatch = 0;
  }
  threshold(img, detected) {
    if (!detected) {
      let min = this.lastMatch - this.range / 2;
      this.threshConst = (this.threshConst + this.step - min) % this.range + min;
    } else {
      this.lastMatch = this.threshConst;
    }
    cv.blur(img, img, new cv.Size(3, 3));
    cv.adaptiveThreshold(img, img, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, this.threshSize, this.threshConst);
  }
}
class TileTresholder {
  constructor() {
    this.threshValue = 128;
    this.minTiles = 4;
    this.maxTiles = 8;
    this.tileCount = this.minTiles;
  }
  threshold(img, detected) {
    if (!detected) {
      if (this.tileCount == this.maxTiles) {
        this.tileCount = this.minTiles;
      } else {
        this.tileCount++;
      }
    }
    cv.blur(img, img, new cv.Size(3, 3));
    const width = img.cols;
    const height = img.rows;
    const tileWidth = Math.round(width / this.tileCount);
    const tileHeight = Math.round(height / this.tileCount);
    for (let colIndex = 0; colIndex < this.tileCount; colIndex++) {
      const startCol = colIndex * tileWidth;
      const colWidth = colIndex === this.tileCount - 1 ? width - startCol : tileWidth;
      for (let rowIndex = 0; rowIndex < this.tileCount; rowIndex++) {
        const startRow = rowIndex * tileHeight;
        const rowHeight = rowIndex === this.tileCount - 1 ? height - startRow : tileHeight;
        const tileMat = img.roi(new cv.Rect(startCol, startRow, colWidth, rowHeight));
        cv.threshold(tileMat, tileMat, this.threshValue, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
      }
    }
  }
}
var ScannerState;
(function(ScannerState2) {
  ScannerState2[ScannerState2["loading"] = 0] = "loading";
  ScannerState2[ScannerState2["idle"] = 1] = "idle";
  ScannerState2[ScannerState2["scanning"] = 2] = "scanning";
})(ScannerState || (ScannerState = {}));
function parseColour(input) {
  if (input.substr(0, 1) == "#") {
    const collen = (input.length - 1) / 3;
    const fact = [17, 1, 0.062272][collen - 1];
    return [
      Math.round(parseInt(input.substr(1, collen), 16) * fact),
      Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
      Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact)
    ];
  } else
    return input.split("(")[1].split(")")[0].split(",").map((x) => +x);
}
function parseColourToScalar(input) {
  if (input == null) {
    return new cv.Scalar(255, 255, 0, 255);
  }
  const array = parseColour(input);
  return new cv.Scalar(array[0], array[1], array[2], 255);
}
async function createScanner(experience, options) {
  if (location.protocol != "https:" && location.hostname != "localhost") {
    throw new Error("Artcodes requires https in order to access camera");
  }
  let opencvPath = "opencv.js";
  if (options.opencvPath) {
    opencvPath = options.opencvPath;
  }
  await mirada_min.exports.loadOpencv({
    opencvJsLocation: opencvPath
  });
  const scanner = new ScannerImpl(experience, options);
  if (location.hash == "#play") {
    await scanner.start();
  } else {
    scanner.stop();
  }
  return scanner;
}
class ScannerImpl {
  constructor(experience, options) {
    var _a, _b;
    this._state = 0;
    this.fps = 10;
    this.detected = null;
    this.markerCount = 0;
    this.currentMarker = null;
    this.selectListener = () => {
      var _a2;
      this.camera.stop();
      this.camera.constraints = {
        video: {
          width: { min: 400, ideal: 800 },
          height: { min: 400, ideal: 600 },
          deviceId: (_a2 = this.options.deviceSelect) == null ? void 0 : _a2.value
        }
      };
      this.start().then();
    };
    this.experience = experience;
    this.options = options;
    this.detector = new MarkerDetector(experience);
    this.camera = new VideoReader({
      video: {
        width: { min: 600, ideal: 1920 },
        height: { min: 400, ideal: 1080 },
        facingMode: "environment"
      },
      audio: false
    }, options.video);
    (_a = options.stateChanged) == null ? void 0 : _a.call(options, 0);
    if ((_b = this.experience.settings) == null ? void 0 : _b.tile) {
      this.thresholder = new TileTresholder();
    } else {
      this.thresholder = new MovingThresholder();
    }
    this.morphKernel = cv.Mat.ones(2, 2, cv.CV_8U);
  }
  setState(newState) {
    var _a, _b;
    this._state = newState;
    (_b = (_a = this.options).stateChanged) == null ? void 0 : _b.call(_a, newState);
  }
  get state() {
    return this._state;
  }
  async start() {
    var _a, _b, _c, _d, _e, _f;
    if (this._state != 2) {
      try {
        const actionTimeout = ((_a = this.experience.settings) == null ? void 0 : _a.actionTimout) || 1e4;
        const actionDelay = ((_b = this.experience.settings) == null ? void 0 : _b.actionDelay) || 0;
        const colour = parseColourToScalar(this.options.outlineColor);
        const videoProps = await this.camera.start();
        const dst = new cv.Mat(videoProps.width, videoProps.height, cv.CV_8UC1);
        const outmat = new cv.Mat(videoProps.width, videoProps.height, cv.CV_8UC4);
        if ("aspectRatio" in this.options.canvas.style) {
          this.options.canvas.style.aspectRatio = videoProps.width + " / " + videoProps.height;
          this.options.canvas.width = videoProps.width;
          this.options.canvas.height = videoProps.height;
        } else {
          const canvasWidth = this.options.canvas.parentElement.clientWidth;
          this.options.canvas.style.width = canvasWidth + "px";
          this.options.canvas.style.height = Math.round(canvasWidth / videoProps.width * videoProps.height) + "px";
          this.options.canvas.width = videoProps.width;
          this.options.canvas.height = videoProps.height;
        }
        let lastActionTime = 0;
        (_d = (_c = this.options).stateChanged) == null ? void 0 : _d.call(_c, 2);
        (_f = (_e = this.options).markerChanged) == null ? void 0 : _f.call(_e, null);
        if (this.options.useUrlHash) {
          history.replaceState(null, "", "#play");
        }
        if (this.options.deviceSelect != null) {
          this.options.deviceSelect.removeEventListener("input", this.selectListener);
          while (this.options.deviceSelect.options.length > 0) {
            this.options.deviceSelect.remove(0);
          }
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter((device) => device.kind == "videoinput");
          if (cameras.length > 1) {
            cameras.forEach((camera) => {
              var _a2;
              const opt = document.createElement("option");
              opt.value = camera.deviceId;
              opt.innerHTML = camera.label;
              (_a2 = this.options.deviceSelect) == null ? void 0 : _a2.appendChild(opt);
            });
            if (this.camera.deviceId != void 0) {
              this.options.deviceSelect.value = this.camera.deviceId;
            }
            this.options.deviceSelect.addEventListener("input", this.selectListener);
            this.options.deviceSelect.style.display = "";
          }
        }
        const processVideo = () => {
          var _a2, _b2, _c2, _d2, _e2;
          const begin = Date.now();
          try {
            if (this.camera.isStreaming) {
              const src = this.camera.read();
              cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
              this.thresholder.threshold(dst, this.detected != null);
              const contours = new cv.MatVector();
              const hierarchy = new cv.Mat();
              cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
              if (this.options.debugView) {
                cv.cvtColor(dst, outmat, cv.COLOR_GRAY2RGBA);
              } else {
                src.copyTo(outmat);
              }
              const marker = this.detector.findMarker(hierarchy);
              if (marker != null) {
                if (!marker.equals(this.detected)) {
                  this.markerCount = 0;
                  this.detected = marker;
                }
                this.markerCount = Math.min(actionDelay, this.markerCount + 2);
                if (this.markerCount >= actionDelay) {
                  if (!((_a2 = this.currentMarker) == null ? void 0 : _a2.equals(marker))) {
                    console.log(marker.regions);
                    this.currentMarker = marker;
                    (_c2 = (_b2 = this.options).markerChanged) == null ? void 0 : _c2.call(_b2, marker);
                  }
                  lastActionTime = Date.now() + actionTimeout;
                }
                cv.drawContours(outmat, contours, marker.nodeIndex, colour, 2, cv.LINE_AA, hierarchy, 100);
              } else {
                this.detected = null;
                this.markerCount = Math.max(0, this.markerCount - 1);
                if (this.currentMarker != null && lastActionTime != 0 && Date.now() > lastActionTime) {
                  lastActionTime = 0;
                  this.currentMarker = marker;
                  (_e2 = (_d2 = this.options).markerChanged) == null ? void 0 : _e2.call(_d2, null);
                }
              }
              if (videoProps.facingMode == "user") {
                cv.flip(outmat, outmat, 1);
              }
              cv.imshow(this.options.canvas, outmat);
              const delay = 1e3 / this.fps - (Date.now() - begin);
              setTimeout(processVideo, delay);
            } else {
              dst.delete();
              outmat.delete();
              this.setState(1);
            }
          } catch (error) {
            console.log(error);
            this.stop();
          }
        };
        processVideo();
      } catch (error) {
        console.log(error);
        this.stop();
      }
    }
  }
  stop() {
    if (this.options.useUrlHash) {
      history.replaceState(null, "", " ");
    }
    this.camera.stop();
    this.setState(1);
  }
}
export { ScannerState, createScanner };

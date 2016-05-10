(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\node_modules\\base64-js\\lib")
},{"buffer":2,"e/U+97":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\buffer\\index.js","/..\\..\\node_modules\\buffer")
},{"base64-js":1,"buffer":2,"e/U+97":4,"ieee754":3}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\ieee754\\index.js","/..\\..\\node_modules\\ieee754")
},{"buffer":2,"e/U+97":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\process\\browser.js","/..\\..\\node_modules\\process")
},{"buffer":2,"e/U+97":4}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', 'GanixWS', '$ionicSlideBoxDelegate', '$stateParams', function($scope, GanixWS, $ionicSlideBoxDelegate, $stateParams){
    var establishmentId = $stateParams.establishmentId;
    $scope.establishmentDetail = GanixWS.establishmentDetail(establishmentId);
    $scope.capacityDetail = GanixWS.capacityDetail();
    $scope.promotionDetail = GanixWS.promotionDetail();
    $scope.addressDetail = GanixWS.addressDetail();
    $scope.contactDetail = GanixWS.contactDetail();
    $scope.imageDetail = GanixWS.imageDetail();
    
    $scope.isOpened = function(){return "aberto agora"};
    
    $scope.groups = [];
        
    $scope.groups[0] = {
        name: "Promoções",
        items: ["Promo 01", "Promo 02"]
    };

    $scope.groups[1] = {
        name: "Contatos",
        items: []
    };

    $scope.groups[2] = {
        name: "Endereços",
        items: []
    };

    $scope.groups[3] = {
        name: "Ambiente",
        items: []
    };

    $scope.groups[4] = {
        name: "Ritmos",
        items: []
    };

    $scope.groups[5] = {
        name: "Próximos Eventos",
        items: []
    };
    
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
    
}];
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/detail-view\\detail-controller.js","/detail-view")
},{"buffer":2,"e/U+97":4}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */

'use strict';

module.exports = angular.module('Detail', [])
                        .controller('DetailCtrl', require('./detail-controller'));
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/detail-view\\detail-view.js","/detail-view")
},{"./detail-controller":5,"buffer":2,"e/U+97":4}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
require('./menu-view/menu-view');
require('./map-view/map-view');
require('./detail-view/detail-view');
require('./filter-view/filter-view');

angular.module('starter', ['ionic',
                            'ngCordova',
                            'Menu', 
                            'Map', 
							'Filter',
                            'Detail',
                            'pascalprecht.translate',
                            'starter.controllers'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu-view/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map-view/map.html',
          controller: 'MapCtrl'
        }
      }
  })
  .state('app.filter', {
      url: '/filter',
      views: {
        'menuContent': {
          templateUrl: 'templates/filter-view/filter.html',
          controller: 'FilterCtrl'
        }
      }
  })
  .state('app.detail', {
    url: '/establishments/:establishmentId',
    views: {
        'menuContent': {
            templateUrl: 'templates/detail-view/detail.html',
            controller: 'DetailCtrl'
        }
    }
  })
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
                $state.go("app.map");
        });
})
.config(require('./locale'))
.factory('LoadPage', require('./load-page-factory'))
.factory('GoogleMaps', require('./maps-factory'))
.factory('GanixWS', require('./ws-factory'));

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_c051c6a5.js","/")
},{"./detail-view/detail-view":6,"./filter-view/filter-view":9,"./load-page-factory":10,"./locale":11,"./map-view/map-view":14,"./maps-factory":15,"./menu-view/menu-view":18,"./ws-factory":19,"buffer":2,"e/U+97":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', 'GanixWS', function($scope, GanixWS){
	$scope.phoneNumber = '(41) 0000-0000';	
	$scope.establishmentType = 'Indiferente';
	$scope.searchType = 'Indiferente';
	$scope.filterTags = [
		"Woods",
		"Sertanejo",
		"Rock",
		"Pop",
		"Bar",
		"Balada",
		"Eletrônica",
		"Bar do Alemão",
		"Shed",
		"Santa Marta",
		"Barato",
		"Hotmilk",
		"Funk"	
	];
	$scope.selectedTags = [];
	
	$scope.setType = function(event){
		$scope.establishmentType = angular.element(event.target).text();
	};
	
	$scope.setSearchType = function(event){
		$scope.searchType = angular.element(event.target).text();
	};
	
	$scope.addTag = function(tagText){
		if(tagText != null && tagText != '' && !$scope.containsObject(tagText, $scope.selectedTags)) {
			$scope.selectedTags.push(tagText);
			$scope.tagText = '';
		}
	};
	
	$scope.removeTag = function(text) {
		var index = $scope.selectedTags.indexOf(text);
		$scope.selectedTags.splice(index, 1); 
	}
	
	$scope.containsObject = function(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (angular.equals(list[i], obj)) {
				return true;
			}
		}

		return false;
	};
}];
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/filter-view\\filter-controller.js","/filter-view")
},{"buffer":2,"e/U+97":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */
'use strict';

module.exports = angular.module('Filter', [])
        .controller('FilterCtrl', require('./filter-controller'));
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/filter-view\\filter-view.js","/filter-view")
},{"./filter-controller":8,"buffer":2,"e/U+97":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global module*/
/*global angular*/
module.exports = function($compile) {
    
    return {
        loadHTmlPage: function(htmlText, scope){
                // Step 1: parse HTML into DOM element
                var template = angular.element(htmlText);
                
                // Step 2: compile the template
                var linkFn = $compile(template);

                // Step 3: link the compiled template with the scope.
                var element = linkFn(scope);
                
                scope.$safeApply();
                
                return element[0];
        }
    };
};
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/load-page-factory.js","/")
},{"buffer":2,"e/U+97":4}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = ['$translateProvider',
    function($translateProvider) {
      $translateProvider
      .useStaticFilesLoader({
        prefix: 'js/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'pt', 'es'], {
        'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
        'pt' : 'pt', 'pt_BR': 'pt', 
        'es' : 'es'
      })
      .preferredLanguage('pt')
      .fallbackLanguage('pt')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters');
    }
];

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/locale.js","/")
},{"buffer":2,"e/U+97":4}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global module*/
'use strict';
module.exports = function(){
    return{
      restrict: 'E',
      templateUrl: '../../templates/map-view/annotation.html'
    };
};
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/map-view\\dv-annotation.js","/map-view")
},{"buffer":2,"e/U+97":4}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = [
		'$scope',
		'$state',
		'$cordovaGeolocation',
		'GanixWS',
		function($scope, $state, $cordovaGeolocation, GanixWS) {
			var map = null;
			
			var getPercent = function(percent) {
				var stringPercent = '';
				if (percent === 0)
					stringPercent = '0';
				else if (percent <= 20)
					stringPercent = '20';
				else if (percent <= 40)
					stringPercent = '40';
				else if (percent <= 60)
					stringPercent = '60';
				else if (percent <= 80)
					stringPercent = '80';
				else
					stringPercent = '100';
				
				return stringPercent;
			} ;
            
			var initMap = function() {
				var options = {
					timeout : 10000,
					enableHighAccuracy : true
				};

				$cordovaGeolocation
						.getCurrentPosition(options)
						.then(
								function(position) {
									var latLng = new google.maps.LatLng(
											position.coords.latitude,
											position.coords.longitude);

									var mapOptions = {
										center : latLng,
										zoom : 15,
										mapTypeId : google.maps.MapTypeId.ROADMAP
									};

									$scope.map = new google.maps.Map(document
											.getElementById("map"), mapOptions);

									//GanixWS.listEstablishmentMap().then(function(markersResult){
										//var markers = markesResult.data;
										var markers = GanixWS.listEstablishmentMap();
										
										for (var i = 0; i < markers.length; i++) {
											var establishment = markers[i];
											var position = new google.maps.LatLng(
													establishment.latitude,
													establishment.longitude);

											var menCount = establishment.manQuantity;
											var womenCount = establishment.womanQuantity;
											var percent = ((menCount + womenCount) / establishment.quantityLimit) * 100;
											var urlPin = '../../img/pin' + getPercent(percent) + '.png';

											var marker = new google.maps.Marker(
												{
													position : position,
													map : $scope.map,
													animation : google.maps.Animation.DROP,
													title : establishment.fantasyName,
													icon : {
														url : urlPin,
														origin : new google.maps.Point(
																0, 0),
														scaledSize : new google.maps.Size(
																40, 52)
													}
												});
											
											var conteudo = '<div id="iw-container">' +
															'<div class="iw-title">' + establishment.fantasyName + '</div>' +
															'<div class="iw-content">' +
															  '<div class="iw-subTitle">R$ ' + establishment.ticketValue + ',00</div>' +
															  '<div class="iw-content-left"><span id="number">' + (menCount + womenCount) + '</span><br/>no local</div>' +
															  '<div class="iw-content-right">' +
																'<div class="iw-content-image"><img src="../img/ico_mulher.png" height="20px" alt="women"/></div>' + womenCount +
																'<div style="clear:both;"></div>' +
																'<div class="iw-content-image"><img src="../img/ico_homem.png" height="18px" alt="men"/></div>' + menCount +
															  '</div>' +
															  '<div style="clear:both;"></div>' +
															  '<div class="iw-footer"><a href="#/app/establishments/' + establishment.establishmentId + '">ver detalhes</a></div>' +
															'</div>' +
														  '</div>';

											  /*var infowindow = new google.maps.InfoWindow({
												content: conteudo	
											  });*/
											  
											  var infowindow = new google.maps.InfoWindow();
											  // Evento que fecha a infoWindow com click no mapa
											  google.maps.event.addListener($scope.map, 'click', function() {
												infowindow.close();
											  });
											  
											  google.maps.event.addListener(marker, 'click', (function(marker, conteudo, infowindow){
												  return function() {
													infowindow.setContent(conteudo);
													infowindow.open($scope.map, marker);
												  };
											  })(marker,conteudo,infowindow));

											  /*marker.addListener('click', function() {
												infowindow.open($scope.	map, marker);
											  });*/
											  
											  google.maps.event.addListener(infowindow, 'domready', function() {
  
													// Referência ao DIV que agrupa o fundo da infowindow
													var iwOuter = $('.gm-style-iw');

													/* Uma vez que o div pretendido está numa posição anterior ao div .gm-style-iw.
													* Recorremos ao jQuery e criamos uma variável iwBackground,
													* e aproveitamos a referência já existente do .gm-style-iw para obter o div anterior com .prev().
													*/
													var iwBackground = iwOuter.prev();

													// Remover o div da sombra do fundo
													iwBackground.children(':nth-child(2)').css({'display' : 'none'});

													// Remover o div de fundo branco
													iwBackground.children(':nth-child(4)').css({'display' : 'none'});

													// Desloca a infowindow 115px para a direita
													iwOuter.parent().parent().css({left: '28px'});

													// Desloca a sombra da seta a 76px da margem esquerda 
													iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

													// Desloca a seta a 76px da margem esquerda 
													iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

													// Altera a cor desejada para a sombra da cauda
													iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1', 'background-color' : '#3c9e9f'});

													// Referência ao DIV que agrupa os elementos do botão fechar
													var iwCloseBtn = iwOuter.next();

													// Aplica o efeito desejado ao botão fechar
													iwCloseBtn.css({opacity: '1', right: '20px', top: '3px', 'box-shadow': '0 0 5px #3990B9'});

													// A API aplica automaticamente 0.7 de opacidade ao botão após o evento mouseout. Esta função reverte esse evento para o valor desejado.
													iwCloseBtn.mouseout(function(){
													  $(this).css({opacity: '1'});
													});
												  });
										}	
									//});

									

									// var myLatlng = {
									// lat : -25.448912,
									// lng : -49.253932
									// };
									// var marker = new google.maps.Marker({
									// position : myLatlng,
									// map : $scope.map,
									// animation : google.maps.Animation.DROP,
									// title : 'Hotmilk',
									// icon : {
									// url : '../../img/pin80.png',
									// origin : new google.maps.Point(0, 0),
									// scaledSize : new google.maps.Size(40, 52)
									// }
									// });
									//
								//	marker.addListener('click', function() {
								//	 $scope.map.setZoom(0);
									// $scope.map.setCenter(marker.getPosition());
									//});

								}, function(error) {
									console.log("Could not get location");
								});
			};
			
			var addInfoWindow = function(marker, record, infoWindow, content) {
        
			  google.maps.event.addListener(marker, 'click', function(){
				  var newScope = $rootScope.$new();
				  newScope.record = record;
				  var compiledContent = content;
				  infoWindow.setContent(compiledContent);
				  infoWindow.open( map , marker );
			  });
			};
			
            initMap();
            
		} ];
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/map-view\\map-controller2.js","/map-view")
},{"buffer":2,"e/U+97":4}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */

'use strict';

module.exports = angular.module('Map', [])
                        .controller('MapCtrl', require('./map-controller2'))
                        .directive('annotationMap', require('./dv-annotation'));
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/map-view\\map-view.js","/map-view")
},{"./dv-annotation":12,"./map-controller2":13,"buffer":2,"e/U+97":4}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global google */
/* global module */
/* global angular */
module.exports = ['$cordovaGeolocation', '$rootScope', 'LoadPage', 'GanixWS', function($cordovaGeolocation, $rootScope, LoadPage, GanixWS){
        console.log('passou 0');
        var map = null;
        var initMap = function(){
        var options = {timeout: 10000, enableHighAccuracy: true};
        console.log('passou 1');
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListenerOnce(map, 'idle', function(){
                //Load the markers
                loadMarkers();
            });
            console.log('passou 2');
        }, 
    
        function(error){
            console.log("Could not get location");
            
            //Load the markers
            loadMarkers();
        });
 
    };
 
    var loadMarkers = function(){
        //Get all of the markers from our Markers factory
        console.log('passou 3');
        GanixWS.listEstablishmentMap().then(function(markers){
            var records = markers.data;
            for (var i = 0; i < records.length; i++) {
              var record = records[i];
                
              var markerPos = new google.maps.LatLng(record.latitude, record.longitude);
             
              var imageName = '././img/pin';
              var imageExtName = '.png';
              
              var peopleQuantity = record.manQuantity + record.womanQuantity;
              var percPessoas =  (peopleQuantity / record.quantityLimit) * 100;
              
              var percName = '0';
                if (percPessoas === 0) {
                    percName = "0";
                } else if (percPessoas <= 20) {
                    percName = "20";
                } else if (percPessoas <= 40) {
                    percName = "40";
                } else if (percPessoas <= 60) {
                    percName = "60";
                } else if (percPessoas <= 80) {
                    percName = "80";
                } else {
                    percName = "100";
                }
              
              // Add the markerto the map
              var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos,
                  icon: {
                    url: imageName + percName + imageExtName,
                    origin: new google.maps.Point(0,0),
                    scaledSize: new google.maps.Size(40,52)
                  }
              });
              var content = '<annotation-map></annotation-map>';
              var infoWindow = new google.maps.InfoWindow();
              addInfoWindow(marker, record, infoWindow, content);
            }
        }); 
    };
 
    var addInfoWindow = function(marker, record, infoWindow, content) {
        
      google.maps.event.addListener(marker, 'click', function(){
          var newScope = $rootScope.$new();
          newScope.record = record;
          var compiledContent = LoadPage.loadHTmlPage(content, newScope);
          infoWindow.setContent(compiledContent);
          infoWindow.open( map , marker );
      });
    };
    
    return {
        init: function(){
            console.log('passou -1');
            initMap();
            console.log('passou 000');
        }
    };
}];

}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/maps-factory.js","/")
},{"buffer":2,"e/U+97":4}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global module*/
'use strict';
module.exports = function(){
    return{
      restrict: 'E',
      templateUrl: '../../templates/menu-view/about.html'
    };
};
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/menu-view\\dv-about-view.js","/menu-view")
},{"buffer":2,"e/U+97":4}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', function($scope){

}];
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/menu-view\\menu-controller.js","/menu-view")
},{"buffer":2,"e/U+97":4}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* global module */
/* global angular */
'use strict';

module.exports = angular.module('Menu', [])
                        .controller('MenuCtrl', require('./menu-controller'))
                        .directive('aboutView', require('./dv-about-view'));
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/menu-view\\menu-view.js","/menu-view")
},{"./dv-about-view":16,"./menu-controller":17,"buffer":2,"e/U+97":4}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function($http) {
 
  var BASE_URL = 'http://54.94.168.2:50201/API/';
  var ESTABLISHMENT_SERVICE_NAME = 'Establishment';
  
  var filterList = [
	{ name: "Woods" },
	{ name: "Sertanejo" },
	{ name: "Rock" },
	{ name: "Pop" },
	{ name: "Bar" },
	{ name: "Balada" },
	{ name: "Eletrônica" },
	{ name: "Bar do Alemão" },
	{ name: "Shed" },
	{ name: "Santa Marta" },
	{ name: "Barato" },
	{ name: "Hotmilk" },
	{ name: "Funk" }	
  ];
  
  var markers = [ {
				establishmentId: 1,
				cnpj : 1234234,
				establishmentType : "<null>",
				fantasyName : "Woods Curitiba",
				latitude : "-25.4486974",
				longitude : "-49.30504215",
				manQuantity : 1,
				quantityLimit : 100,
				serviceVersion : "1.0.0",
				ticketValue : 70,
				womanQuantity : 1
			}, {
				establishmentId: 2,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Shed Bar",
				latitude : "-25.443690",
				longitude : "-49.294617",
				manQuantity : 100,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 50
			}, {
				establishmentId: 3,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Santa Marta",
				latitude : "-25.444065",
				longitude : "-49.292422",
				manQuantity : 50,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 50
			}, {
				establishmentId: 4,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Bar do Alemão",
				latitude : "-25.427790",
				longitude : "-49.272668",
				manQuantity : 10,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 20
			}, {
				establishmentId: 5,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Holmilk Modafocka",
				latitude : "-25.448912",
				longitude : "-49.253932",
				manQuantity : 200,
				quantityLimit : 1000,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 666
			}, {
				establishmentId: 6,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Paragobala",
				latitude : "-2.992615",
				longitude : "-47.356029", 
				manQuantity : 300,
				quantityLimit : 1000,
				serviceVersion : "1.0.0",
				ticketValue : 20,
				womanQuantity : 600
			}  ];
  
  return {
    /*listEstablishmentMap: function(){
      return $http.get(BASE_URL + ESTABLISHMENT_SERVICE_NAME + "/ListEstablishmentMap").then(function(response){
          return response;
      });
    },*/
	listEstablishmentMap: function(){
		return markers;
	},
    establishmentDetail: function(establishmentId){
      return {
				"establishmentId":establishmentId,
                "establishmentName":"Nome do Estabelecimento",
                "establishmentTags":"Bar, Balada, Happy Hour, MPB", 
                "establishmentDescription":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eleifend vitae turpis pellentesque imperdiet. Nam ultricies suscipit porttitor. Aliquam eleifend lacinia tristique. Fusce ornare augue tortor, ut laoreet mi cursus a. In dignissim quis mi et varius. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis finibus lorem a urna sodales malesuada. Cras a nisl pellentesque felis lobortis malesuada vel vel ante." ,
                "startTime": "21:00", 
                "endTime": "01:00",
                "distance": "5",
                "distanceUnit":"km",
                "ticketValue":"25"
             };
    },
    capacityDetail: function(){
      return {
                "womanQuantity":"75", 
                "manQuantity": "50", 
                "estimedQuantity": "140",
                "totalQuantity": "200"
             };
    },
    promotionDetail: function(){
        return {
                    "promotionDescriptions": ["promotion description one","promotion description two","promotion description three"]
               };
    },
    addressDetail: function(){
        return {
                    "street":"Avenida República Federativa do Brasil",
                    "number":"10000",
                    "neighborhood":"Jardim Amélia",
                    "complement":"Conjunto das Amexeiras",
                    "city":"São José dos Pinhais",
                    "state":"Paraná",
                    "stateCode":"PR",
                    "country":"Brasil",
                    "zipCode":"80000-000",
                    "latitude":"-46.000001",
                    "longitude":"-25.000001"
               };
    },
    imageDetail: function(){
        return {"urls": ["https://arautodecristo777.files.wordpress.com/2013/12/balada.jpg",
							"http://img.elo7.com.br/product/original/631490/painel-balada.jpg", 
							"http://mulhersemvergonha.com/wp-content/uploads/2016/02/mulher-dancando-53608.jpg", 
							"http://blog.sympla.com.br/wp-content/uploads/2013/10/iStock_000010828750Large.jpg"
						]
				};
    },
    contactDetail: function(){
        return {
                    "contacts":[
                        {
                            "contactType":"telephone",
                            "contactValue": "+55 41 00000-0000"
                        },
                        {
                            "contactType":"email",
                            "contactValue": "email@email.com.br"
                        },
                        {
                            "contactType":"skype",
                            "contactValue": "skypeuser"
                        },
                        {
                            "contactType":"facebook",
                            "contactValue": "www.facebook.com/userfacebook"
                        }
                    ]
               };
    },
	filterTags: function() {
		return filterList;
	}
    
  };
};
}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/ws-factory.js","/")
},{"buffer":2,"e/U+97":4}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXN1c1xcRG9jdW1lbnRzXFxHYW5peENsaWVudFxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9kZXRhaWwtdmlldy9kZXRhaWwtY29udHJvbGxlci5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9kZXRhaWwtdmlldy9kZXRhaWwtdmlldy5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9mYWtlX2MwNTFjNmE1LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL2ZpbHRlci12aWV3L2ZpbHRlci1jb250cm9sbGVyLmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL2ZpbHRlci12aWV3L2ZpbHRlci12aWV3LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL2xvYWQtcGFnZS1mYWN0b3J5LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL2xvY2FsZS5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9tYXAtdmlldy9kdi1hbm5vdGF0aW9uLmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL21hcC12aWV3L21hcC1jb250cm9sbGVyMi5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9tYXAtdmlldy9tYXAtdmlldy5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9tYXBzLWZhY3RvcnkuanMiLCJDOi9Vc2Vycy9hc3VzL0RvY3VtZW50cy9HYW5peENsaWVudC93d3cvanMvbWVudS12aWV3L2R2LWFib3V0LXZpZXcuanMiLCJDOi9Vc2Vycy9hc3VzL0RvY3VtZW50cy9HYW5peENsaWVudC93d3cvanMvbWVudS12aWV3L21lbnUtY29udHJvbGxlci5qcyIsIkM6L1VzZXJzL2FzdXMvRG9jdW1lbnRzL0dhbml4Q2xpZW50L3d3dy9qcy9tZW51LXZpZXcvbWVudS12aWV3LmpzIiwiQzovVXNlcnMvYXN1cy9Eb2N1bWVudHMvR2FuaXhDbGllbnQvd3d3L2pzL3dzLWZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXC4uXFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXFxcXGI2NC5qc1wiLFwiLy4uXFxcXC4uXFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcYnVmZmVyXFxcXGluZGV4LmpzXCIsXCIvLi5cXFxcLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXC4uXFxcXG5vZGVfbW9kdWxlc1xcXFxpZWVlNzU0XFxcXGluZGV4LmpzXCIsXCIvLi5cXFxcLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGllZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1xcXFxicm93c2VyLmpzXCIsXCIvLi5cXFxcLi5cXFxcbm9kZV9tb2R1bGVzXFxcXHByb2Nlc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiBnbG9iYWwgbW9kdWxlICovXHJcbi8qIGdsb2JhbCBhbmd1bGFyICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gWyckc2NvcGUnLCAnR2FuaXhXUycsICckaW9uaWNTbGlkZUJveERlbGVnYXRlJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgR2FuaXhXUywgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSwgJHN0YXRlUGFyYW1zKXtcclxuICAgIHZhciBlc3RhYmxpc2htZW50SWQgPSAkc3RhdGVQYXJhbXMuZXN0YWJsaXNobWVudElkO1xyXG4gICAgJHNjb3BlLmVzdGFibGlzaG1lbnREZXRhaWwgPSBHYW5peFdTLmVzdGFibGlzaG1lbnREZXRhaWwoZXN0YWJsaXNobWVudElkKTtcclxuICAgICRzY29wZS5jYXBhY2l0eURldGFpbCA9IEdhbml4V1MuY2FwYWNpdHlEZXRhaWwoKTtcclxuICAgICRzY29wZS5wcm9tb3Rpb25EZXRhaWwgPSBHYW5peFdTLnByb21vdGlvbkRldGFpbCgpO1xyXG4gICAgJHNjb3BlLmFkZHJlc3NEZXRhaWwgPSBHYW5peFdTLmFkZHJlc3NEZXRhaWwoKTtcclxuICAgICRzY29wZS5jb250YWN0RGV0YWlsID0gR2FuaXhXUy5jb250YWN0RGV0YWlsKCk7XHJcbiAgICAkc2NvcGUuaW1hZ2VEZXRhaWwgPSBHYW5peFdTLmltYWdlRGV0YWlsKCk7XHJcbiAgICBcclxuICAgICRzY29wZS5pc09wZW5lZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIFwiYWJlcnRvIGFnb3JhXCJ9O1xyXG4gICAgXHJcbiAgICAkc2NvcGUuZ3JvdXBzID0gW107XHJcbiAgICAgICAgXHJcbiAgICAkc2NvcGUuZ3JvdXBzWzBdID0ge1xyXG4gICAgICAgIG5hbWU6IFwiUHJvbW/Dp8O1ZXNcIixcclxuICAgICAgICBpdGVtczogW1wiUHJvbW8gMDFcIiwgXCJQcm9tbyAwMlwiXVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ3JvdXBzWzFdID0ge1xyXG4gICAgICAgIG5hbWU6IFwiQ29udGF0b3NcIixcclxuICAgICAgICBpdGVtczogW11cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdyb3Vwc1syXSA9IHtcclxuICAgICAgICBuYW1lOiBcIkVuZGVyZcOnb3NcIixcclxuICAgICAgICBpdGVtczogW11cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdyb3Vwc1szXSA9IHtcclxuICAgICAgICBuYW1lOiBcIkFtYmllbnRlXCIsXHJcbiAgICAgICAgaXRlbXM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5ncm91cHNbNF0gPSB7XHJcbiAgICAgICAgbmFtZTogXCJSaXRtb3NcIixcclxuICAgICAgICBpdGVtczogW11cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdyb3Vwc1s1XSA9IHtcclxuICAgICAgICBuYW1lOiBcIlByw7N4aW1vcyBFdmVudG9zXCIsXHJcbiAgICAgICAgaXRlbXM6IFtdXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAkc2NvcGUudG9nZ2xlR3JvdXAgPSBmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICBpZiAoJHNjb3BlLmlzR3JvdXBTaG93bihncm91cCkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3duR3JvdXAgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zaG93bkdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgICRzY29wZS5pc0dyb3VwU2hvd24gPSBmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICByZXR1cm4gJHNjb3BlLnNob3duR3JvdXAgPT09IGdyb3VwO1xyXG4gICAgfTtcclxuICAgIFxyXG59XTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZS9VKzk3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZGV0YWlsLXZpZXdcXFxcZGV0YWlsLWNvbnRyb2xsZXIuanNcIixcIi9kZXRhaWwtdmlld1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbCBtb2R1bGUgKi9cclxuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ0RldGFpbCcsIFtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udHJvbGxlcignRGV0YWlsQ3RybCcsIHJlcXVpcmUoJy4vZGV0YWlsLWNvbnRyb2xsZXInKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2RldGFpbC12aWV3XFxcXGRldGFpbC12aWV3LmpzXCIsXCIvZGV0YWlsLXZpZXdcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnJlcXVpcmUoJy4vbWVudS12aWV3L21lbnUtdmlldycpO1xucmVxdWlyZSgnLi9tYXAtdmlldy9tYXAtdmlldycpO1xucmVxdWlyZSgnLi9kZXRhaWwtdmlldy9kZXRhaWwtdmlldycpO1xucmVxdWlyZSgnLi9maWx0ZXItdmlldy9maWx0ZXItdmlldycpO1xuXG5hbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICduZ0NvcmRvdmEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNZW51JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ01hcCcsIFxuXHRcdFx0XHRcdFx0XHQnRmlsdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRGV0YWlsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnXSlcbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuXG4gICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgdXJsOiAnL2FwcCcsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVudS12aWV3L21lbnUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ01lbnVDdHJsJ1xuICB9KVxuXG4gIC5zdGF0ZSgnYXBwLnNlYXJjaCcsIHtcbiAgICB1cmw6ICcvc2VhcmNoJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9zZWFyY2guaHRtbCdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLnN0YXRlKCdhcHAuYnJvd3NlJywge1xuICAgICAgdXJsOiAnL2Jyb3dzZScsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnJvd3NlLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLnBsYXlsaXN0cycsIHtcbiAgICAgIHVybDogJy9wbGF5bGlzdHMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0cy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RzQ3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIC5zdGF0ZSgnYXBwLm1hcCcsIHtcbiAgICAgIHVybDogJy9tYXAnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21hcC12aWV3L21hcC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnTWFwQ3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICB9KVxuICAuc3RhdGUoJ2FwcC5maWx0ZXInLCB7XG4gICAgICB1cmw6ICcvZmlsdGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9maWx0ZXItdmlldy9maWx0ZXIuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0ZpbHRlckN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgfSlcbiAgLnN0YXRlKCdhcHAuZGV0YWlsJywge1xuICAgIHVybDogJy9lc3RhYmxpc2htZW50cy86ZXN0YWJsaXNobWVudElkJyxcbiAgICB2aWV3czoge1xuICAgICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kZXRhaWwtdmlldy9kZXRhaWwuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRGV0YWlsQ3RybCdcbiAgICAgICAgfVxuICAgIH1cbiAgfSlcbiAgLnN0YXRlKCdhcHAuc2luZ2xlJywge1xuICAgIHVybDogJy9wbGF5bGlzdHMvOnBsYXlsaXN0SWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoIGZ1bmN0aW9uKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICB2YXIgJHN0YXRlID0gJGluamVjdG9yLmdldChcIiRzdGF0ZVwiKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWFwXCIpO1xuICAgICAgICB9KTtcbn0pXG4uY29uZmlnKHJlcXVpcmUoJy4vbG9jYWxlJykpXG4uZmFjdG9yeSgnTG9hZFBhZ2UnLCByZXF1aXJlKCcuL2xvYWQtcGFnZS1mYWN0b3J5JykpXG4uZmFjdG9yeSgnR29vZ2xlTWFwcycsIHJlcXVpcmUoJy4vbWFwcy1mYWN0b3J5JykpXG4uZmFjdG9yeSgnR2FuaXhXUycsIHJlcXVpcmUoJy4vd3MtZmFjdG9yeScpKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2MwNTFjNmE1LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyogZ2xvYmFsIGdvb2dsZSAqL1xuLyogZ2xvYmFsIG1vZHVsZSAqL1xuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cblxuJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBbJyRzY29wZScsICdHYW5peFdTJywgZnVuY3Rpb24oJHNjb3BlLCBHYW5peFdTKXtcblx0JHNjb3BlLnBob25lTnVtYmVyID0gJyg0MSkgMDAwMC0wMDAwJztcdFxuXHQkc2NvcGUuZXN0YWJsaXNobWVudFR5cGUgPSAnSW5kaWZlcmVudGUnO1xuXHQkc2NvcGUuc2VhcmNoVHlwZSA9ICdJbmRpZmVyZW50ZSc7XG5cdCRzY29wZS5maWx0ZXJUYWdzID0gW1xuXHRcdFwiV29vZHNcIixcblx0XHRcIlNlcnRhbmVqb1wiLFxuXHRcdFwiUm9ja1wiLFxuXHRcdFwiUG9wXCIsXG5cdFx0XCJCYXJcIixcblx0XHRcIkJhbGFkYVwiLFxuXHRcdFwiRWxldHLDtG5pY2FcIixcblx0XHRcIkJhciBkbyBBbGVtw6NvXCIsXG5cdFx0XCJTaGVkXCIsXG5cdFx0XCJTYW50YSBNYXJ0YVwiLFxuXHRcdFwiQmFyYXRvXCIsXG5cdFx0XCJIb3RtaWxrXCIsXG5cdFx0XCJGdW5rXCJcdFxuXHRdO1xuXHQkc2NvcGUuc2VsZWN0ZWRUYWdzID0gW107XG5cdFxuXHQkc2NvcGUuc2V0VHlwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHQkc2NvcGUuZXN0YWJsaXNobWVudFR5cGUgPSBhbmd1bGFyLmVsZW1lbnQoZXZlbnQudGFyZ2V0KS50ZXh0KCk7XG5cdH07XG5cdFxuXHQkc2NvcGUuc2V0U2VhcmNoVHlwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHQkc2NvcGUuc2VhcmNoVHlwZSA9IGFuZ3VsYXIuZWxlbWVudChldmVudC50YXJnZXQpLnRleHQoKTtcblx0fTtcblx0XG5cdCRzY29wZS5hZGRUYWcgPSBmdW5jdGlvbih0YWdUZXh0KXtcblx0XHRpZih0YWdUZXh0ICE9IG51bGwgJiYgdGFnVGV4dCAhPSAnJyAmJiAhJHNjb3BlLmNvbnRhaW5zT2JqZWN0KHRhZ1RleHQsICRzY29wZS5zZWxlY3RlZFRhZ3MpKSB7XG5cdFx0XHQkc2NvcGUuc2VsZWN0ZWRUYWdzLnB1c2godGFnVGV4dCk7XG5cdFx0XHQkc2NvcGUudGFnVGV4dCA9ICcnO1xuXHRcdH1cblx0fTtcblx0XG5cdCRzY29wZS5yZW1vdmVUYWcgPSBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0dmFyIGluZGV4ID0gJHNjb3BlLnNlbGVjdGVkVGFncy5pbmRleE9mKHRleHQpO1xuXHRcdCRzY29wZS5zZWxlY3RlZFRhZ3Muc3BsaWNlKGluZGV4LCAxKTsgXG5cdH1cblx0XG5cdCRzY29wZS5jb250YWluc09iamVjdCA9IGZ1bmN0aW9uKG9iaiwgbGlzdCkge1xuXHRcdHZhciBpO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoYW5ndWxhci5lcXVhbHMobGlzdFtpXSwgb2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZS9VKzk3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmlsdGVyLXZpZXdcXFxcZmlsdGVyLWNvbnRyb2xsZXIuanNcIixcIi9maWx0ZXItdmlld1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ0ZpbHRlcicsIFtdKVxuICAgICAgICAuY29udHJvbGxlcignRmlsdGVyQ3RybCcsIHJlcXVpcmUoJy4vZmlsdGVyLWNvbnRyb2xsZXInKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2ZpbHRlci12aWV3XFxcXGZpbHRlci12aWV3LmpzXCIsXCIvZmlsdGVyLXZpZXdcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKmdsb2JhbCBtb2R1bGUqL1xuLypnbG9iYWwgYW5ndWxhciovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRjb21waWxlKSB7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9hZEhUbWxQYWdlOiBmdW5jdGlvbihodG1sVGV4dCwgc2NvcGUpe1xuICAgICAgICAgICAgICAgIC8vIFN0ZXAgMTogcGFyc2UgSFRNTCBpbnRvIERPTSBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gYW5ndWxhci5lbGVtZW50KGh0bWxUZXh0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDI6IGNvbXBpbGUgdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtGbiA9ICRjb21waWxlKHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgICAgIC8vIFN0ZXAgMzogbGluayB0aGUgY29tcGlsZWQgdGVtcGxhdGUgd2l0aCB0aGUgc2NvcGUuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBsaW5rRm4oc2NvcGUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNjb3BlLiRzYWZlQXBwbHkoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFswXTtcbiAgICAgICAgfVxuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9sb2FkLXBhZ2UtZmFjdG9yeS5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gWyckdHJhbnNsYXRlUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICBwcmVmaXg6ICdqcy9sb2NhbGVzLycsXG4gICAgICAgIHN1ZmZpeDogJy5qc29uJ1xuICAgICAgfSlcbiAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ2VuJywgJ3B0JywgJ2VzJ10sIHtcbiAgICAgICAgJ2VuJyA6ICdlbicsICdlbl9HQic6ICdlbicsICdlbl9VUyc6ICdlbicsXG4gICAgICAgICdwdCcgOiAncHQnLCAncHRfQlInOiAncHQnLCBcbiAgICAgICAgJ2VzJyA6ICdlcydcbiAgICAgIH0pXG4gICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ3B0JylcbiAgICAgIC5mYWxsYmFja0xhbmd1YWdlKCdwdCcpXG4gICAgICAuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKVxuICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlUGFyYW1ldGVycycpO1xuICAgIH1cbl07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZS9VKzk3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbG9jYWxlLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLypnbG9iYWwgbW9kdWxlKi9cbid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm57XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi90ZW1wbGF0ZXMvbWFwLXZpZXcvYW5ub3RhdGlvbi5odG1sJ1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tYXAtdmlld1xcXFxkdi1hbm5vdGF0aW9uLmpzXCIsXCIvbWFwLXZpZXdcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiBnbG9iYWwgZ29vZ2xlICovXG4vKiBnbG9iYWwgbW9kdWxlICovXG4vKiBnbG9iYWwgYW5ndWxhciAqL1xuXG4ndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IFtcblx0XHQnJHNjb3BlJyxcblx0XHQnJHN0YXRlJyxcblx0XHQnJGNvcmRvdmFHZW9sb2NhdGlvbicsXG5cdFx0J0dhbml4V1MnLFxuXHRcdGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkY29yZG92YUdlb2xvY2F0aW9uLCBHYW5peFdTKSB7XG5cdFx0XHR2YXIgbWFwID0gbnVsbDtcblx0XHRcdFxuXHRcdFx0dmFyIGdldFBlcmNlbnQgPSBmdW5jdGlvbihwZXJjZW50KSB7XG5cdFx0XHRcdHZhciBzdHJpbmdQZXJjZW50ID0gJyc7XG5cdFx0XHRcdGlmIChwZXJjZW50ID09PSAwKVxuXHRcdFx0XHRcdHN0cmluZ1BlcmNlbnQgPSAnMCc7XG5cdFx0XHRcdGVsc2UgaWYgKHBlcmNlbnQgPD0gMjApXG5cdFx0XHRcdFx0c3RyaW5nUGVyY2VudCA9ICcyMCc7XG5cdFx0XHRcdGVsc2UgaWYgKHBlcmNlbnQgPD0gNDApXG5cdFx0XHRcdFx0c3RyaW5nUGVyY2VudCA9ICc0MCc7XG5cdFx0XHRcdGVsc2UgaWYgKHBlcmNlbnQgPD0gNjApXG5cdFx0XHRcdFx0c3RyaW5nUGVyY2VudCA9ICc2MCc7XG5cdFx0XHRcdGVsc2UgaWYgKHBlcmNlbnQgPD0gODApXG5cdFx0XHRcdFx0c3RyaW5nUGVyY2VudCA9ICc4MCc7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzdHJpbmdQZXJjZW50ID0gJzEwMCc7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gc3RyaW5nUGVyY2VudDtcblx0XHRcdH0gO1xuICAgICAgICAgICAgXG5cdFx0XHR2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0aW1lb3V0IDogMTAwMDAsXG5cdFx0XHRcdFx0ZW5hYmxlSGlnaEFjY3VyYWN5IDogdHJ1ZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRjb3Jkb3ZhR2VvbG9jYXRpb25cblx0XHRcdFx0XHRcdC5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucylcblx0XHRcdFx0XHRcdC50aGVuKFxuXHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBtYXBPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjZW50ZXIgOiBsYXRMbmcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHpvb20gOiAxNSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWFwVHlwZUlkIDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly9HYW5peFdTLmxpc3RFc3RhYmxpc2htZW50TWFwKCkudGhlbihmdW5jdGlvbihtYXJrZXJzUmVzdWx0KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly92YXIgbWFya2VycyA9IG1hcmtlc1Jlc3VsdC5kYXRhO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgbWFya2VycyA9IEdhbml4V1MubGlzdEVzdGFibGlzaG1lbnRNYXAoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlc3RhYmxpc2htZW50ID0gbWFya2Vyc1tpXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcG9zaXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RhYmxpc2htZW50LmxhdGl0dWRlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlc3RhYmxpc2htZW50LmxvbmdpdHVkZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgbWVuQ291bnQgPSBlc3RhYmxpc2htZW50Lm1hblF1YW50aXR5O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciB3b21lbkNvdW50ID0gZXN0YWJsaXNobWVudC53b21hblF1YW50aXR5O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBwZXJjZW50ID0gKChtZW5Db3VudCArIHdvbWVuQ291bnQpIC8gZXN0YWJsaXNobWVudC5xdWFudGl0eUxpbWl0KSAqIDEwMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgdXJsUGluID0gJy4uLy4uL2ltZy9waW4nICsgZ2V0UGVyY2VudChwZXJjZW50KSArICcucG5nJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbiA6IHBvc2l0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXAgOiAkc2NvcGUubWFwLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmltYXRpb24gOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGl0bGUgOiBlc3RhYmxpc2htZW50LmZhbnRhc3lOYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uIDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVybCA6IHVybFBpbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW4gOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDAsIDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNjYWxlZFNpemUgOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0NDAsIDUyKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgY29udGV1ZG8gPSAnPGRpdiBpZD1cIml3LWNvbnRhaW5lclwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpdy10aXRsZVwiPicgKyBlc3RhYmxpc2htZW50LmZhbnRhc3lOYW1lICsgJzwvZGl2PicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpdy1jb250ZW50XCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8ZGl2IGNsYXNzPVwiaXctc3ViVGl0bGVcIj5SJCAnICsgZXN0YWJsaXNobWVudC50aWNrZXRWYWx1ZSArICcsMDA8L2Rpdj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzxkaXYgY2xhc3M9XCJpdy1jb250ZW50LWxlZnRcIj48c3BhbiBpZD1cIm51bWJlclwiPicgKyAobWVuQ291bnQgKyB3b21lbkNvdW50KSArICc8L3NwYW4+PGJyLz5ubyBsb2NhbDwvZGl2PicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAnPGRpdiBjbGFzcz1cIml3LWNvbnRlbnQtcmlnaHRcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpdy1jb250ZW50LWltYWdlXCI+PGltZyBzcmM9XCIuLi9pbWcvaWNvX211bGhlci5wbmdcIiBoZWlnaHQ9XCIyMHB4XCIgYWx0PVwid29tZW5cIi8+PC9kaXY+JyArIHdvbWVuQ291bnQgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBzdHlsZT1cImNsZWFyOmJvdGg7XCI+PC9kaXY+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiaXctY29udGVudC1pbWFnZVwiPjxpbWcgc3JjPVwiLi4vaW1nL2ljb19ob21lbS5wbmdcIiBoZWlnaHQ9XCIxOHB4XCIgYWx0PVwibWVuXCIvPjwvZGl2PicgKyBtZW5Db3VudCArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8L2Rpdj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzxkaXYgc3R5bGU9XCJjbGVhcjpib3RoO1wiPjwvZGl2PicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAnPGRpdiBjbGFzcz1cIml3LWZvb3RlclwiPjxhIGhyZWY9XCIjL2FwcC9lc3RhYmxpc2htZW50cy8nICsgZXN0YWJsaXNobWVudC5lc3RhYmxpc2htZW50SWQgKyAnXCI+dmVyIGRldGFsaGVzPC9hPjwvZGl2PicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzwvZGl2Pic7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIC8qdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50OiBjb250ZXVkb1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9KTsqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAvLyBFdmVudG8gcXVlIGZlY2hhIGEgaW5mb1dpbmRvdyBjb20gY2xpY2sgbm8gbWFwYVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoJHNjb3BlLm1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbmZvd2luZG93LmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoZnVuY3Rpb24obWFya2VyLCBjb250ZXVkbywgaW5mb3dpbmRvdyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW5mb3dpbmRvdy5zZXRDb250ZW50KGNvbnRldWRvKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW5mb3dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9KShtYXJrZXIsY29udGV1ZG8saW5mb3dpbmRvdykpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAvKm1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGluZm93aW5kb3cub3Blbigkc2NvcGUuXHRtYXAsIG1hcmtlcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9KTsqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihpbmZvd2luZG93LCAnZG9tcmVhZHknLCBmdW5jdGlvbigpIHtcbiAgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFJlZmVyw6puY2lhIGFvIERJViBxdWUgYWdydXBhIG8gZnVuZG8gZGEgaW5mb3dpbmRvd1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaXdPdXRlciA9ICQoJy5nbS1zdHlsZS1pdycpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8qIFVtYSB2ZXogcXVlIG8gZGl2IHByZXRlbmRpZG8gZXN0w6EgbnVtYSBwb3Npw6fDo28gYW50ZXJpb3IgYW8gZGl2IC5nbS1zdHlsZS1pdy5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiBSZWNvcnJlbW9zIGFvIGpRdWVyeSBlIGNyaWFtb3MgdW1hIHZhcmnDoXZlbCBpd0JhY2tncm91bmQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogZSBhcHJvdmVpdGFtb3MgYSByZWZlcsOqbmNpYSBqw6EgZXhpc3RlbnRlIGRvIC5nbS1zdHlsZS1pdyBwYXJhIG9idGVyIG8gZGl2IGFudGVyaW9yIGNvbSAucHJldigpLlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaXdCYWNrZ3JvdW5kID0gaXdPdXRlci5wcmV2KCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gUmVtb3ZlciBvIGRpdiBkYSBzb21icmEgZG8gZnVuZG9cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBSZW1vdmVyIG8gZGl2IGRlIGZ1bmRvIGJyYW5jb1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoNCknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlc2xvY2EgYSBpbmZvd2luZG93IDExNXB4IHBhcmEgYSBkaXJlaXRhXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnMjhweCd9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEZXNsb2NhIGEgc29tYnJhIGRhIHNldGEgYSA3NnB4IGRhIG1hcmdlbSBlc3F1ZXJkYSBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA3NnB4ICFpbXBvcnRhbnQ7J30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlc2xvY2EgYSBzZXRhIGEgNzZweCBkYSBtYXJnZW0gZXNxdWVyZGEgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogNzZweCAhaW1wb3J0YW50Oyd9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBBbHRlcmEgYSBjb3IgZGVzZWphZGEgcGFyYSBhIHNvbWJyYSBkYSBjYXVkYVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5maW5kKCdkaXYnKS5jaGlsZHJlbigpLmNzcyh7J2JveC1zaGFkb3cnOiAncmdiYSg3MiwgMTgxLCAyMzMsIDAuNikgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMScsICdiYWNrZ3JvdW5kLWNvbG9yJyA6ICcjM2M5ZTlmJ30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFJlZmVyw6puY2lhIGFvIERJViBxdWUgYWdydXBhIG9zIGVsZW1lbnRvcyBkbyBib3TDo28gZmVjaGFyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpd0Nsb3NlQnRuID0gaXdPdXRlci5uZXh0KCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQXBsaWNhIG8gZWZlaXRvIGRlc2VqYWRvIGFvIGJvdMOjbyBmZWNoYXJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXdDbG9zZUJ0bi5jc3Moe29wYWNpdHk6ICcxJywgcmlnaHQ6ICcyMHB4JywgdG9wOiAnM3B4JywgJ2JveC1zaGFkb3cnOiAnMCAwIDVweCAjMzk5MEI5J30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEEgQVBJIGFwbGljYSBhdXRvbWF0aWNhbWVudGUgMC43IGRlIG9wYWNpZGFkZSBhbyBib3TDo28gYXDDs3MgbyBldmVudG8gbW91c2VvdXQuIEVzdGEgZnVuw6fDo28gcmV2ZXJ0ZSBlc3NlIGV2ZW50byBwYXJhIG8gdmFsb3IgZGVzZWphZG8uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl3Q2xvc2VCdG4ubW91c2VvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAkKHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHRcdFx0XHQvL30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdmFyIG15TGF0bG5nID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbGF0IDogLTI1LjQ0ODkxMixcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGxuZyA6IC00OS4yNTM5MzJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIH07XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBwb3NpdGlvbiA6IG15TGF0bG5nLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbWFwIDogJHNjb3BlLm1hcCxcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGFuaW1hdGlvbiA6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdGl0bGUgOiAnSG90bWlsaycsXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBpY29uIDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXJsIDogJy4uLy4uL2ltZy9waW44MC5wbmcnLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gb3JpZ2luIDogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gc2NhbGVkU2l6ZSA6IG5ldyBnb29nbGUubWFwcy5TaXplKDQwLCA1Milcblx0XHRcdFx0XHRcdFx0XHRcdC8vIH1cblx0XHRcdFx0XHRcdFx0XHRcdC8vIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9cblx0XHRcdFx0XHRcdFx0XHQvL1x0bWFya2VyLmFkZExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vXHQgJHNjb3BlLm1hcC5zZXRab29tKDApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gJHNjb3BlLm1hcC5zZXRDZW50ZXIobWFya2VyLmdldFBvc2l0aW9uKCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly99KTtcblxuXHRcdFx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBnZXQgbG9jYXRpb25cIik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHR2YXIgYWRkSW5mb1dpbmRvdyA9IGZ1bmN0aW9uKG1hcmtlciwgcmVjb3JkLCBpbmZvV2luZG93LCBjb250ZW50KSB7XG4gICAgICAgIFxuXHRcdFx0ICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCAgdmFyIG5ld1Njb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG5cdFx0XHRcdCAgbmV3U2NvcGUucmVjb3JkID0gcmVjb3JkO1xuXHRcdFx0XHQgIHZhciBjb21waWxlZENvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0XHQgIGluZm9XaW5kb3cuc2V0Q29udGVudChjb21waWxlZENvbnRlbnQpO1xuXHRcdFx0XHQgIGluZm9XaW5kb3cub3BlbiggbWFwICwgbWFya2VyICk7XG5cdFx0XHQgIH0pO1xuXHRcdFx0fTtcblx0XHRcdFxuICAgICAgICAgICAgaW5pdE1hcCgpO1xuICAgICAgICAgICAgXG5cdFx0fSBdO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tYXAtdmlld1xcXFxtYXAtY29udHJvbGxlcjIuanNcIixcIi9tYXAtdmlld1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnTWFwJywgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udHJvbGxlcignTWFwQ3RybCcsIHJlcXVpcmUoJy4vbWFwLWNvbnRyb2xsZXIyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGlyZWN0aXZlKCdhbm5vdGF0aW9uTWFwJywgcmVxdWlyZSgnLi9kdi1hbm5vdGF0aW9uJykpO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tYXAtdmlld1xcXFxtYXAtdmlldy5qc1wiLFwiL21hcC12aWV3XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyogZ2xvYmFsIGdvb2dsZSAqL1xuLyogZ2xvYmFsIG1vZHVsZSAqL1xuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cbm1vZHVsZS5leHBvcnRzID0gWyckY29yZG92YUdlb2xvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnTG9hZFBhZ2UnLCAnR2FuaXhXUycsIGZ1bmN0aW9uKCRjb3Jkb3ZhR2VvbG9jYXRpb24sICRyb290U2NvcGUsIExvYWRQYWdlLCBHYW5peFdTKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Bhc3NvdSAwJyk7XG4gICAgICAgIHZhciBtYXAgPSBudWxsO1xuICAgICAgICB2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcHRpb25zID0ge3RpbWVvdXQ6IDEwMDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWV9O1xuICAgICAgICBjb25zb2xlLmxvZygncGFzc291IDEnKTtcbiAgICAgICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gXG4gICAgICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuXG4gICAgICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcbiAgICAgICAgICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcblxuICAgICAgICAgICAgLy9XYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy9Mb2FkIHRoZSBtYXJrZXJzXG4gICAgICAgICAgICAgICAgbG9hZE1hcmtlcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Bhc3NvdSAyJyk7XG4gICAgICAgIH0sIFxuICAgIFxuICAgICAgICBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBnZXQgbG9jYXRpb25cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vTG9hZCB0aGUgbWFya2Vyc1xuICAgICAgICAgICAgbG9hZE1hcmtlcnMoKTtcbiAgICAgICAgfSk7XG4gXG4gICAgfTtcbiBcbiAgICB2YXIgbG9hZE1hcmtlcnMgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL0dldCBhbGwgb2YgdGhlIG1hcmtlcnMgZnJvbSBvdXIgTWFya2VycyBmYWN0b3J5XG4gICAgICAgIGNvbnNvbGUubG9nKCdwYXNzb3UgMycpO1xuICAgICAgICBHYW5peFdTLmxpc3RFc3RhYmxpc2htZW50TWFwKCkudGhlbihmdW5jdGlvbihtYXJrZXJzKXtcbiAgICAgICAgICAgIHZhciByZWNvcmRzID0gbWFya2Vycy5kYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWNvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhciByZWNvcmQgPSByZWNvcmRzW2ldO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB2YXIgbWFya2VyUG9zID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhyZWNvcmQubGF0aXR1ZGUsIHJlY29yZC5sb25naXR1ZGUpO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB2YXIgaW1hZ2VOYW1lID0gJy4vLi9pbWcvcGluJztcbiAgICAgICAgICAgICAgdmFyIGltYWdlRXh0TmFtZSA9ICcucG5nJztcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHZhciBwZW9wbGVRdWFudGl0eSA9IHJlY29yZC5tYW5RdWFudGl0eSArIHJlY29yZC53b21hblF1YW50aXR5O1xuICAgICAgICAgICAgICB2YXIgcGVyY1Blc3NvYXMgPSAgKHBlb3BsZVF1YW50aXR5IC8gcmVjb3JkLnF1YW50aXR5TGltaXQpICogMTAwO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdmFyIHBlcmNOYW1lID0gJzAnO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjUGVzc29hcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjTmFtZSA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY1Blc3NvYXMgPD0gMjApIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY05hbWUgPSBcIjIwXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJjUGVzc29hcyA8PSA0MCkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjTmFtZSA9IFwiNDBcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlcmNQZXNzb2FzIDw9IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNOYW1lID0gXCI2MFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY1Blc3NvYXMgPD0gODApIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY05hbWUgPSBcIjgwXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY05hbWUgPSBcIjEwMFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgbWFya2VydG8gdGhlIG1hcFxuICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWFya2VyUG9zLFxuICAgICAgICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGltYWdlTmFtZSArIHBlcmNOYW1lICsgaW1hZ2VFeHROYW1lLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg0MCw1MilcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJzxhbm5vdGF0aW9uLW1hcD48L2Fubm90YXRpb24tbWFwPic7XG4gICAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAgICAgICAgICAgYWRkSW5mb1dpbmRvdyhtYXJrZXIsIHJlY29yZCwgaW5mb1dpbmRvdywgY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyBcbiAgICB9O1xuIFxuICAgIHZhciBhZGRJbmZvV2luZG93ID0gZnVuY3Rpb24obWFya2VyLCByZWNvcmQsIGluZm9XaW5kb3csIGNvbnRlbnQpIHtcbiAgICAgICAgXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld1Njb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgbmV3U2NvcGUucmVjb3JkID0gcmVjb3JkO1xuICAgICAgICAgIHZhciBjb21waWxlZENvbnRlbnQgPSBMb2FkUGFnZS5sb2FkSFRtbFBhZ2UoY29udGVudCwgbmV3U2NvcGUpO1xuICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChjb21waWxlZENvbnRlbnQpO1xuICAgICAgICAgIGluZm9XaW5kb3cub3BlbiggbWFwICwgbWFya2VyICk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGFzc291IC0xJyk7XG4gICAgICAgICAgICBpbml0TWFwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGFzc291IDAwMCcpO1xuICAgICAgICB9XG4gICAgfTtcbn1dO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21hcHMtZmFjdG9yeS5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qZ2xvYmFsIG1vZHVsZSovXG4ndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJue1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vdGVtcGxhdGVzL21lbnUtdmlldy9hYm91dC5odG1sJ1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJlL1UrOTdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tZW51LXZpZXdcXFxcZHYtYWJvdXQtdmlldy5qc1wiLFwiL21lbnUtdmlld1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59XTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZS9VKzk3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbWVudS12aWV3XFxcXG1lbnUtY29udHJvbGxlci5qc1wiLFwiL21lbnUtdmlld1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ01lbnUnLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250cm9sbGVyKCdNZW51Q3RybCcsIHJlcXVpcmUoJy4vbWVudS1jb250cm9sbGVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGlyZWN0aXZlKCdhYm91dFZpZXcnLCByZXF1aXJlKCcuL2R2LWFib3V0LXZpZXcnKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImUvVSs5N1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21lbnUtdmlld1xcXFxtZW51LXZpZXcuanNcIixcIi9tZW51LXZpZXdcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRodHRwKSB7XG4gXG4gIHZhciBCQVNFX1VSTCA9ICdodHRwOi8vNTQuOTQuMTY4LjI6NTAyMDEvQVBJLyc7XG4gIHZhciBFU1RBQkxJU0hNRU5UX1NFUlZJQ0VfTkFNRSA9ICdFc3RhYmxpc2htZW50JztcbiAgXG4gIHZhciBmaWx0ZXJMaXN0ID0gW1xuXHR7IG5hbWU6IFwiV29vZHNcIiB9LFxuXHR7IG5hbWU6IFwiU2VydGFuZWpvXCIgfSxcblx0eyBuYW1lOiBcIlJvY2tcIiB9LFxuXHR7IG5hbWU6IFwiUG9wXCIgfSxcblx0eyBuYW1lOiBcIkJhclwiIH0sXG5cdHsgbmFtZTogXCJCYWxhZGFcIiB9LFxuXHR7IG5hbWU6IFwiRWxldHLDtG5pY2FcIiB9LFxuXHR7IG5hbWU6IFwiQmFyIGRvIEFsZW3Do29cIiB9LFxuXHR7IG5hbWU6IFwiU2hlZFwiIH0sXG5cdHsgbmFtZTogXCJTYW50YSBNYXJ0YVwiIH0sXG5cdHsgbmFtZTogXCJCYXJhdG9cIiB9LFxuXHR7IG5hbWU6IFwiSG90bWlsa1wiIH0sXG5cdHsgbmFtZTogXCJGdW5rXCIgfVx0XG4gIF07XG4gIFxuICB2YXIgbWFya2VycyA9IFsge1xuXHRcdFx0XHRlc3RhYmxpc2htZW50SWQ6IDEsXG5cdFx0XHRcdGNucGogOiAxMjM0MjM0LFxuXHRcdFx0XHRlc3RhYmxpc2htZW50VHlwZSA6IFwiPG51bGw+XCIsXG5cdFx0XHRcdGZhbnRhc3lOYW1lIDogXCJXb29kcyBDdXJpdGliYVwiLFxuXHRcdFx0XHRsYXRpdHVkZSA6IFwiLTI1LjQ0ODY5NzRcIixcblx0XHRcdFx0bG9uZ2l0dWRlIDogXCItNDkuMzA1MDQyMTVcIixcblx0XHRcdFx0bWFuUXVhbnRpdHkgOiAxLFxuXHRcdFx0XHRxdWFudGl0eUxpbWl0IDogMTAwLFxuXHRcdFx0XHRzZXJ2aWNlVmVyc2lvbiA6IFwiMS4wLjBcIixcblx0XHRcdFx0dGlja2V0VmFsdWUgOiA3MCxcblx0XHRcdFx0d29tYW5RdWFudGl0eSA6IDFcblx0XHRcdH0sIHtcblx0XHRcdFx0ZXN0YWJsaXNobWVudElkOiAyLFxuXHRcdFx0XHRjbnBqIDogMTI1MDI4MTIwMDAxMTQsXG5cdFx0XHRcdGVzdGFibGlzaG1lbnRUeXBlIDogXCI8bnVsbD5cIixcblx0XHRcdFx0ZmFudGFzeU5hbWUgOiBcIlNoZWQgQmFyXCIsXG5cdFx0XHRcdGxhdGl0dWRlIDogXCItMjUuNDQzNjkwXCIsXG5cdFx0XHRcdGxvbmdpdHVkZSA6IFwiLTQ5LjI5NDYxN1wiLFxuXHRcdFx0XHRtYW5RdWFudGl0eSA6IDEwMCxcblx0XHRcdFx0cXVhbnRpdHlMaW1pdCA6IDMwMCxcblx0XHRcdFx0c2VydmljZVZlcnNpb24gOiBcIjEuMC4wXCIsXG5cdFx0XHRcdHRpY2tldFZhbHVlIDogNTAsXG5cdFx0XHRcdHdvbWFuUXVhbnRpdHkgOiA1MFxuXHRcdFx0fSwge1xuXHRcdFx0XHRlc3RhYmxpc2htZW50SWQ6IDMsXG5cdFx0XHRcdGNucGogOiAxMjUwMjgxMjAwMDExNCxcblx0XHRcdFx0ZXN0YWJsaXNobWVudFR5cGUgOiBcIjxudWxsPlwiLFxuXHRcdFx0XHRmYW50YXN5TmFtZSA6IFwiU2FudGEgTWFydGFcIixcblx0XHRcdFx0bGF0aXR1ZGUgOiBcIi0yNS40NDQwNjVcIixcblx0XHRcdFx0bG9uZ2l0dWRlIDogXCItNDkuMjkyNDIyXCIsXG5cdFx0XHRcdG1hblF1YW50aXR5IDogNTAsXG5cdFx0XHRcdHF1YW50aXR5TGltaXQgOiAzMDAsXG5cdFx0XHRcdHNlcnZpY2VWZXJzaW9uIDogXCIxLjAuMFwiLFxuXHRcdFx0XHR0aWNrZXRWYWx1ZSA6IDUwLFxuXHRcdFx0XHR3b21hblF1YW50aXR5IDogNTBcblx0XHRcdH0sIHtcblx0XHRcdFx0ZXN0YWJsaXNobWVudElkOiA0LFxuXHRcdFx0XHRjbnBqIDogMTI1MDI4MTIwMDAxMTQsXG5cdFx0XHRcdGVzdGFibGlzaG1lbnRUeXBlIDogXCI8bnVsbD5cIixcblx0XHRcdFx0ZmFudGFzeU5hbWUgOiBcIkJhciBkbyBBbGVtw6NvXCIsXG5cdFx0XHRcdGxhdGl0dWRlIDogXCItMjUuNDI3NzkwXCIsXG5cdFx0XHRcdGxvbmdpdHVkZSA6IFwiLTQ5LjI3MjY2OFwiLFxuXHRcdFx0XHRtYW5RdWFudGl0eSA6IDEwLFxuXHRcdFx0XHRxdWFudGl0eUxpbWl0IDogMzAwLFxuXHRcdFx0XHRzZXJ2aWNlVmVyc2lvbiA6IFwiMS4wLjBcIixcblx0XHRcdFx0dGlja2V0VmFsdWUgOiA1MCxcblx0XHRcdFx0d29tYW5RdWFudGl0eSA6IDIwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGVzdGFibGlzaG1lbnRJZDogNSxcblx0XHRcdFx0Y25waiA6IDEyNTAyODEyMDAwMTE0LFxuXHRcdFx0XHRlc3RhYmxpc2htZW50VHlwZSA6IFwiPG51bGw+XCIsXG5cdFx0XHRcdGZhbnRhc3lOYW1lIDogXCJIb2xtaWxrIE1vZGFmb2NrYVwiLFxuXHRcdFx0XHRsYXRpdHVkZSA6IFwiLTI1LjQ0ODkxMlwiLFxuXHRcdFx0XHRsb25naXR1ZGUgOiBcIi00OS4yNTM5MzJcIixcblx0XHRcdFx0bWFuUXVhbnRpdHkgOiAyMDAsXG5cdFx0XHRcdHF1YW50aXR5TGltaXQgOiAxMDAwLFxuXHRcdFx0XHRzZXJ2aWNlVmVyc2lvbiA6IFwiMS4wLjBcIixcblx0XHRcdFx0dGlja2V0VmFsdWUgOiA1MCxcblx0XHRcdFx0d29tYW5RdWFudGl0eSA6IDY2NlxuXHRcdFx0fSwge1xuXHRcdFx0XHRlc3RhYmxpc2htZW50SWQ6IDYsXG5cdFx0XHRcdGNucGogOiAxMjUwMjgxMjAwMDExNCxcblx0XHRcdFx0ZXN0YWJsaXNobWVudFR5cGUgOiBcIjxudWxsPlwiLFxuXHRcdFx0XHRmYW50YXN5TmFtZSA6IFwiUGFyYWdvYmFsYVwiLFxuXHRcdFx0XHRsYXRpdHVkZSA6IFwiLTIuOTkyNjE1XCIsXG5cdFx0XHRcdGxvbmdpdHVkZSA6IFwiLTQ3LjM1NjAyOVwiLCBcblx0XHRcdFx0bWFuUXVhbnRpdHkgOiAzMDAsXG5cdFx0XHRcdHF1YW50aXR5TGltaXQgOiAxMDAwLFxuXHRcdFx0XHRzZXJ2aWNlVmVyc2lvbiA6IFwiMS4wLjBcIixcblx0XHRcdFx0dGlja2V0VmFsdWUgOiAyMCxcblx0XHRcdFx0d29tYW5RdWFudGl0eSA6IDYwMFxuXHRcdFx0fSAgXTtcbiAgXG4gIHJldHVybiB7XG4gICAgLypsaXN0RXN0YWJsaXNobWVudE1hcDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoQkFTRV9VUkwgKyBFU1RBQkxJU0hNRU5UX1NFUlZJQ0VfTkFNRSArIFwiL0xpc3RFc3RhYmxpc2htZW50TWFwXCIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0pO1xuICAgIH0sKi9cblx0bGlzdEVzdGFibGlzaG1lbnRNYXA6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIG1hcmtlcnM7XG5cdH0sXG4gICAgZXN0YWJsaXNobWVudERldGFpbDogZnVuY3Rpb24oZXN0YWJsaXNobWVudElkKXtcbiAgICAgIHJldHVybiB7XG5cdFx0XHRcdFwiZXN0YWJsaXNobWVudElkXCI6ZXN0YWJsaXNobWVudElkLFxuICAgICAgICAgICAgICAgIFwiZXN0YWJsaXNobWVudE5hbWVcIjpcIk5vbWUgZG8gRXN0YWJlbGVjaW1lbnRvXCIsXG4gICAgICAgICAgICAgICAgXCJlc3RhYmxpc2htZW50VGFnc1wiOlwiQmFyLCBCYWxhZGEsIEhhcHB5IEhvdXIsIE1QQlwiLCBcbiAgICAgICAgICAgICAgICBcImVzdGFibGlzaG1lbnREZXNjcmlwdGlvblwiOlwiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gVmVzdGlidWx1bSBlbGVpZmVuZCB2aXRhZSB0dXJwaXMgcGVsbGVudGVzcXVlIGltcGVyZGlldC4gTmFtIHVsdHJpY2llcyBzdXNjaXBpdCBwb3J0dGl0b3IuIEFsaXF1YW0gZWxlaWZlbmQgbGFjaW5pYSB0cmlzdGlxdWUuIEZ1c2NlIG9ybmFyZSBhdWd1ZSB0b3J0b3IsIHV0IGxhb3JlZXQgbWkgY3Vyc3VzIGEuIEluIGRpZ25pc3NpbSBxdWlzIG1pIGV0IHZhcml1cy4gSW50ZXJkdW0gZXQgbWFsZXN1YWRhIGZhbWVzIGFjIGFudGUgaXBzdW0gcHJpbWlzIGluIGZhdWNpYnVzLiBEdWlzIGZpbmlidXMgbG9yZW0gYSB1cm5hIHNvZGFsZXMgbWFsZXN1YWRhLiBDcmFzIGEgbmlzbCBwZWxsZW50ZXNxdWUgZmVsaXMgbG9ib3J0aXMgbWFsZXN1YWRhIHZlbCB2ZWwgYW50ZS5cIiAsXG4gICAgICAgICAgICAgICAgXCJzdGFydFRpbWVcIjogXCIyMTowMFwiLCBcbiAgICAgICAgICAgICAgICBcImVuZFRpbWVcIjogXCIwMTowMFwiLFxuICAgICAgICAgICAgICAgIFwiZGlzdGFuY2VcIjogXCI1XCIsXG4gICAgICAgICAgICAgICAgXCJkaXN0YW5jZVVuaXRcIjpcImttXCIsXG4gICAgICAgICAgICAgICAgXCJ0aWNrZXRWYWx1ZVwiOlwiMjVcIlxuICAgICAgICAgICAgIH07XG4gICAgfSxcbiAgICBjYXBhY2l0eURldGFpbDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgXCJ3b21hblF1YW50aXR5XCI6XCI3NVwiLCBcbiAgICAgICAgICAgICAgICBcIm1hblF1YW50aXR5XCI6IFwiNTBcIiwgXG4gICAgICAgICAgICAgICAgXCJlc3RpbWVkUXVhbnRpdHlcIjogXCIxNDBcIixcbiAgICAgICAgICAgICAgICBcInRvdGFsUXVhbnRpdHlcIjogXCIyMDBcIlxuICAgICAgICAgICAgIH07XG4gICAgfSxcbiAgICBwcm9tb3Rpb25EZXRhaWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFwicHJvbW90aW9uRGVzY3JpcHRpb25zXCI6IFtcInByb21vdGlvbiBkZXNjcmlwdGlvbiBvbmVcIixcInByb21vdGlvbiBkZXNjcmlwdGlvbiB0d29cIixcInByb21vdGlvbiBkZXNjcmlwdGlvbiB0aHJlZVwiXVxuICAgICAgICAgICAgICAgfTtcbiAgICB9LFxuICAgIGFkZHJlc3NEZXRhaWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFwic3RyZWV0XCI6XCJBdmVuaWRhIFJlcMO6YmxpY2EgRmVkZXJhdGl2YSBkbyBCcmFzaWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJcIjpcIjEwMDAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmVpZ2hib3Job29kXCI6XCJKYXJkaW0gQW3DqWxpYVwiLFxuICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRcIjpcIkNvbmp1bnRvIGRhcyBBbWV4ZWlyYXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6XCJTw6NvIEpvc8OpIGRvcyBQaW5oYWlzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjpcIlBhcmFuw6FcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZUNvZGVcIjpcIlBSXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiQnJhc2lsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiemlwQ29kZVwiOlwiODAwMDAtMDAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGF0aXR1ZGVcIjpcIi00Ni4wMDAwMDFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsb25naXR1ZGVcIjpcIi0yNS4wMDAwMDFcIlxuICAgICAgICAgICAgICAgfTtcbiAgICB9LFxuICAgIGltYWdlRGV0YWlsOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge1widXJsc1wiOiBbXCJodHRwczovL2FyYXV0b2RlY3Jpc3RvNzc3LmZpbGVzLndvcmRwcmVzcy5jb20vMjAxMy8xMi9iYWxhZGEuanBnXCIsXG5cdFx0XHRcdFx0XHRcdFwiaHR0cDovL2ltZy5lbG83LmNvbS5ici9wcm9kdWN0L29yaWdpbmFsLzYzMTQ5MC9wYWluZWwtYmFsYWRhLmpwZ1wiLCBcblx0XHRcdFx0XHRcdFx0XCJodHRwOi8vbXVsaGVyc2VtdmVyZ29uaGEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE2LzAyL211bGhlci1kYW5jYW5kby01MzYwOC5qcGdcIiwgXG5cdFx0XHRcdFx0XHRcdFwiaHR0cDovL2Jsb2cuc3ltcGxhLmNvbS5ici93cC1jb250ZW50L3VwbG9hZHMvMjAxMy8xMC9pU3RvY2tfMDAwMDEwODI4NzUwTGFyZ2UuanBnXCJcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0fTtcbiAgICB9LFxuICAgIGNvbnRhY3REZXRhaWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29udGFjdHNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250YWN0VHlwZVwiOlwidGVsZXBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250YWN0VmFsdWVcIjogXCIrNTUgNDEgMDAwMDAtMDAwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGFjdFR5cGVcIjpcImVtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250YWN0VmFsdWVcIjogXCJlbWFpbEBlbWFpbC5jb20uYnJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRhY3RUeXBlXCI6XCJza3lwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGFjdFZhbHVlXCI6IFwic2t5cGV1c2VyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250YWN0VHlwZVwiOlwiZmFjZWJvb2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRhY3RWYWx1ZVwiOiBcInd3dy5mYWNlYm9vay5jb20vdXNlcmZhY2Vib29rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgfTtcbiAgICB9LFxuXHRmaWx0ZXJUYWdzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZmlsdGVyTGlzdDtcblx0fVxuICAgIFxuICB9O1xufTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZS9VKzk3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvd3MtZmFjdG9yeS5qc1wiLFwiL1wiKSJdfQ==

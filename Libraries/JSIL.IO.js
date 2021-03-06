"use strict";

if (typeof (JSIL) === "undefined")
  throw new Error("JSIL.Core is required");

$private = $jsilcore;

if (!JSIL.GetAssembly("mscorlib", true)) {

  JSIL.DeclareNamespace("System");
  JSIL.DeclareNamespace("System.IO");

  JSIL.MakeClass($jsilcore.TypeRef("System.Object"), "System.Environment", false, [], function ($) {
    $.Property({Static:true , Public:true }, "CurrentManagedThreadId", $.Int32);
  });

  JSIL.MakeClass($jsilcore.TypeRef("System.Object"), "System.MarshalByRefObject", true, [], function ($) {
    $.Field({Static:false, Public:false}, "__identity", $.Object);

    $.Property({Static:false, Public:false, Virtual: true}, "Identity");
  });

  JSIL.MakeClass($jsilcore.TypeRef("System.MarshalByRefObject"), "System.IO.Stream", true, [], function ($) {
    $.Constant({Static:true , Public:false}, "_DefaultBufferSize", 4096);

    $.Field({Static:true , Public:true }, "Null", $.Type);

    $.Property({Static:false, Public:true, Virtual: true }, "CanRead");

    $.Property({Static:false, Public:true, Virtual: true }, "CanSeek");

    $.Property({Static:false, Public:true, Virtual: true }, "CanTimeout");

    $.Property({Static:false, Public:true, Virtual: true }, "CanWrite");

    $.Property({Static:false, Public:true, Virtual: true }, "Length");

    $.Property({Static:false, Public:true, Virtual: true }, "Position");

    $.Property({Static:false, Public:true, Virtual: true }, "ReadTimeout");

    $.Property({Static:false, Public:true, Virtual: true }, "WriteTimeout");

    $.ImplementInterfaces($jsilcore.TypeRef("System.IDisposable"))
  });

  JSIL.MakeClass($jsilcore.TypeRef("System.IO.Stream"), "System.IO.MemoryStream", true, [], function ($) {
    $.Field({Static:false, Public:false}, "_buffer", $jsilcore.TypeRef("System.Array", [$.Byte]));

    $.Field({Static:false, Public:false}, "_capacity", $.Int32);

    $.Field({Static:false, Public:false}, "_expandable", $.Boolean);

    $.Field({Static:false, Public:false}, "_exposable", $.Boolean);

    $.Field({Static:false, Public:false}, "_isOpen", $.Boolean);

    $.Field({Static:false, Public:false}, "_length", $.Int32);

    $.Field({Static:false, Public:false}, "_origin", $.Int32);

    $.Field({Static:false, Public:false}, "_position", $.Int32);

    $.Field({Static:false, Public:false}, "_writable", $.Boolean);

    $.Constant({Static:true , Public:false}, "MemStreamMaxLength", 2147483647);

    $.Property({Static:false, Public:true, Virtual: true }, "CanRead");

    $.Property({Static:false, Public:true, Virtual: true }, "CanSeek");

    $.Property({Static:false, Public:true, Virtual: true }, "CanWrite");

    $.Property({Static:false, Public:true, Virtual: true }, "Capacity");

    $.Property({Static:false, Public:true, Virtual: true }, "Length");

    $.Property({Static:false, Public:true, Virtual: true }, "Position");
  });

}

var $jsilio = JSIL.DeclareAssembly("JSIL.IO");

JSIL.ImplementExternals("System.Environment", function ($) {
  $.Method({Static:true , Public:true }, "get_CurrentManagedThreadId",
    (new JSIL.MethodSignature($.Int32, [], [])),
    function () {
      return 1;
    }
  );
});

JSIL.ImplementExternals("System.IO.File", function ($) {
  $.Method({Static:true , Public:true }, "Exists", 
    new JSIL.MethodSignature($.Boolean, [$.String], []),
    function (filename) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var resolved = storageRoot.resolvePath(filename, false);

        if (resolved && resolved.type === "file")
          return true;
      }

      return JSIL.Host.doesFileExist(filename) || 
        JSIL.Host.doesAssetExist(filename, true);
    }
  );

  $.Method({Static:true , Public:true }, "Open", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$.String, $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess")], [])), 
    function OpenRead (path, mode, access) {
      return new System.IO.FileStream(path, mode, access);
    }
  );

  $.Method({Static:true , Public:true }, "OpenRead", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$.String], [])), 
    function OpenRead (path) {
      return new System.IO.FileStream(path, System.IO.FileMode.Open);
    }
  );

  $.Method({Static:true , Public:true }, "OpenWrite", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$.String], [])), 
    function OpenWrite (path) {
      return new System.IO.FileStream(path, System.IO.FileMode.OpenOrCreate);
    }
  );

  $.Method({Static:true , Public:true }, "Create", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$.String], [])), 
    function Create (path) {
      return new System.IO.FileStream(path, System.IO.FileMode.Create);
    }
  );

  $.Method({Static:true , Public:true }, "Delete", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function Delete (path) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var resolved = storageRoot.resolvePath(path, false);

        if (resolved && resolved.type === "file")
          resolved.unlink();
      }      
    }
  );

  $.Method({Static:true , Public:true }, "ReadAllText", 
    new JSIL.MethodSignature($.String, [$.String], []),
    function (filename) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var resolved = storageRoot.resolvePath(filename, false);

        if (resolved && resolved.type === "file")
          return JSIL.StringFromByteArray(resolved.readAllBytes());
      }

      var file = JSIL.Host.getFile(filename);
      return JSIL.StringFromByteArray(file);
    }
  );
});

JSIL.ImplementExternals("System.IO.Path", function ($) {
  var combineImpl = function () {
    return Array.prototype.slice.call(arguments).join("\\");
  };

  $.Method({Static:true , Public:true }, "Combine", 
    new JSIL.MethodSignature($.String, [$.String, $.String], []),
    combineImpl
  );

  $.Method({Static:true , Public:true }, "Combine", 
    new JSIL.MethodSignature($.String, [
        $.String, $.String, 
        $.String
      ], []),
    combineImpl
  );

  $.Method({Static:true , Public:true }, "Combine", 
    new JSIL.MethodSignature($.String, [
        $.String, $.String, 
        $.String, $.String
      ], []),
    combineImpl
  );

  $.Method({Static:true , Public:true }, "GetExtension", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetExtension (path) {
      var index = path.lastIndexOf(".");
      if (index >= 0) {
        return path.substr(index + 1);
      }

      return "";
    }
  );

  $.Method({Static:true , Public:true }, "GetDirectoryName", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetDirectoryName (path) {
      var index = Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/"));
      if (index >= 0) {
        return path.substr(0, index);
      }

      return "";
    }
  );

  $.Method({Static:true , Public:true }, "GetFullPath", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetFullPath (path) {
      // FIXME
      return path;
    }
  );

  $.Method({Static:true , Public:true }, "GetFileName", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetFileName (path) {
      var index = Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/"));
      if (index >= 0) {
        return path.substr(index + 1);
      }

      return path;
    }
  );

  $.Method({Static:true , Public:true }, "GetFileNameWithoutExtension", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetFileNameWithoutExtension (path) {
      var index = Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/"));
      if (index >= 0) {
        path = path.substr(index + 1);
      }

      index = path.indexOf(".");
      if (index >= 0)
        path = path.substr(0, index);

      return path;
    }
  );
});

JSIL.ImplementExternals("System.IO.Stream", function ($) {
  $.Method({Static:false, Public:true }, "ReadByte", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function ReadByte () {
      var buffer = [];
      var count = this.Read(buffer, 0, 1);

      if (count >= 1)
        return buffer[0];
      else
        return -1;
    }
  );

  $.Method({Static:false, Public:true }, "Close", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Close () {
      if (this._onClose)
        this._onClose();
    }
  );

  $.Method({Static:false, Public:true }, "Dispose", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Dispose () {
      if (this._onClose)
        this._onClose();
    }
  );

  $.RawMethod(false, "$GetURI", function () {
    throw new Error("Only valid on streams created from files!");
  });
});

var $bytestream = function ($) {
  $.Method({Static:false, Public:true }, "Read", 
    (new JSIL.MethodSignature($.Int32, [
          $jsilcore.TypeRef("System.Array", [$.Byte]), $.Int32, 
          $.Int32
        ], [])), 
    function Read (buffer, offset, count) {
      var startPos = this._pos;
      var endPos = this._pos + count;

      if (endPos >= this._length) {
        endPos = this._length - 1;
        count = endPos - startPos + 1;
      }

      if ((startPos < 0) || (startPos >= this._length))
        return 0;

      for (var i = 0; i < count; i++) {
        buffer[i] = this._buffer[startPos + i];
      }

      this._pos += count;

      return count;
    }
  );

  $.Method({Static:false, Public:true }, "$PeekByte", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function PeekByte () {
      if (this._pos >= this._length)
        return -1;

      return this._buffer[this._pos];
    }
  );

  $.Method({Static:false, Public:true }, "get_Position", 
    (new JSIL.MethodSignature($.Int64, [], [])), 
    function get_Position () {
      return this._pos;
    }
  );

  $.Method({Static:false, Public:true }, "set_Position", 
    (new JSIL.MethodSignature(null, [$.Int64], [])), 
    function set_Position (value) {
      this._pos = value;
    }
  );

  $.Method({Static:false, Public:true }, "get_Length", 
    (new JSIL.MethodSignature($.Int64, [], [])), 
    function get_Length () {
      return this._length;
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [
          $jsilcore.TypeRef("System.Array", [$.Byte]), $.Int32, 
          $.Int32
        ], [])), 
    function Write (buffer, offset, count) {
      var newPosition = this._pos + count;

      if (newPosition > this._length)
        this._length = newPosition;

      for (var i = 0; i < count; i++)
        this._buffer[this._pos + i] = buffer[offset + i];

      this._pos = newPosition;

      this._modified = true;
    }
  );

  $.Method({Static:false, Public:true }, "WriteByte", 
    (new JSIL.MethodSignature(null, [$.Byte], [])), 
    function WriteByte (value) {
      if (this._pos >= this._length)
        this._length += 1;

      this._buffer[this._pos] = value;
      this._pos += 1;

      this._modified = true;
    }
  );

};

JSIL.ImplementExternals("System.IO.FileStream", function ($) {
  $.Method({Static:false, Public:false}, ".ctor", 
    (new JSIL.MethodSignature(null, [], [])), 
    function _ctor () {
      System.IO.Stream.prototype._ctor.call(this);

      this._pos = 0;
      this._length = 0;
    }
  );
  
  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String, $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess")], [])), 
    function _ctor (path, mode, access) {
      // FIXME: access
      System.IO.FileStream.prototype._ctor.call(this, path, mode);
    }
  );
  
  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String, $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess"), $jsilcore.TypeRef("System.IO.FileShare")], [])), 
    function _ctor (path, mode, access, share) {
      // FIXME: access, share
      System.IO.FileStream.prototype._ctor.call(this, path, mode);
    }
  );

  var ctorImpl = function _ctor (path, mode) {
    System.IO.Stream.prototype._ctor.call(this);

    var storageRoot = JSIL.Host.getStorageRoot();

    if (storageRoot) {
      var createNew = (mode == System.IO.FileMode.Create) || 
        (mode == System.IO.FileMode.CreateNew) || 
        (mode == System.IO.FileMode.OpenOrCreate);

      var resolved = storageRoot.resolvePath(path, false);

      if (createNew && !resolved)
        resolved = storageRoot.createFile(path, true);

      if (resolved && resolved.type === "file") {
        this.$fromVirtualFile(resolved, mode, true);
        return;
      }
    }

    this._fileName = path;
    this._buffer = JSIL.Host.getFile(path);
    if (
      (typeof (this._buffer) === "undefined") ||
      (typeof (this._buffer.length) !== "number")
    )
      throw new System.Exception("Unable to get an array for the file '" + path + "'");

    this._pos = 0;
    this._length = this._buffer.length;

    this.$applyMode(mode);
  };

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String, $jsilcore.TypeRef("System.IO.FileMode")], [])), 
    ctorImpl
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String, $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess")], [])), 
    // FIXME: access
    ctorImpl
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String, $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess"), $jsilcore.TypeRef("System.IO.FileShare")], [])), 
    // FIXME: access, share
    ctorImpl
  );
  
  $.Method({Static:false, Public:true }, "get_CanSeek", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function get_CanSeek () {
      return true;
    }
  );
  
  $.Method({Static:false, Public:true }, "Seek", 
    (new JSIL.MethodSignature($.Int64, [$.Int64, $jsilcore.TypeRef("System.IO.SeekOrigin")], [])), 
    function Seek (offset, origin) {
      switch (origin)
      {
      case System.IO.SeekOrigin.Begin:
        this._pos = offset;
        break;
      case System.IO.SeekOrigin.Current:
        this._pos += offset;
        break;
      case System.IO.SeekOrigin.End:
        this._pos = this._buffer.length - offset;
        break;
      }
      return this._pos;
    }
  );

  $.RawMethod(false, "$applyMode", function (fileMode) {
    var fm = System.IO.FileMode;

    if (
      (fileMode == fm.Create) ||
      (fileMode == fm.Truncate) ||
      (fileMode == fm.CreateNew)
    ) {
      this._buffer = [];
      this._length = 0;
    } else if (fileMode == fm.Append) {
      this._pos = this._length;
    }
  });

  $.RawMethod(false, "$GetURI", function () {
    var slashRe = /\\/g;
    var uri = ("./" + this._fileName).replace(slashRe, "/");

    return uri;
  });
});

JSIL.ImplementExternals(
  "System.IO.FileStream", $bytestream
);

JSIL.ImplementExternals("System.IO.MemoryStream", function ($) {
  var ctorBytesImpl = function (self, bytes, writable) {
    System.IO.Stream.prototype._ctor.call(self);

    self._buffer = bytes;
    self._writable = writable;
    self._length = self._capacity = bytes.length;
    self._pos = 0;
  };

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [], [])), 
    function _ctor () {
      ctorBytesImpl(this, [], true);
    }
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Array", [$.Byte])], [])), 
    function _ctor (buffer) {
      ctorBytesImpl(this, buffer, true);
    }
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Array", [$.Byte]), $.Boolean], [])), 
    function _ctor (buffer, writable) {
      ctorBytesImpl(this, buffer, writable);
    }
  );

  $.Method({Static:false, Public:true }, "GetBuffer", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Byte]), [], [])), 
    function GetBuffer () {
      return this._buffer;
    }
  );
});

JSIL.ImplementExternals(
  "System.IO.MemoryStream", $bytestream
);

JSIL.ImplementExternals("System.IO.BinaryWriter", function ($) {
  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.IO.Stream")], [])), 
    function _ctor (output) {
      this.m_stream = output;
      this.m_encoding = new System.Text.UTF8Encoding(false, true);
    }
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.IO.Stream"), $jsilcore.TypeRef("System.Text.Encoding")], [])), 
    function _ctor (output, encoding) {
      this.m_stream = output;
      this.m_encoding = encoding;
    }
  );

  $.Method({Static:false, Public:true }, "get_BaseStream", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.Stream"), [], [])), 
    function get_BaseStream () {
      return this.m_stream;
    }
  );

  $.RawMethod(false, "$writeBytes", function (bytes) {
    this.m_stream.Write(bytes, 0, bytes.length);
  });

  $.Method({Static:false, Public:true }, "Flush", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Flush () {
    }
  );

  $.Method({Static:false, Public:true }, "Seek", 
    (new JSIL.MethodSignature($.Int64, [$.Int32, $jsilcore.TypeRef("System.IO.SeekOrigin")], [])), 
    function Seek (offset, origin) {
      this.m_stream.Seek(offset, origin);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Boolean], [])), 
    function Write (value) {
      this.$writeBytes([value ? 1 : 0]);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Byte], [])), 
    function Write (value) {
      this.$writeBytes([value]);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.SByte], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Array", [$.Byte])], [])), 
    function Write (buffer) {
      this.$writeBytes(buffer);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [
          $jsilcore.TypeRef("System.Array", [$.Byte]), $.Int32, 
          $.Int32
        ], [])), 
    function Write (buffer, index, count) {
      this.m_stream.Write(buffer, index, count);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Char], [])), 
    function Write (ch) {
      var bytes = this.m_encoding.$encode(ch);
      this.$writeBytes(bytes);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Array", [$.Char])], [])), 
    function Write (chars) {
      var charString = JSIL.StringFromCharArray(chars);
      var bytes = this.m_encoding.$encode(charString);
      this.$writeBytes(bytes);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [
          $jsilcore.TypeRef("System.Array", [$.Char]), $.Int32, 
          $.Int32
        ], [])), 
    function Write (chars, index, count) {
      var charString = JSIL.StringFromCharArray(chars, index, count);
      var bytes = this.m_encoding.$encode(charString);
      this.$writeBytes(bytes);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Double], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Int16], [])), 
    function Write (value) {
      var buffer = new Array(2);
      buffer[0] = (value >> 0) & 0xFF;
      buffer[1] = (value >> 8) & 0xFF;
      this.$writeBytes(buffer);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.UInt16], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Int32], [])), 
    function Write (value) {
      var buffer = new Array(4);
      buffer[0] = (value >> 0) & 0xFF;
      buffer[1] = (value >> 8) & 0xFF;
      buffer[2] = (value >> 16) & 0xFF;
      buffer[3] = (value >> 24) & 0xFF;
      this.$writeBytes(buffer);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.UInt32], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Int64], [])), 
    function Write (value) {
      var buffer = new Array(8);
      buffer[0] = (value >> 0) & 0xFF;
      buffer[1] = (value >> 8) & 0xFF;
      buffer[2] = (value >> 16) & 0xFF;
      buffer[3] = (value >> 24) & 0xFF;
      buffer[4] = (value >> 32) & 0xFF;
      buffer[5] = (value >> 40) & 0xFF;
      buffer[6] = (value >> 48) & 0xFF;
      buffer[7] = (value >> 56) & 0xFF;
      this.$writeBytes(buffer);
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.UInt64], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.Single], [])), 
    function Write (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Write", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function Write (value) {
      var bytes = this.m_encoding.$encode(value);

      this.Write7BitEncodedInt(bytes.length);
      this.$writeBytes(bytes);
    }
  );

  $.Method({Static:false, Public:false}, "Write7BitEncodedInt", 
    (new JSIL.MethodSignature(null, [$.Int32], [])), 
    function Write7BitEncodedInt (value) {
      var buf = new Array(1);

      while (value >= 128) {
        buf[0] = (value & 0xFF) | 128;
        this.$writeBytes(buf);

        value = value >> 7;
      }

      buf[0] = (value & 0xFF);
      this.$writeBytes(buf);
    }
  );
});

JSIL.ImplementExternals("System.IO.BinaryReader", function ($) {
  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.IO.Stream")], [])), 
    function _ctor (input) {
      System.Object.prototype._ctor.call(this);

      if (typeof (input) !== "object")
        throw new Error("Invalid stream");

      this.m_stream = input;
      this.m_encoding = System.Text.Encoding.ASCII;
    }
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.IO.Stream"), $jsilcore.TypeRef("System.Text.Encoding")], [])), 
    function _ctor (input, encoding) {
      System.Object.prototype._ctor.call(this);

      if (typeof (input) !== "object")
        throw new Error("Invalid stream");

      this.m_stream = input;
      this.m_encoding = encoding;
    }
  );

  $.Method({Static:false, Public:true }, "Close", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Close () {
      this.m_stream = null;
      this.m_encoding = null;
    }
  );

  $.Method({Static:false, Public:false}, "Read7BitEncodedInt", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function Read7BitEncodedInt () {
      var result = 0, bits = 0;

      while (bits < 35) {
        var b = this.ReadByte();
        result |= (b & 127) << bits;
        bits += 7;

        if ((b & 128) == 0)
          return result;
      }

      throw new System.FormatException("Bad 7-bit int format");
    }
  );

  $.Method({Static:false, Public:true }, "ReadBoolean", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function ReadBoolean () {
      return this.m_stream.ReadByte() != 0;
    }
  );

  $.Method({Static:false, Public:true }, "ReadByte", 
    (new JSIL.MethodSignature($.Byte, [], [])), 
    function ReadByte () {
      return this.m_stream.ReadByte();
    }
  );

  $.Method({Static:false, Public:true }, "ReadBytes", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Byte]), [$.Int32], [])), 
    function ReadBytes (count) {
      var result = new Array(count);
      var bytesRead = this.m_stream.Read(result, 0, count);
      return result.slice(0, bytesRead);
    }
  );

  $.Method({Static:false, Public:true }, "Read", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function Read () {
      return this.ReadChar().charCodeAt(0);
    }
  );
  
  $.Method({Static:false, Public:true }, "Read", 
    (new JSIL.MethodSignature($.Int32, [
          $jsilcore.TypeRef("System.Array", [$.Byte]), $.Int32, 
          $.Int32
        ], [])), 
    function Read (buffer, index, count) {
      this.m_stream.Read(buffer, index, count);
    }
  );

  $.Method({Static:false, Public:true }, "ReadChar", 
    (new JSIL.MethodSignature($.Char, [], [])), 
    function ReadChar () {
      var oldPosition = this.m_stream.Position;
      var utf8Encoding = new System.Text.UTF8Encoding();
      utf8Encoding.fallbackCharacter = "\uFFFF";
      var firstChar, actualLength;

      for (var i = 1; i < 5; i++) {
        this.m_stream.Position = oldPosition;
        
        // A valid UTF-8 codepoint is 1-4 bytes
        var bytes = [false, false, false, false];
        this.m_stream.Read(bytes, 0, bytes.length);

        var str = utf8Encoding.$decode(bytes);
        if (str.length < 1)
          continue;

        firstChar = str[0];

        if (firstChar === utf8Encoding.fallbackCharacter)
          continue;

        // We need to ensure that if we grabbed extra bytes, we rewind
        // FIXME: This is wrong if the chars aren't normalized. Augh.
        var actualCharEncoded = utf8Encoding.$encode(str.substr(0, 1));
        actualLength = actualCharEncoded.length;

        break;
      }

      this.m_stream.Position = oldPosition + actualLength;
      return firstChar;
    }
  );

  $.Method({Static:false, Public:true }, "ReadChars", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Char]), [$.Int32], [])), 
    function ReadChars (count) {
      var result = new Array(count);
      for (var i = 0; i < count; i++) {
        // FIXME: This should probably be ReadChar?
        var b = this.m_stream.ReadByte();
        if (b === -1)
          return result.slice(0, i - 1);

        result[i] = String.fromCharCode(b);
      };

      return result;
    }
  );

  $.Method({Static:false, Public:true }, "ReadDouble", 
    (new JSIL.MethodSignature($.Double, [], [])), 
    function ReadDouble () {
      var bytes = this.ReadBytes(8);
      return this.$decodeFloat(bytes, 1, 11, 52, -1022, 1023, true);
    }
  );

  $.Method({Static:false, Public:true }, "ReadInt16", 
    (new JSIL.MethodSignature($.Int16, [], [])), 
    function ReadInt16 () {
      var value = this.ReadUInt16();
      if (value > 32767)
        return value - 65536;
      else
        return value;
    }
  );

  $.Method({Static:false, Public:true }, "ReadInt32", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function ReadInt32 () {
      var value = this.ReadUInt32();
      if (value > 2147483647)
        return value - 4294967296;
      else
        return value;
    }
  );

  $.Method({Static:false, Public:true }, "ReadInt64", 
    (new JSIL.MethodSignature($.Int64, [], [])), 
    function ReadInt64 () {
      // FIXME: Does this work right for negative numbers or does 53-bit rounding kill it?
      // FIXME: Generate warnings for values out of 53-bit range.
      var value = this.ReadUInt64();
      if (value > System.Int64.MaxValue)
        return value - 18446744073709551616;
      else
        return value;
    }
  );

  $.Method({Static:false, Public:true }, "ReadSByte", 
    (new JSIL.MethodSignature($.SByte, [], [])), 
    function ReadSByte () {
      var byt = this.m_stream.ReadByte();
      if (byt > 127)
        return byt - 256;
      else
        return byt;
    }
  );

  $.Method({Static:false, Public:true }, "ReadSingle", 
    (new JSIL.MethodSignature($.Single, [], [])), 
    function ReadSingle () {
      var bytes = this.ReadBytes(4);
      return this.$decodeFloat(bytes, 1, 8, 23, -126, 127, true);
    }
  );

  $.Method({Static:false, Public:true }, "ReadString", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function ReadString () {
      var size = this.Read7BitEncodedInt();
      if (size <= 0)
        return "";

      var bytes = this.ReadBytes(size);
      return JSIL.StringFromByteArray(bytes);
    }
  );

  $.Method({Static:false, Public:true }, "ReadUInt16", 
    (new JSIL.MethodSignature($.UInt16, [], [])), 
    function ReadUInt16 () {
      var low = this.m_stream.ReadByte();
      return low + (this.m_stream.ReadByte() * 256);
    }
  );

  $.Method({Static:false, Public:true }, "ReadUInt32", 
    (new JSIL.MethodSignature($.UInt32, [], [])), 
    function ReadUInt32 () {
      var low1 = this.m_stream.ReadByte();
      var low2 = this.m_stream.ReadByte();
      var low3 = this.m_stream.ReadByte();
      var low4 = this.m_stream.ReadByte();
      return low1 + (low2 * 256) + (low3 * 65536) + (low4 * 16777216);
    }
  );

  $.Method({Static:false, Public:true }, "ReadUInt64", 
    (new JSIL.MethodSignature($.UInt64, [], [])), 
    function ReadUInt64 () {
      // FIXME: Generate warnings for values out of 53-bit range.
      var low1 = this.m_stream.ReadByte();
      var low2 = this.m_stream.ReadByte();
      var low3 = this.m_stream.ReadByte();
      var low4 = this.m_stream.ReadByte();
      var low5 = this.m_stream.ReadByte();
      var low6 = this.m_stream.ReadByte();
      var low7 = this.m_stream.ReadByte();
      var low8 = this.m_stream.ReadByte();
      return low1 | (low2 << 8) | (low3 << 16) | (low4 << 24) | (low5 << 32) | (low6 << 40) | (low7 << 48) | (low8 << 56);
    }
  );

  $.Method({Static:false, Public:true }, "PeekChar", 
    (new JSIL.MethodSignature($.Int32, [], [])), 
    function PeekChar () {
      return String.fromCharCode(this.m_stream.$PeekByte());
    }
  );

  $.RawMethod(false, "$decodeFloat", 
    // Derived from http://stackoverflow.com/a/8545403/106786
    function decodeFloat (bytes, signBits, exponentBits, fractionBits, eMin, eMax, littleEndian) {
      var totalBits = (signBits + exponentBits + fractionBits);

      var binary = "";
      for (var i = 0, l = bytes.length; i < l; i++) {
        var bits = bytes[i].toString(2);
        while (bits.length < 8) 
          bits = "0" + bits;

        if (littleEndian)
          binary = bits + binary;
        else
          binary += bits;
      }

      var sign = (binary.charAt(0) == '1')?-1:1;
      var exponent = parseInt(binary.substr(signBits, exponentBits), 2) - eMax;
      var significandBase = binary.substr(signBits + exponentBits, fractionBits);
      var significandBin = '1'+significandBase;
      var i = 0;
      var val = 1;
      var significand = 0;

      if (exponent == -eMax) {
          if (significandBase.indexOf('1') == -1)
              return 0;
          else {
              exponent = eMin;
              significandBin = '0'+significandBase;
          }
      }

      while (i < significandBin.length) {
          significand += val * parseInt(significandBin.charAt(i));
          val = val / 2;
          i++;
      }

      return sign * significand * Math.pow(2, exponent);
    }
  );

  $.Method({Static:false, Public:true }, "Dispose", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Dispose () {
      this.m_stream = null;
    }
  );

  $.Method({Static:false, Public:true }, "get_BaseStream", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.Stream"), [], [])), 
    function get_BaseStream () {
      return this.m_stream;
    }
  );

});

JSIL.ImplementExternals("System.IO.StreamReader", function ($) {

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function _ctor (path) {
      this.stream = new System.IO.FileStream(path, System.IO.FileMode.Open);
    }
  );

  $.Method({Static:false, Public:false}, "Dispose", 
    (new JSIL.MethodSignature(null, [$.Boolean], [])), 
    function Dispose (disposing) {
      this.stream = null;
    }
  );

  $.Method({Static:false, Public:true }, "ReadLine", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function ReadLine () {
      var line = [];

      while (true) {
        var ch = this.stream.ReadByte();
        if (ch === -1) {
          if (line.length === 0)
            return null;
          else
            break;
        } else if (ch === 13) {
          var next = this.stream.$PeekByte();
          if (next === 10)
            continue;
          else if (next === -1) {
            if (line.length === 0)
              return null;
            else
              break;
          } else
            break;
        } else if (ch === 10) {
          break;
        }

        line.push(ch);
      };

      return JSIL.StringFromByteArray(line);
    }
  );
});

JSIL.ImplementExternals("System.IO.TextReader", function ($) {
  $.Method({Static:false, Public:true }, "Dispose", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Dispose () {
    }
  );

  $.Method({Static:false, Public:false}, "Dispose", 
    (new JSIL.MethodSignature(null, [$.Boolean], [])), 
    function Dispose (disposing) {
    }
  );
});


JSIL.ImplementExternals("System.IO.FileSystemInfo", function ($) {
  $.RawMethod(false, "$fromNodeAndPath", function (node, path) {
    this._node = node;

    if (node)
      this._path = node.path;
    else
      this._path = path;
  });

  $.Method({Static:false, Public:false}, ".ctor", 
    (new JSIL.MethodSignature(null, [], [])), 
    function _ctor () {
      this._node = null;
      this._path = null;
    }
  );

  $.Method({Static:false, Public:true }, "get_Exists", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function get_Exists () {
      return (this._node !== null);
    }
  );

  $.Method({Static:false, Public:true }, "get_Extension", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_Extension () {
      return System.IO.Path.GetExtension(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "get_FullName", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_FullName () {
      return this._path;
    }
  );

  $.Method({Static:false, Public:true }, "get_Name", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_Name () {
      return System.IO.Path.GetFileName(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "Refresh", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Refresh () {
      // FIXME: Does this need to do anything?
    }
  );
});

JSIL.ImplementExternals("System.IO.DirectoryInfo", function ($) {

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function _ctor (path) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot)
        this.$fromNodeAndPath(storageRoot.resolvePath(path, false), storageRoot.normalizePath(path));
      else
        this.$fromNodeAndPath(null, path);
    }
  );

  $.Method({Static:false, Public:true }, "Create", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Create () {
      System.IO.Directory.CreateDirectory(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "Create", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Security.AccessControl.DirectorySecurity")], [])), 
    function Create (directorySecurity) {
      // FIXME: directorySecurity
      System.IO.Directory.CreateDirectory(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [], [])), 
    function EnumerateDirectories () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [$.String], [])), 
    function EnumerateDirectories (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function EnumerateDirectories (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileInfo")]), [], [])), 
    function EnumerateFiles () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileInfo")]), [$.String], [])), 
    function EnumerateFiles (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function EnumerateFiles (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [], [])), 
    function EnumerateFileSystemInfos () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [$.String], [])), 
    function EnumerateFileSystemInfos (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "EnumerateFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function EnumerateFileSystemInfos (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.InheritBaseMethod("get_Exists");
  $.InheritBaseMethod("get_Name");

  $.Method({Static:false, Public:true }, "get_Parent", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.DirectoryInfo"), [], [])), 
    function get_Parent () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_Root", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.DirectoryInfo"), [], [])), 
    function get_Root () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetAccessControl", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Security.AccessControl.DirectorySecurity"), [], [])), 
    function GetAccessControl () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetAccessControl", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Security.AccessControl.DirectorySecurity"), [$jsilcore.TypeRef("System.Security.AccessControl.AccessControlSections")], [])), 
    function GetAccessControl (includeSections) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [], [])), 
    function GetDirectories () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [$.String], [])), 
    function GetDirectories (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.DirectoryInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function GetDirectories (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:true , Public:false}, "GetDirName", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetDirName (fullPath) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:true , Public:false}, "GetDisplayName", 
    (new JSIL.MethodSignature($.String, [$.String, $.String], [])), 
    function GetDisplayName (originalPath, fullPath) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileInfo")]), [$.String], [])), 
    function GetFiles (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function GetFiles (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileInfo")]), [], [])), 
    function GetFiles () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [$.String], [])), 
    function GetFileSystemInfos (searchPattern) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [$.String, $jsilcore.TypeRef("System.IO.SearchOption")], [])), 
    function GetFileSystemInfos (searchPattern, searchOption) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetFileSystemInfos", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.IO.FileSystemInfo")]), [], [])), 
    function GetFileSystemInfos () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "MoveTo", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function MoveTo (destDirName) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "SetAccessControl", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Security.AccessControl.DirectorySecurity")], [])), 
    function SetAccessControl (directorySecurity) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "toString", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function toString () {
      return "<DirectoryInfo " + this._path + ">";
    }
  );

});

JSIL.ImplementExternals("System.IO.FileInfo", function ($) {

  $.Method({Static:false, Public:true }, ".ctor", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function _ctor (fileName) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot)
        this.$fromNodeAndPath(storageRoot.resolvePath(fileName, false), storageRoot.normalizePath(fileName));
      else
        this.$fromNodeAndPath(null, fileName);
    }
  );

  $.Method({Static:false, Public:true }, "AppendText", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.StreamWriter"), [], [])), 
    function AppendText () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "CopyTo", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileInfo"), [$.String], [])), 
    function CopyTo (destFileName) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "CopyTo", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileInfo"), [$.String, $.Boolean], [])), 
    function CopyTo (destFileName, overwrite) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Create", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [], [])), 
    function Create () {
      return System.IO.File.Create(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "CreateText", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.StreamWriter"), [], [])), 
    function CreateText () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Decrypt", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Decrypt () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Delete", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Delete () {
      System.IO.File.Delete(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "Encrypt", 
    (new JSIL.MethodSignature(null, [], [])), 
    function Encrypt () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_Directory", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.DirectoryInfo"), [], [])), 
    function get_Directory () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_DirectoryName", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_DirectoryName () {
      throw new Error('Not implemented');
    }
  );

  $.InheritBaseMethod("get_Exists");

  $.Method({Static:false, Public:true }, "get_IsReadOnly", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function get_IsReadOnly () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_Length", 
    (new JSIL.MethodSignature($.Int64, [], [])), 
    function get_Length () {
      throw new Error('Not implemented');
    }
  );

  $.InheritBaseMethod("get_Name");

  $.Method({Static:false, Public:true }, "GetAccessControl", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Security.AccessControl.FileSecurity"), [], [])), 
    function GetAccessControl () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "GetAccessControl", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Security.AccessControl.FileSecurity"), [$jsilcore.TypeRef("System.Security.AccessControl.AccessControlSections")], [])), 
    function GetAccessControl (includeSections) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:false}, "GetDisplayPath", 
    (new JSIL.MethodSignature($.String, [$.String], [])), 
    function GetDisplayPath (originalPath) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "MoveTo", 
    (new JSIL.MethodSignature(null, [$.String], [])), 
    function MoveTo (destFileName) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Open", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$jsilcore.TypeRef("System.IO.FileMode")], [])), 
    function Open (mode) {
      return System.IO.File.Open(this._path, mode);
    }
  );

  $.Method({Static:false, Public:true }, "Open", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [$jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess")], [])), 
    function Open (mode, access) {
      // FIXME: access
      return System.IO.File.Open(this._path, mode);
    }
  );

  $.Method({Static:false, Public:true }, "Open", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [
          $jsilcore.TypeRef("System.IO.FileMode"), $jsilcore.TypeRef("System.IO.FileAccess"), 
          $jsilcore.TypeRef("System.IO.FileShare")
        ], [])), 
    function Open (mode, access, share) {
      // FIXME: access, share
      return System.IO.File.Open(this._path, mode);
    }
  );

  $.Method({Static:false, Public:true }, "OpenRead", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [], [])), 
    function OpenRead () {
      return System.IO.File.OpenRead(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "OpenText", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.StreamReader"), [], [])), 
    function OpenText () {
      return System.IO.File.OpenText(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "OpenWrite", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileStream"), [], [])), 
    function OpenWrite () {
      return System.IO.File.OpenWrite(this._path);
    }
  );

  $.Method({Static:false, Public:true }, "Replace", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileInfo"), [$.String, $.String], [])), 
    function Replace (destinationFileName, destinationBackupFileName) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "Replace", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.FileInfo"), [
          $.String, $.String, 
          $.Boolean
        ], [])), 
    function Replace (destinationFileName, destinationBackupFileName, ignoreMetadataErrors) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "set_IsReadOnly", 
    (new JSIL.MethodSignature(null, [$.Boolean], [])), 
    function set_IsReadOnly (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "SetAccessControl", 
    (new JSIL.MethodSignature(null, [$jsilcore.TypeRef("System.Security.AccessControl.FileSecurity")], [])), 
    function SetAccessControl (fileSecurity) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "toString", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function toString () {
      return "<FileInfo " + this._path + ">";
    }
  );

});

JSIL.ImplementExternals("System.IO.Directory", function ($) {
  $.Method({Static:true , Public:true }, "Exists", 
    new JSIL.MethodSignature($.Boolean, [$.String], []),
    function (filename) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var resolved = storageRoot.resolvePath(filename, false);
        return (resolved && resolved.type !== "file");
      }

      return false;
    }
  );

  $.Method({Static:true , Public:true }, "CreateDirectory", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.DirectoryInfo"), [$.String], [])), 
    function CreateDirectory (path) {
      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var node = storageRoot.createDirectory(path);
        var tInfo = $jsilcore.System.IO.DirectoryInfo.__Type__;

        var result = JSIL.CreateInstanceOfType(tInfo, "$fromNodeAndPath", [node, path]);
        return result;
      } else {
        throw new Error('Storage root not available');
      }
    }
  );

  $.Method({Static:true , Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [$.String], [])), 
    function GetDirectories (path) {
      return System.IO.Directory.GetDirectories(path, "*", null);
    }
  );

  $.Method({Static:true , Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [$.String, $.String], [])), 
    function GetDirectories (path, searchPattern) {
      return System.IO.Directory.GetDirectories(path, searchPattern, null);
    }
  );

  $.Method({Static:true , Public:true }, "GetDirectories", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [
          $.String, $.String, 
          $jsilcore.TypeRef("System.IO.SearchOption")
        ], [])), 
    function GetDirectories (path, searchPattern, searchOption) {
      // FIXME: searchOption
      if (Number(searchOption))
        throw new Error("Recursive search not implemented");

      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var searchPath = storageRoot.resolvePath(path, true);

        return searchPath.enumerate("directory", searchPattern).map(function (node) { return node.path; });
      } else {
        throw new Error('Storage root not available');
      }
    }
  );

  $.Method({Static:true , Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [$.String], [])), 
    function GetFiles (path) {
      return System.IO.Directory.GetFiles(path, "*", null);
    }
  );

  $.Method({Static:true , Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [$.String, $.String], [])), 
    function GetFiles (path, searchPattern) {
      return System.IO.Directory.GetFiles(path, searchPattern, null);
    }
  );

  $.Method({Static:true , Public:true }, "GetFiles", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.String]), [
          $.String, $.String, 
          $jsilcore.TypeRef("System.IO.SearchOption")
        ], [])), 
    function GetFiles (path, searchPattern, searchOption) {
      // FIXME: searchOption
      if (Number(searchOption))
        throw new Error("Recursive search not implemented");

      var storageRoot = JSIL.Host.getStorageRoot();

      if (storageRoot) {
        var searchPath = storageRoot.resolvePath(path, true);

        return searchPath.enumerate("file", searchPattern).map(function (node) { return node.path; });
      } else {
        throw new Error('Storage root not available');
      }
    }
  );

});
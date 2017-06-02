# mongoose-socket.io
[![Build Status](https://travis-ci.org/crsten/mongoose-socket.io.svg?branch=master&style=flat-square)](https://travis-ci.org/crsten/mongoose-socket.io)
[![npm](https://img.shields.io/npm/dt/mongoose-socket.io.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-socket.io)
[![npm](https://img.shields.io/npm/v/mongoose-socket.io.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-socket.io)

[Mongoose](http://mongoosejs.com/) plugin to automatically emit needed events via [Socket.io](https://socket.io/).

Build live applications in few minutes. You can thank me later ;) ...

This modules lets you attach socket.io directly to your models and emit event at any mongoose hook you want in an extremly flexible way.

## Installation

`npm install --save mongoose-socket.io`

## Usage

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseSocketIo = require('mongoose-socket.io');

let UserSchema = new Schema({
  name: String,
  email: String,
  something: Array
});

UserSchema.plugin(mongoooseSocketIo, {
  io, // Socketio instance
  prefix: 'user',
  namespace: function(doc){
    return ['test1','test2']
  },
  room: ['room1', 'room2'],
  events: {
    create: {
      select: 'email skills',
      populate: {
        path: 'skills',
        select: 'name'
      },
      map: function(data) {
        //Do some last mapping/modification
        data.provider = data.email.split('@').pop();
        return data;
      }
    },
    update: {
      populate: 'skills'
    },
    remove: false
  },
  partials: [
    {
      eventName: 'custom_event',
      triggers: 'name',
      select: 'name email',
      populate: 'something' //if it is a reference...
    }
  ],
  debug: false
})
```

## Options

### io

This is the result of the socket.io initialization

### prefix

Prefixes all event names that are being emitted from this model. *(Example for creation event: 'PREFIX:create')*
You can pass the following types:

| Type | Guide |
| ---- | ----- |
| String | Pass a string to emit to a single & fixed namespace |
| Function | Pass a function that will be resolved right before emitting. Accepts string as return and handles the returned values as explained earlier in this table. The first parameter of the function contains the currently new/modified/removed item, so you could use some company id or anything in the document as eventname |

### namespace

Define what namespace you want to emit the event on. This option is **very powerful**
You can pass the following types:

| Type | Guide |
| ---- | ----- |
| String | Pass a string to emit to a single & fixed namespace |
| Array | Pass an array to emit to every namespace contained in the array.  **The array accepts strings and functions** |
| Function | Pass a function that will be resolved right before emitting. Accepts string or array as return and handles the returned values as explained earlier in this table. The first parameter of the function contains the currently new/modified/removed item, so you could use some company id or anything in the document as namespace |

### room

Define what room you want to emit the event on. This option is **very powerful**
You can pass the following types:

| Type | Guide |
| ---- | ----- |
| String | Pass a string to emit to a single & fixed room |
| Array | Pass an array to emit to every room contained in the array.  **The array accepts strings and functions** |
| Function | Pass a function that will be resolved right before emitting. Accepts string or array as return and handles the returned values as explained earlier in this table. The first parameter of the function contains the currently new/modified/removed item, so you could use some company id or anything in the document as room |

### events

Define what events you want to emit. The following events are available:

- create
- update
- remove

#### Enabling / Disabling events

```js
events: {
  create: false || true
}
```

#### Advanced configuration

This configuration uses the same syntax as mongoose. Actually it uses mongoose functionallity to make it possible. So you can include exclude single & multiple fields

```js
events: {
  create: {
    select: 'name email',
    populate: 'something'
  }
}
```

```js
events: {
  create: {
    select: 'name email',
    populate: {
      path: 'something',
      select: 'example'
    },
    map: function(data) {
      //Do some last mapping/modification
      data.provider = data.email.split('@').pop();
      return data;
    }
  }
}
```

Each event does also support a map function which gives you the ability to modify your data one last time before sending.
This could be used to merge/delete/add values.

### partials

Partials gives you the power to create custom events with custom triggers and custom data. Very flexible...
The settings do also use mongoose built in functionality. So be sure to checkout mongoose documentation.
You have the `map` function here as well.

```js
partials: [
  {
    eventName: 'custom_eventname',
    triggers: 'name email',
    select: 'email',
    populate: 'something'
  }
]
```

```js
partials: [
  {
    eventName: 'custom_eventname',
    triggers: 'something',
    select: 'something name',
    populate: {
      path: 'something',
      select: 'random'
    }
  }
]
```

### debug

Set this to true if you want to output info about all emitted events.

## Development & Testing

`npm run dev` starts a server at [localhost:3000](http://localhost:3000).

## License

[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) Carsten Jacobsen

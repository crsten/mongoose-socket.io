const Intersect = require('intersect');
const Resolvers = {
  Namespace: require('./utils/namespace'),
  Room: require('./utils/room'),
  Prefix: require('./utils/prefix')
};

const Emitter = require('./emitter');
const Fetcher = require('./utils/fetcher');

const defaultOptions = {
  io: null,
  prefix: null,
  namespace: null,
  room: null,
  events: {
    create: true,
    update: true,
    remove: true
  },
  partials: null,
  debug: false
}

module.exports = exports = function MongooseSocketIoPlugin(schema, options) {
  options = Object.assign({}, defaultOptions, options);
  const io = options.io;

  schema.pre('save', function(next) {
    this.wasNew = this.isNew

    if(options.partials) {
      let modifiedPartials = new Set();

      options.partials.forEach(partial => {
        partial.triggers.split(' ').forEach(key => {
          if(this.isModified(key)) modifiedPartials.add(key);
        });
      })

      if(modifiedPartials.size) this.modifiedPartials = [...modifiedPartials];
    }

    next();
  });

  schema.post('save', function() {
    if((this.wasNew && !options.events.create) || (!this.wasNew && !options.events.update && !this.modifiedPartials)) return;

    let Namespace = Resolvers.Namespace(this, options);
    let Room = Resolvers.Room(this, options);
    let Prefix = Resolvers.Prefix(this, options);


    if(this.wasNew && options.events.create) {
      let EventName = (Prefix) ? `${Prefix}:create` : 'create' ;

      Fetcher(this, {
        select: options.events.create.select,
        populate: options.events.create.populate
      })
      .then(res => {
        let data = (options.events.create.map) ? options.events.create.map(res) : res ;

        Namespace.forEach(namespace => {
          Room.forEach(room => {
            Emitter(data, {
              namespace,
              room,
              eventName: EventName,
              debug: options.debug
            }, io);
          });
        })
      })
      .catch(err => console.error('[ERROR] -> Mongoose-socket.io -> ', err))
    }

    if(!this.wasNew && options.events.update) {
      let EventName = (Prefix) ? `${Prefix}:update` : 'update' ;

      Fetcher(this, {
        select: options.events.update.select,
        populate: options.events.update.populate
      })
      .then(res => {
        let data = (options.events.update.map) ? options.events.update.map(res) : res ;

        Namespace.forEach(namespace => {
          Room.forEach(room => {
            Emitter(data, {
              namespace,
              room,
              eventName: EventName,
              debug: options.debug
            }, io);
          });
        })
      })
      .catch(err => console.error('[ERROR] -> Mongoose-socket.io -> ', err))
    }

    if(this.modifiedPartials) {
      options.partials
        .filter(partial => Intersect(partial.triggers.split(' '), this.modifiedPartials).length)
        .forEach(partial => {
          if(!partial.eventName) return console.warning(`EventName is not spesified`);
          let EventName = (Prefix) ? `${Prefix}:partial:${partial.eventName}` : `partial:${partial.eventName}` ;

          Fetcher(this, {
            select: partial.select,
            populate: partial.populate
          })
          .then(res => {
            let data = (partial.map) ? partial.map(res) : res ;
            
            Namespace.forEach(namespace => {
              Room.forEach(room => {
                Emitter(data, {
                  namespace,
                  room,
                  eventName: EventName,
                  debug: options.debug
                }, io);
              });
            })
          })
          .catch(err => console.error('[ERROR] -> Mongoose-socket.io -> ', err))
        })
    }

  });

  schema.post('remove', function() {
    if(options.events.remove) {
      let Namespace = Resolvers.Namespace(this, options);
      let Room = Resolvers.Room(this, options);
      let Prefix = Resolvers.Prefix(this, options);
      let EventName = (Prefix) ? `${Prefix}:remove` : 'remove' ;


      Namespace.forEach(namespace => {
        Room.forEach(room => {
          Emitter({ _id: this._id}, {
            namespace,
            room,
            eventName: EventName,
            debug: options.debug
          }, io);
        });
      });
    }
  });

}

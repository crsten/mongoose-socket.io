const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MSIO = require('./../../src');

module.exports = function(io) {

  const userSchema = new Schema({
    name: String,
    email: String,
    skills: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }]
  });

  const skillSchema = new Schema({
    name: String,
    usefull: Boolean
  });

  userSchema.plugin(MSIO, {
    io,
    prefix: 'user',
    namespace: doc => doc._id,
    room: ['room1', 'room2'],
    events: {
      create: {
        select: 'email skills',
        populate: {
          path: 'skills',
          select: 'name'
        }
      },
      update: {
        populate: 'skills'
      },
      remove: true
    },
    partials: [
      {
        eventName: 'x',
        triggers: 'name',
        select: 'name email skills',
        populate: 'skills'
      },
      {
        eventName: 'skills',
        triggers: 'skills',
        select: 'skills.usefull'
      }
    ],
    debug: true
  });

  return {
    User: mongoose.model('User', userSchema),
    Skill: mongoose.model('Skill', skillSchema)
  }
}

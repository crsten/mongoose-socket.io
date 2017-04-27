module.exports = function(doc, modifiers) {
    let query = doc.constructor.findOne()
      .lean()
      .where('_id').equals(doc._id);

    if(modifiers.select) query.select(modifiers.select);
    if(modifiers.populate) query.populate(modifiers.populate);

    return query.exec()
}

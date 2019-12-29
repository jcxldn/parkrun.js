const options = {
  stripUnknown: true,
  abortEarly: false
};

/**
 * @param data Data to validate against
 * @param {Joi} schema schema to use
 */
module.exports = (data, schema) => {
  return schema.validate(data, options);
};

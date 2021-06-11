/**
 * By clavatar
 * @param {Object} payload response payload
 */
class GenericResponse {
  constructor(payload, metadatas) {
    this.success = true;
    this.metadatas = { ...metadatas, apiVersion: "1.0.0" };
    this.payload = payload;
  }
}

module.exports = GenericResponse;

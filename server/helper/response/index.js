/**
 *
 * @description Method to send response in a generic format.
 * @param {*} res Express Response object
 * @param {number} status '200' || '400'
 * @param {string} message Message to user
 * @param {object} error (optional) Error object
 * @param {object} payload (optional) Payload data to return with the response
 * @returns {object} Json response
 */

const response = (res, code, message, payload) => {
  res.status(code).json({
    status: code,
    message,
    data: payload,
  });
};

export default response;

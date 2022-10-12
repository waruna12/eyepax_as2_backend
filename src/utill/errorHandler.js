module.exports.validationError = async function (e, res) {
  let errors = {};
  const allErrors = e.message.substring(e.message.indexOf(":") + 1).trim();
  const allErrorsInArrayFormat = allErrors.split(",").map((err) => err.trim());
  allErrorsInArrayFormat.forEach((error) => {
    const [key, value] = error.split(":").map((err) => err.trim());
    errors[key] = value;
  });

  return res.status(500).send({
    success: false,
    message: "Validation failed",
    case: "VALIDATION_ERROR",
    error: errors,
  });
};

module.exports.validatuionAllError = async function (res, e) {
  const STATUS_CODE = e.statusCode || 500;
  const MESSAGE = e.message || "Validation failed";
  const CASE = e.message || "VALIDATION_ERROR";

  return res.status(STATUS_CODE).send({
    success: false,
    message: MESSAGE,
    case: CASE,
    error: e,
  });
};

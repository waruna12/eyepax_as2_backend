module.exports.validationError = async function (e) {
  let errors = {};

  const allErrors = e.message.substring(e.message.indexOf(":") + 1).trim();
  const allErrorsInArrayFormat = allErrors.split(",").map((err) => err.trim());
  allErrorsInArrayFormat.forEach((error) => {
    const [key, value] = error.split(":").map((err) => err.trim());
    errors[key] = value;
  });

  return errors;
};

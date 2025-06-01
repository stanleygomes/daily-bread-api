export async function validateRequest(req, validateID = false) {
  if (req.method !== 'GET') {
    return {
      status: 405,
      message: 'Method not allowed!',
    };
  }

  const { email } = req.query;

  if (validateID && !email) {
    return {
      status: 400,
      message: 'E-mail is required!',
    };
  }

  return {
    status: 200,
    message: 'Request is valid!',
  };
}

export async function validateRequest(req, validateID = false) {
  if (req.method !== 'GET') {
    return {
      status: 405,
      message: 'Method not allowed!',
    };
  }

  return {
    status: 200,
    message: 'Request is valid!',
  };
}

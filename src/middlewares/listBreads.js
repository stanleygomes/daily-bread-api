export async function validateRequest(req, validateID = false) {
  if (req.method !== 'GET') {
    return {
      status: 405,
      message: 'Method not allowed!',
    };
  }

  const { id } = req.query;

  if (validateID && !id) {
    return {
      status: 400,
      message: 'ID is required!',
    };
  }

  return {
    status: 200,
    message: 'Secret is valid!',
  };
}

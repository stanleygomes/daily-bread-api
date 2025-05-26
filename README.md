# daily-bread

Daily Bread - A mensagem diária direto no e-mail

![image](https://github.com/user-attachments/assets/15e0692f-b56d-461b-bf53-70f75098381a)

This project is a Node.js backend application designed to be hosted on Vercel Functions. It provides an endpoint that triggers a request to the AiMlApi.com, retrieves text based on a specified prompt, and sends that text via email to a designated address.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd daily-bread
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Environment Variables**
   Set up the necessary environment variables for the Hugging Face API and email service. You can create a `.env` file in the root directory with the following variables, following the `.env.template` file.

4. **Run the Application Locally**
   You can test the API locally using Vercel CLI:
   ```bash
   vercel dev
   ```

## Usage

To use the API, send a GET request to the `/api/sendBread` endpoint with a Query String containing a secret. The value is inside the `.env` file. Example:
```
/api/sendBread?secret=e48944d2-28b3-4ef8-b13f-4b367644688d
```

## Deployment

This project is set up for deployment on Vercel. Changes pushed to the main branch will automatically trigger the deployment process defined in the `.github/workflows/deploy-vercel.yml` file.

## Acknowledgments

- **AiMlApi.com API**: For providing powerful GPT Text models.
- **Resend API**: For sending emails easily from Node.js applications.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

const axios = require("axios");

const sendEmail = async (data) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": process.env.BREVO_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("BREVO ERROR:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendEmail;

console.log("BREVO KEY LENGTH:", process.env.BREVO_KEY?.length);
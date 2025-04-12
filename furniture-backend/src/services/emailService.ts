const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

// Initialize the SNS client with proper credentials
const snsClient = new SNSClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to send OTP via SMS
export const sendOTP = async (phone: string, otp: string) => {
    try {
        // Format phone number to E.164 format
        let formattedPhone = phone.replace(/\D/g, "");

        // If number starts with 09, replace with +959
        if (formattedPhone.startsWith("09")) {
            formattedPhone = "+959" + formattedPhone.substring(2);
        }
        // If number doesn't start with +, add +95
        else if (!formattedPhone.startsWith("+")) {
            formattedPhone = "+95" + formattedPhone;
        }

        console.log("Formatted phone number:", formattedPhone);

        // Compose the message
        const message = `Your OTP is: ${otp}. Please do not share it with anyone.`;

        // Send the OTP via SNS
        const params = {
            PhoneNumber: formattedPhone,
            Message: message,
            MessageAttributes: {
                "AWS.SNS.SMS.SenderID": {
                    DataType: "String",
                    StringValue: "FURNITURE",
                },
            },
        };

        console.log("Sending SMS with params:", {
            ...params,
            credentials: "***", // Hide sensitive data
        });

        const data = await snsClient.send(new PublishCommand(params));
        console.log("OTP sent successfully. MessageId:", data.MessageId);

        return otp;
    } catch (error) {
        console.error("Error sending OTP:", error);
        if (error instanceof Error) {
            console.error("Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        }
        throw error;
    }
};

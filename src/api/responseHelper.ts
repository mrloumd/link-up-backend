import { Response } from "express";

// Define the types for the parameters in your functions
type StatusCode = number;
type Message = string;
type Errors = string[];
type Data = Record<string, any> | null;

// Define the types for your response and dataResponse functions
const dataResponse = (
  statusCode: StatusCode,
  message: Message = "",
  errors: Errors = [],
  data: Data = null
) => {
  // Create a new object to avoid spreading null
  const responseData = {
    statusCode,
    message,
    errors,
  };

  // Spread data only if it's not null
  if (data !== null) {
    Object.assign(responseData, data);
  }

  return responseData;
};

const response = (
  res: Response,
  statusCode: StatusCode,
  message: Message,
  errors: Errors,
  data: Data
) => {
  const responseData = dataResponse(statusCode, message, errors, data);
  res.status(statusCode).json(responseData);
};

export { response };

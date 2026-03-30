import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ContactMessage } from "../models/contactMessage.model.js";

// Submit a contact message (public — no auth required)
const submitContactMessage = AsyncHandler(async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required.");
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    service,
    message,
  });

  if (!contactMessage) {
    throw new ApiError(500, "Failed to save contact message.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, contactMessage, "Message sent successfully."));
});

// Get all contact messages (admin only)
const getAllContactMessages = AsyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can view contact messages.");
  }

  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages, "Contact messages fetched successfully."),
    );
});

// Delete a contact message (admin only)
const deleteContactMessage = AsyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can delete contact messages.");
  }

  const { messageId } = req.params;
  if (!messageId) {
    throw new ApiError(400, "Message ID is required.");
  }

  const deleted = await ContactMessage.findByIdAndDelete(messageId);
  if (!deleted) {
    throw new ApiError(404, "Message not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Message deleted successfully."));
});

export { submitContactMessage, getAllContactMessages, deleteContactMessage };

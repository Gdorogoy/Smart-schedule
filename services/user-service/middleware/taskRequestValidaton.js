export const validateTaskReq = async (req, res, next) => {
  const { title, description, importance, status } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ status: "bad", error: "Title is required" });
  }

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ status: "bad", error: "Description is required" });
  }

  if (importance === undefined || importance === null) {
    return res.status(400).json({ status: "bad", error: "Importance is required" });
  }

  if (typeof importance !== "number" || importance < 1 || importance > 10) {
    return res.status(400).json({ status: "bad", error: "Importance must be a number between 1 and 10" });
  }

  const validStatuses = ["pending", "in-progress", "completed"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      status: "bad",
      error: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

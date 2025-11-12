export const errorHandler = (err, req, res, next) => {
  console.error(`got error || ${err}`);

  if (err.isAxiosError) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;

    return res.status(status).json({
      status: "bad",
      message: "External service error",
      details,
    });
  }

  res.status(err.status || 500).json({
    status: "bad",
    message: err.message,
  });
};

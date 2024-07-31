// Create Role
export const create = (req, res) => {
  // Validate request
  if (!req.body.role_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Role
  const role = {
    role_name: req.body.role_name,
  };

  // Save Role in the database
  UserRole.create(role)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    });
};

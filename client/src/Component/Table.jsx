import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { parsePhoneNumber } from "libphonenumber-js";


const Table = () => {
  const [value, setValue] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const [phoneValidationResult, setPhoneValidationResult] = useState(null);

  // Handle change in input fields
  const handleChange = (e) => {
    const newValue = {
      ...value,
      [e.target.name]: e.target.value,
    };

    if (e.target.name === "phone") {
      // Parse and validate the phone number
      const phoneNumber = e.target.value;
      try {
        const phoneNumberObj = parsePhoneNumber(phoneNumber);
        if (phoneNumberObj.isValid()) {
          // Phone number is valid, update the state
          setPhoneValidationResult(phoneNumberObj);
        } else {
          // Phone number is invalid, clear the validation result
          setPhoneValidationResult(null);
        }
      } catch (error) {
        // Parsing error occurred, clear the validation result
        console.error("Error parsing phone number:", error);
        setPhoneValidationResult(null);
      }
    }

    setValue(newValue);
  };

// Handle submit for adding a new user
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!phoneValidationResult) {
    toast.error("Please enter a valid phone number.");
    return;
  }
  try {
    const adduser = await axios.post(
      "http://localhost:4000/api/create",
      value
    );
    const response = adduser.data;
    if (response.success) {
      toast.success(response.Message);
      fetchData();
      // Reload the page after successful addition
      window.location.reload();
    } else {
      toast.error(response.Message || "Failed to add user.");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.Message || "An error occurred. Please try again."
    );
  }
};



  const [valueUpdate, setValueUpdate] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleEditClick = (user) => {
    setValueUpdate(user);
  };

// Handle submit for updating a user
const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  // Validate phone number
  const phoneNumber = valueUpdate.phone;
  try {
    const phoneNumberObj = parsePhoneNumber(phoneNumber);
    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      toast.error("Please enter a valid phone number.");
      return;
    }
  } catch (error) {
    console.error('Error parsing phone number:', error);
    toast.error("Please enter a valid phone number.");
    return;
  }

  try {
    const updateUser = await axios.put(
      `http://localhost:4000/api/update/${valueUpdate._id}`,
      valueUpdate
    );
    const response = updateUser.data;
    if (response.success) {
      toast.success(response.Message);
      fetchData();
    } else {
      toast.error(response.Message || "Failed to update user.");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.Message || "An error occurred. Please try again."
    );
  }
};


  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (userId) => {
    setDeleteId(userId);
  };

  const handleDeleteSubmit = async () => {
    try {
      const deleteUser = await axios.delete(
        `http://localhost:4000/api/delete/${deleteId}`
      );
      const response = deleteUser.data;
      if (response.success) {
        toast.success(response.Message);
        fetchData();
      } else {
        toast.error(response.Message || "Failed to delete user.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.Message || "An error occurred. Please try again."
      );
    }
  };

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const fetchUser = await axios.get("http://localhost:4000/api/get");
      setData(fetchUser.data); // Assuming response is already an array of users
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // End Get Users

  return (
    <div className="container">
      <div className="table-wrapper">
        <div className="table-title">
          <div className="row">
            <div className="col-sm-6">
              <h2>
                Manage <b>Customers</b>
              </h2>
            </div>
            <div className="col-sm-6 text-end">
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#addCustomerModal"
              >
                <i className="material-icons">&#xE147;</i>{" "}
                <span>Add New Customer</span>
              </button>
            </div>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.user?.length > 0 ? (
              data.user?.map((elem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.name}</td>
                  <td>{elem.email}</td>
                  <td>{elem.phone}</td>
                  <td>{elem.country}</td>
                  <td>
                    <button
                      className="edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editCustomerModal"
                      onClick={() => handleEditClick(elem)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteCustomerModal"
                      onClick={() => handleDeleteClick(elem._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="addCustomerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Customer
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={value.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={value.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={value.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={value.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="editCustomerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Customer
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-3">
                  <label htmlFor="editName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editName"
                    name="name"
                    value={valueUpdate.name}
                    onChange={(e) =>
                      setValueUpdate({ ...valueUpdate, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="editEmail"
                    name="email"
                    value={valueUpdate.email}
                    onChange={(e) =>
                      setValueUpdate({ ...valueUpdate, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPhone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editPhone"
                    name="phone"
                    value={valueUpdate.phone}
                    onChange={(e) =>
                      setValueUpdate({ ...valueUpdate, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editCountry" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editCountry"
                    name="country"
                    value={valueUpdate.country}
                    onChange={(e) =>
                      setValueUpdate({
                        ...valueUpdate,
                        country: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="deleteCustomerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Delete Customer
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this customer?</p>
              <p className="text-warning">
                <small>This action cannot be undone.</small>
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteSubmit}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

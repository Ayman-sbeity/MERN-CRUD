import UserModels from "../models/User.js";

const CreateUser = async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;

    const NewUser = new UserModels({
      name,
      email,
      phone,
      country,
    });

    await NewUser.save();
    res
      .status(200)
      .json({ success: true, Message: "User Created Successfully", NewUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, Message: "Internal Server Error", error });
  }
};

// read api
const GetUser = async (req, res) => {
  try {
    const user = await UserModels.find();
    if (!user) {
      return res.status(404).json({ success: false, Message: "No User Found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, Message: "Internal Server Error" });
  }
};

//update user
const UpdateUser = async (req, res) => {
  try {
   const UserId = req.params.id;
    const user = await UserModels.findByIdAndUpdate(UserId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, Message: "No User Found" });
    }
    res
      .status(200)
      .json({
        success: true,
        Message: "User updated successfully",
        UpdateUser,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, Message: "Internal server error" });
  }
};

// delete User

const DeleteUser = async (req,res) =>{
    try {
        const UserId = req.params.id
        const deleteUser = await UserModels.findByIdAndDelete(UserId)
        if(!deleteUser){
            return res.status(404).json({success:false,Message:"No User Found" })
        }

        res
        .status(200)
        .json({
          success: true,
          Message: "User deleted successfully",
          deleteUser,
        });

    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, Message: "Internal server error" });
    }
}

export { CreateUser, GetUser, UpdateUser,DeleteUser };

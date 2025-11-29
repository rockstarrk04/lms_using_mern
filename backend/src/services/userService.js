import User from "../models/User.js";

export const findUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const users = await User.find({ role: { $ne: "admin" } })
    .skip(skip)
    .limit(limit)
    .select("-password");
  const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

  return {
    users,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
  };
};

export const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateUserBlockStatus = async (user, blockStatus) => {
  user.isBlocked = blockStatus;
  await user.save();
  return user.toObject(); // Return a plain object without the password field
};

export const findAllInstructors = async () => {
  return await User.find({ role: "instructor" }).select("-password");
};

import mongoose from "mongoose";

export default async () => {
  return mongoose.connect("mongodb+srv://riddhishwar:1zvMeT7PF5wZZDh7@zomato-master.joubs.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
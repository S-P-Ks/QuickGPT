import bcrypt from "bcrypt"
import mongoose, { Document, type HydratedDocument, type InferSchemaType } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, unique: true
    },
    password: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 20
    }
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

export type UserType = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<UserType>;

const User = mongoose.model("User", UserSchema);
export default User;
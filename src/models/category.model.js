import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema ({
    name : {
        type : String,
        required : [true, "category name is required"],
        unique: true,
        trim : true,
        lowerCase : true
    },
    description : {
        type : String,
        trim : true,
        default : "",
    },
},
    {timestamps : true }
)


export const Category = mongoose.model("Category", categorySchema)
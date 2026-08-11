import mongoose , {Schema} from "mongoose";

const productSchema = new Schema(
    {
        name : {
            type: String,
            required : [true, "product name is required"],
            trim : true,
        },

        description : {
            type : String,
            trim : "true",
            default : ""
        },

        price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than zero"],
    },

    stock : {
        type : Number,
        required : [true, "stock quantity is required"],
        min : [0,"stock cannot be negative !"],
        default : 0
    },

    categoryId : {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    },
    { timestamps : true}
)

export const Product = mongoose.model("Product", productSchema);
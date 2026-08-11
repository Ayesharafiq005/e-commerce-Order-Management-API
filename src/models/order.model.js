import mongoose, {Schema} from "mongoose";

const orderItemSchema = new Schema (
    {
        product : {
            type: Schema.Types.ObjectId,
            ref : "Product",
            required : true
        },
        quantity : {
            type: Number,
            required : true,
            min : [1, "Quantity must be atleast 1"]
        },
        priceAtPurchase : {
            type : Number,
            required : true,

        }
    }
);

const orderSchema = new Schema({
    customer : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true ,
    },
    items : [orderItemSchema],

    totalAmount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum: ["PENDING", "PAID", "SHIPPED", "CANCELLED"],
        default : "PENDING"
    }
},
{timestamps : true}
)


export const Order = mongoose.model("Order", orderSchema)
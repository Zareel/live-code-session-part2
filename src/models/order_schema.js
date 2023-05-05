import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    product:{
        type:[
       {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        price: Number,
       }
        ],
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    coupon:{
        type: String,
        TransactionId: String,
        status:{
            type: String,
            enum:["OREDERED", "SHIPPED", "DELIVERED","CANCELLED"],
            default: "Ordered", 
        }

    }

}, {timestamps: true})

export default mongoose.model("Order", orderSchema)
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { intersect } = require('mathjs');

// Document structure (Usually known as schema but MongoDB doesnt have a set schema)
const statsSchema = new mongoose.Schema({

    totalBets: {
        type: Number
    },
    winCount: {
        type: Number
    },
    lossCount: {
        type: Number
    },
    pushCount: {
        type: Number
    },
    pendingCount: {
        type: Number
    },
    averageOdds: {
        type: Number
    },
    amountBet: {
        type: Number
    },
    profitLoss: {
        type: String
    },
    ROI: {
        type: String
    }
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    stakeLimit: {
        type: Number,
    },
    stats:
    {
        overall: {
            all: {
                type: statsSchema
            }
        },
        sports: {
            NFL: {
                type: statsSchema
            },
            NBA: {
                type: statsSchema
            },
            NHL: {
                type: statsSchema
            }
        },
        betTypes: {
            moneyline: {
                type: statsSchema
            },
            spread: {
                type: statsSchema
            },
            parlay: {
                type: statsSchema
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

// Hash the password before putting it into the database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcryptjs.hashSync(this.password, 10); // Use salt length of 10
    }
    next();
})

// Generate tokens to verify a user
userSchema.methods.generateToken = async function () {
    try {
        let genToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: genToken });
        await this.save();
        return genToken;
    } catch (error) {
        console.log(error)
    }
}

// Create the model
const Users = new mongoose.model("USER", userSchema);

module.exports = Users;
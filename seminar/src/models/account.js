const mongoose = require('mongoose');


const OSchemaDefinition = {
    total: Number
};
const OSchemaOptions = {};
const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);
const AccountModel = mongoose.model('account', schema);


module.exports = AccountModel;
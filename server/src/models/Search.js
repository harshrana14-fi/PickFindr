const { Schema, model, Types } = require('mongoose');

const SearchSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
		term: { type: String, index: true, required: true },
		timestamp: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: true }
);

SearchSchema.index({ userId: 1, timestamp: -1 });

module.exports = model('Search', SearchSchema);



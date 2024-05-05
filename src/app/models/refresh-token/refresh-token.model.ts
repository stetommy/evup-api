import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRefreshToken extends Document {
    uid: string;
    refreshToken: string;
}

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema({
    uid: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const RefreshTokenModel: Model<IRefreshToken> = mongoose.model<IRefreshToken>('RefreshTokens', RefreshTokenSchema);

export default RefreshTokenModel;

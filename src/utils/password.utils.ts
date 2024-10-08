import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { ResetTokenPayload, UserPayload } from '../dto/auth.dto';

const SECRET_KEY = process.env.SECRET_KEY;

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
};

/**
 * This function generates a salt to be used to generate passwords.
 * @returns salt string
 */
export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

/**
 * 
 * @param password new password
 * @param salt given salt number
 * @returns a password in form of a hashed password.
 */
export const GeneratePassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
};

/**
 * Generates a signature token to be used to let a user logged in or do a specific activity once logged in.
 * @param payload an object that contains some information about the logged in user.
 * @returns signature string of text (a jwt token)
 */
export const GenerateToken = async (payload: UserPayload | ResetTokenPayload) => {
    return jwt.sign(payload, SECRET_KEY as string, { expiresIn: "1d" }) // Other possible time of expiration formats are: 30m, 1h, 1d,...
};

/**
 * Validates a user signature to determind if a user sending a request is authorized.
 * It recieves the server request and returns a boolean value indicating whether the user is authorized or not.
 * @param req 
 * @returns true | false
 */
export const ValidateToken = async (req: Request) => {
    const signature = req.get('Authorization');
    if (signature) {
        const token = signature.split(' ')[1];
        
        if (token === undefined || !token || token === '') {
            return false;
        } else {
            const payload = jwt.verify(token, SECRET_KEY as string) as UserPayload;
            if (payload.accountStatus === "Inactive") {
                return false;
            }
            req.user = payload;
            return true;
        }
    }
}

interface DecodedPayload extends UserPayload{
    _id: string;
    email: string;
    verified: boolean;
    iat: number;
    exp: number;
}

export const isTokenValid = async (req: Request) => {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = jwt.verify(signature.split(' ')[1], SECRET_KEY as string) as DecodedPayload;
        req.user = payload;
        const now = Date.now() / 1000; // Convert to seconds for consistency

        if (payload.exp < now) {
            return false;
        }

        return true;
    }
}

export const ValidateAdmin = async (req: Request) => {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = jwt.verify(signature.split(' ')[1], SECRET_KEY as string) as UserPayload;
        req.user = payload;

        return true;
    }
}
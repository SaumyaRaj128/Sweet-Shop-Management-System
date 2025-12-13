import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({ username, password });

        if (user) {
            res.status(201).json({
                user: {
                    _id: user.id,
                    username: user.username,
                    role: user.role,
                },
                token: generateToken(user.id as string),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                user: {
                    _id: user.id,
                    username: user.username,
                    role: user.role,
                },
                token: generateToken(user.id as string),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        next(error);
    }
};

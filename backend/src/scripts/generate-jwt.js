import jwt from 'jsonwebtoken';

const payload = { id: '66db6bdc-ddae-429e-bc25-8a8a8115e7e7', email: 'jhonrivero21@gmail.com' };
const secret = process.env.JWT_SECRET || 'Sf9skL3Fk!!mav31E7!rPZc2KaalmW4x8';
const token = jwt.sign(payload, secret, { expiresIn: 2 * 60 * 60 });

console.log(token);

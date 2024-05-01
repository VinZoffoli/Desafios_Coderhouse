import jwt from 'jsonwebtoken'

export const generateToken = user => {
    const token = jwt.sign(user, '3W8Xr4hL7fPnCzTnU3fR2eT9kV3vP9xY', {expiresIn: '60000'})    
    return token
}
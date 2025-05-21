import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  console.log("token", process.env.SECRET_KEY)
  const token = jwt.sign({userId}, process.env.SECRET_KEY)
  return token;
}

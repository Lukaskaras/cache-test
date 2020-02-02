import generate from 'nanoid/generate'

export const generateRandomString = () => {
  return generate('1234567890abcdefghijklmnopqrstuvwxyz', 12)
}

export const handler = async (event) => {
  console.log(JSON.stringify(event))
  return {
    status: 200
  }
}
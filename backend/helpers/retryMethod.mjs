async function retryMethod(callback, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await callback();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw new Error(`All ${retries} attempts failed`);
      }
    }
  }
}

export default retryMethod;

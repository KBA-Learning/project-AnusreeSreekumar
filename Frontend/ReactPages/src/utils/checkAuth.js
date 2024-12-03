const checkAuth = async () => {

    const userToken = localStorage.getItem('Authtoken'); // Retrieve token from localStorage

    try {
        if (userToken) {
            // Send token in the Authorization header
            const response = await fetch('http://localhost:4000/protected-route', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();
            return data
        } else {
            console.log('No token found');
        }
    }
    catch (error) {
        console.error('Error in checkAuth:', error);
        throw error; // Handle errors appropriately
    }
}

export default checkAuth;

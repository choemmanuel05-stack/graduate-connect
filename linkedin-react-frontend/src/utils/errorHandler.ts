export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || error.response.data.error || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

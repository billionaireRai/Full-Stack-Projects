import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// Create an Axios instance
// It retrys the original intercepted requested...
// logouts the user in case of failed refresh attempt...
const axiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '', // For client-side
  withCredentials: true, // for send cookies...
});

// Ensuring single refresh attempt at a time...
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void ; reject: (error?: any) => void }> = [];

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// interceptor for 401 errors response...
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response ; // sending the response if token is not expired... 
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && (error.response?.data as any)?.message === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, "queueing the request"
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true ; // allowing the next queued request to execute...
      isRefreshing = true;

      try {
        // Attempt to refresh the token...
        await axiosInstance.post('/api/auth/refresh');
        // If successful, process queued requests
        processQueue(null);
        // Retry the original request...
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject all queued requests
        processQueue(refreshError, null);
        // handle logout & redirect to login page
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-active-account'); // clear persisted state
          window.location.href = '/auth/log-in';
        }

        // finally run after promise is resolved or rejected...
        
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

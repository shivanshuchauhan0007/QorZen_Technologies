import api from './axiosInstance';

export const getPublicServices = () => api.get('/public/services');
export const getServiceById = (id) => api.get(`/public/services/${id}`);
export const getPublicCourses = () => api.get('/courses');
export const getPublicCourseById = (id) => api.get(`/courses/${id}`);
export const getInternships = () => api.get('/public/internships');
export const getInternshipById = (id) => api.get(`/public/internships/${id}`);
export const enrollInternship = (data) => api.post('/public/internships/enroll', data);
export const submitContactForm = (data) => api.post('/contacts', data);
export const getPublicBlogs = () => api.get('/public/blogs');
export const getBlogBySlug = (slug) => api.get(`/public/blogs/${slug}`);
export const getPublicTestimonials = () => api.get('/public/testimonials');

import Axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// every request made through THIS object automatically gets baseURL prepended, so route
// calls shrink from "http://localhost:5000/pets" down to just "/pets".
const api = Axios.create({ baseURL });

export default api;
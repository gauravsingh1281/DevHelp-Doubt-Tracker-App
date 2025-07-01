import { useContext, useState } from "react";
import loginIllustration from "../assets/images/login-img.jpg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiInstance from "../../api/apiInstance";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      const missingFields = [];
      if (!form.email) missingFields.push("Email");
      if (!form.password) missingFields.push("Password");
      toast.error(
        `Please fill the following fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await apiInstance.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full lg:w-[80%] h-full lg:h-[520px] flex flex-col lg:flex-row justify-center items-start shadow-xl rounded-2xl overflow-hidden mt-7">
      <img
        className="h-full w-full lg:w-[60%] object-cover"
        src={loginIllustration}
        alt="login-illustration"
      />
      <div className="w-full lg:w-[40%] h-full bg-white px-6 py-4 flex flex-col justify-center items-center gap-2">
        <h2 className="text-3xl mb-3 text-[#2C444E]">Welcome back!</h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block text-base ">Email :</label>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            className="border outline-0 my-2 w-full rounded-md p-2"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
          <label className="block text-base ">Password :</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="border outline-0 my-2 w-full rounded-md p-2"
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full my-3 font-bold uppercase py-2 rounded-lg transition-all ease-in duration-100 ${
              loading
                ? "bg-[#2C444E] text-[#FFC801] cursor-not-allowed"
                : "bg-[#2C444E] text-[#FFC801] cursor-pointer active:scale-[90%]"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-base">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import signupIllustration from "../assets/images/signup-img.jpg";
import apiInstance from "../api/apiInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false); // ✅ loader state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // input field validation
    if (!form.name || !form.email || !form.password || !form.role) {
      const missingFields = [];
      if (!form.name) missingFields.push("Full Name");
      if (!form.email) missingFields.push("Email");
      if (!form.password) missingFields.push("Password");
      if (!form.role) missingFields.push("Role");

      toast.error(
        `Please fill the following fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    // Email and Password Validation
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email.");
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must be 6+ chars and include uppercase, lowercase, number, and symbol."
      );
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true); // ✅ start loader
      await apiInstance.post("/auth/register", form);
      toast.success("Registered successfully. Now login.");
      navigate("/login");

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <>
      <div className="lg:w-[80%] mx-auto w-full h-full lg:h-[520px] flex flex-col lg:flex-row justify-center items-start shadow-xl rounded-2xl overflow-hidden mt-7">
        <img
          className="h-full w-full lg:w-[60%] object-cover"
          src={signupIllustration}
          alt="signup-illustration"
        />
        <div className="w-full lg:w-[40%] h-full bg-white px-6 py-4 flex flex-col justify-center items-center gap-3">
          <h2 className="text-2xl text-[#2C444E]">Let's get started!</h2>
          <form className="w-full" onSubmit={handleSubmit}>
            <label className="block text-base">Full name :</label>
            <input
              type="text"
              placeholder="Enter full name"
              name="name"
              className="border outline-0 my-2 w-full rounded-md p-2"
              value={form.name.charAt(0).toUpperCase() + form.name.slice(1)}
              onChange={handleChange}
              autoComplete="off"
            />

            <label className="block text-base">Email :</label>
            <input
              type="text"
              placeholder="Enter email"
              className="border outline-0 my-2 w-full rounded-md p-2"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />

            <label className="block text-base">Password :</label>
            <input
              type="password"
              placeholder="Enter password"
              className="border outline-0 my-2 w-full rounded-md p-2"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
            />

            <label className="block text-base">Select role :</label>
            <select
              name="role"
              className="border outline-0 my-2 w-full rounded-md p-2"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full my-3 font-bold uppercase py-2 rounded-lg transition-all ease-in duration-100 ${
                loading
                  ? "bg-[#2A454E] text-[#FFC801] cursor-not-allowed"
                  : "bg-[#2A454E] text-[#FFC801] cursor-pointer active:scale-[90%]"
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="text-base">
            <span className="text-gray-600"> Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

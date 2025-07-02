import { useNavigate } from "react-router";
import hero1 from "../assets/images/hero1.png";
import hero2 from "../assets/images/hero2.png";
export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-full bg-white py-4 px-4 md:px-10 lg:px-10 flex justify-between items-center gap-4 md:gap-0 lg:gap-0 flex-col-reverse md:flex-row lg:flex-row">
        <div className=" w-full md:w-1/2 lg:w-1/2   flex justify-center items-center md:items-start lg:items-start flex-col gap-10">
          <h1 className="text-center md:text-left lg:text-left text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-Cormorant md:leading-[40px] lg:leading-[55px]">
            Solve Your <span className="text-[#F7418D]">Coding Doubts</span>{" "}
            <br />
            with Expert Mentors
          </h1>
          <button
            className="py-2 px-3 md:py-2.5 md:px-4 text-lg bg-black text-white rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans"
            onClick={() => navigate("/signup")}
          >
            Try DevHelp. It's free.
          </button>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2   flex justify-center md:justify-end lg:justify-end items-center">
          <img className="w-[80%] " src={hero1} alt="hero1-img" />
        </div>
      </section>
      <section className="w-full bg-white py-4 px-4 md:px-10 lg:px-10 flex justify-between items-center gap-4 md:gap-0 lg:gap-0 flex-col md:flex-row lg:flex-row">
        <div className="w-full md:w-1/2 lg:w-1/2   flex justify-center md:justify-start lg:justify-start items-center">
          <img className="w-[80%] " src={hero2} alt="hero2-img" />
        </div>
        <div className=" w-full md:w-1/2 lg:w-1/2  flex justify-center items-center md:items-start lg:items-start flex-col gap-2">
          <h1 className="text-center md:text-left lg:text-left text-3xl  md:text-4xl lg:text-5xl font-Cormorant font-bold">
            Never Get Stuck Again.
          </h1>
          <p className="text-lg md:text-2xl lg:text-2xl font-Cormorant text-center md:text-justify  lg:text-justify">
            Connect with experienced mentors, post your doubts, and get detailed
            solutions. Join our community of learners and mentors today.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-50 py-16 px-4 md:px-10 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-Cormorant font-bold mb-4">
            How DevHelp <span className="text-[#F7418D]">Works</span>
          </h2>
          <p className="text-center text-lg md:text-xl font-OpenSans text-gray-600 mb-16 max-w-2xl mx-auto">
            Three simple steps to get unstuck and accelerate your coding journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
              <div className="text-5xl mb-6">❓</div>
              <h3 className="text-xl font-Cormorant font-semibold mb-4">
                Post Your Doubt
              </h3>
              <p className="text-gray-600 font-OpenSans leading-relaxed">
                Share your coding challenge with detailed descriptions and
                screenshots to get targeted help
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
              <div className="text-5xl mb-6">💬</div>
              <h3 className="text-xl font-Cormorant font-semibold mb-4">
                Connect with Mentors
              </h3>
              <p className="text-gray-600 font-OpenSans leading-relaxed">
                Expert mentors provide step-by-step solutions and personalized
                guidance for your problems
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-xl font-Cormorant font-semibold mb-4">
                Level Up Your Skills
              </h3>
              <p className="text-gray-600 font-OpenSans leading-relaxed">
                Learn from real solutions, track your progress, and become a
                confident developer
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

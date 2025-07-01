import { useNavigate } from "react-router";
import hero1 from "../assets/images/hero1.png";
import hero2 from "../assets/images/hero2.png";
export default function Home() {
  const navigate = useNavigate();
  return (
    // Hero section
    <>
      <section className="w-full bg-white py-4 px-4 md:px-10 lg:px-10 flex justify-between items-center gap-4 md:gap-0 lg:gap-0 flex-col-reverse md:flex-row lg:flex-row">
        <div className=" w-full md:w-1/2 lg:w-1/2   flex justify-center items-center md:items-start lg:items-start flex-col gap-10">
          <h1 className="text-center md:text-left lg:text-left text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-Cormorant md:leading-[40px] lg:leading-[55px]">
            Don’t let your thoughts die <br /> bring them to life by writing on
            ThoughtLog.
          </h1>
          <button
            className="py-2 px-3 md:py-2.5 md:px-4 text-lg bg-black text-white rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans"
            onClick={() => navigate("/signup")}
          >
            Try ThoughtLog. It's free.
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
            Write without losing.
          </h1>
          <p className="text-lg md:text-2xl lg:text-2xl font-Cormorant text-center md:text-justify  lg:text-justify">
            As soon as the dream fades, it disappears among the stars, write it
            down before it's lost. ThoughtLog is where your dreams find a home.
          </p>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { dummyPlans, type Plans } from "../assets/assets";
import Loading from "./Loading";

function Credits() {
  const [plans, setplans] = useState<Plans[]>([]);
  const [loading, setloading] = useState(true);

  const fetchPlans = () => {
    setplans(dummyPlans);
    setloading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-between gap-8 ">
        {plans.map((pl) => (
          <div
            key={pl._id}
            className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-75 flex flex-col ${
              pl._id === "pro"
                ? "bg-purple-50 dark:bg-purple-900"
                : "bg-white dark:bg-transparent"
            }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {pl.name}
              </h3>
              <p>
                {pl.price}{" "}
                <span className="text-base font-normal text-gray-600 dark:text-purple-200">
                  {" "}
                  / {pl.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1">
                {pl.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-pink-800 text-white font-medium py-2 rounded transition-colors cursor-pointer">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;

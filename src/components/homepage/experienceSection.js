import { fetchDatabasesCount } from "@/utils/databaseUtils";
import { fetchDbToolsCount } from "@/utils/dbToolsUtil";
import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";

const ExperienceSection = () => {
  const [count, setCount] = useState({
    databasesCount: 0,
    dbToolsCount: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after first trigger
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Add useEffect to fetch databases count and db tools count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [databasesResult, dbToolsResult] = await Promise.all([
          fetchDatabasesCount(),
          fetchDbToolsCount(),
        ]);

        setCount({
          databasesCount: databasesResult.data.count || 0,
          dbToolsCount: dbToolsResult.data.count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  // Add experienceData array with database count and experience years
  const data = [
    { total_count: count?.databasesCount, label: "Number of Databases" },
    { total_count: count?.dbToolsCount, label: "Number of DB Tools" },
    {
      total_count: 30,
      label: " Data points collected for each database every day",
    },
    { total_count: 24, label: "Years of experience" },
  ];

  return (
    <div
      ref={sectionRef}
      className="bg-primary shadow-md md:px-24 px-9 my-4 py-8 md:py-11 w-full"
    >
      <div className="flex md:flex-row flex-col justify-between items-center ">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-4 flex-1 text-center ${
              index === 0 ? "" : "lg:border-l border-[#E4E4E7]"
            }`}
          >
            {isVisible ? (
              <div className="text-white text-4xl lg:text-6xl font-bold mb-2 flex items-center justify-center">
                <CountUp start={1} end={item?.total_count} duration={3} />
                <p>+</p>
              </div>
            ) : (
              <span className="text-white text-3xl lg:text-6xl font-bold mb-2">0</span>
            )}
            <p className="text-white text-sm md:text-2xl">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;

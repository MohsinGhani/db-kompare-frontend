import { fetchDatabasesCount } from "@/utils/databaseUtils";
import React, { useState, useEffect, useRef } from "react";

const ExperienceSection = () => {
  const [experience, setExperience] = useState([0, 0, 0]);
  const [databasesCount, setDatabasesCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDatabasesCount();
        setDatabasesCount(result.data.count);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const experienceData = [
    { years: databasesCount, label: "Number of Databases" },
    { years: 12, label: "Years of experience" },
    { years: 7, label: "Years of experience" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && databasesCount > 0) {
          countUp();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated, databasesCount]);

  const countUp = () => {
    const duration = 400;
    const stepTime = Math.abs(Math.floor(duration / experienceData.length));

    experienceData.forEach((item, index) => {
      const targetNumber = item.years;
      let start = 0;
      const timer = setInterval(() => {
        start += 1;
        setExperience((prev) => {
          const updatedExperience = [...prev];
          updatedExperience[index] = start;
          return updatedExperience;
        });
        if (start === targetNumber) clearInterval(timer);
      }, stepTime);
    });
  };

  return (
    <div
      className="bg-[#3E53D7] shadow-md md:px-24 px-9 my-4 py-11 w-full"
      ref={sectionRef}
    >
      <div className="flex md:flex-row flex-col justify-between items-center mt-8">
        {experienceData.map((item, index) => (
          <div
            key={index}
            className={`p-4 flex-1 text-center ${
              index === 0 ? "" : "lg:border-l border-[#E4E4E7]"
            }`}
          >
            <h3 className="text-white text-6xl font-bold mb-2">
              {experience[index]}+
            </h3>
            <p className="text-white text-2xl">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;

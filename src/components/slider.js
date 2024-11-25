import React from "react";
import { Carousel } from "antd";

// Import logos
import mongodbLogo from "@/../public/assets/icons/mongodb-icon-2 1.svg";
import mysqlLogo from "@/../public/assets/icons/mysql.svg";
import postgresqlLogo from "@/../public/assets/icons/postgresql.svg";
import redisLogo from "@/../public/assets/icons/redis.svg";
import ibmLogo from "@/../public/assets/icons/ibm.svg";
import elasticsearchLogo from "@/../public/assets/icons/Elasticsearch.svg";
import sqliteLogo from "@/../public/assets/icons/sqlite.svg";
import Image from "next/image";
import CommonTypography from "../shared/Typography";

// Create an array of logos with their names
const logos = [
  { src: mongodbLogo, alt: "MongoDB" },
  { src: mysqlLogo, alt: "MySQL" },
  { src: postgresqlLogo, alt: "PostgreSQL" },
  { src: redisLogo, alt: "Redis" },
  { src: ibmLogo, alt: "IBM" },
  { src: elasticsearchLogo, alt: "Elasticsearch" },
  { src: sqliteLogo, alt: "SQLite" },
];

const contentStyle = {
  height: "300px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  background: "#364d79",
};

const HomepageSlider = () => {
  return (
    <div className="md:p-10 p-3 text-center ">
      <CommonTypography classes="md:text-2xl text-lg font-bold ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </CommonTypography>
      <Carousel arrows slidesToShow={4} infinite={false} dots={false}>
        {logos.map((logo, index) => (
          <div key={index} style={contentStyle} className="my-7 px-4 md:px-10">
            <Image key={index} src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomepageSlider;

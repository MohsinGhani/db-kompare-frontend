import { Skeleton, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
import { useState, useEffect } from "react";

const dbToolTableData = [
  {
    name: "Erwin Data Modeler",
    description:
      "erwin Data Modeler (erwin DM) is a data modeling tool used to find, visualize, design, deploy, and standardize high-quality enterprise data assets. Discover and document any data from anywhere for consistency, clarity, and artifact reuse across large-scale data integration, master data management, metadata management, Big Data, business intelligence, and analytics initiatives.",
    desktopOrCloud: "Desktop",
    commercial: "Commercial",
    freeEdition: false,
    erDiagram: true,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: true,
  },
  {
    name: "ModelSphere",
    description:
      "ModelSphere is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling and UML modeling, and provides a flexible model management environment. It provides complete data modeling features covering conceptual, logical and physical modeling",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "DB Main (Discontinued)",
    description:
      "DB Main (Discontinued) is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "Enterprise Architect",
    description:
      "Enterprise Architect is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "ER/Studio",
    description:
      "ER/Studio is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "GenMyModel",
    description:
      "GenMyModel is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "IBM InfoSphere Data Architect",
    description:
      "IBM InfoSphere Data Architect is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "MagicDraw",
    description:
      "MagicDraw is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "Moon Modeler",
    description:
      "Moon Modeler is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "PowerDesigner",
    description:
      "PowerDesigner is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "RISE",
    description:
      "RISE is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
  {
    name: "Software Ideas Modeler",
    description:
      "Software Ideas Modeler is an exciting and unique modeling tool that combines many features, such as business process modeling, data modeling, and UML modeling.",
    desktopOrCloud: "Desktop",
    commercial: "Free",
    freeEdition: true,
    erDiagram: false,
    runsOn: ["Linux", "Mac OS", "Windows"],
    forwardEngineering: true,
    reverseEngineering: true,
    synchronization: false,
  },
];

const ToolComparisonTable = ({
  selectedFilters,
  selectedTools,
  setSelectedTools,
  setSelectedToolsOptions,
  toolName,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const attributes = Object.keys(dbToolTableData[0])
    .filter((key) => key !== "name")
    .map((key) => ({ label: key, key }));

  const handleRemoveTools = (db) => {
    const updatedTools = selectedTools.filter((item) => item !== db);
    setSelectedTools(updatedTools);
    setSelectedToolsOptions(updatedTools);

    const newDbQuery = encodeURIComponent(updatedTools.join("-"));
    const filterQuery = new URLSearchParams(selectedFilters).toString();
    router.push(`/db-toolcomparison/${newDbQuery}?${filterQuery}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      rowScope: "row",
      render: (text) => <div style={{ minWidth: "200px" }}>{text}</div>,
    },
    ...selectedTools.map((db) => ({
      title: (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-1">
            <span>{db}</span>
          </div>
          <div>
            {selectedTools.length > 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
                color="red"
                cursor="pointer"
                onClick={() => handleRemoveTools(db)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            )}
          </div>
        </div>
      ),
      dataIndex: db,
      render: (text, record) => (
        <div
          style={{
            padding: "5px",
            minWidth: "200px",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          {typeof text === "boolean" ? (
            text ? (
              <CheckOutlined
                style={{
                  color: "green",
                  fontSize: "18px",
                }}
              />
            ) : (
              <CloseOutlined style={{ color: "red", fontSize: "18px" }} />
            )
          ) : Array.isArray(text) ? (
            text.join(", ")
          ) : (
            text || "No data available"
          )}
        </div>
      ),
    })),
  ];

  const data = attributes.map((attribute) => {
    const row = { name: attribute.label };

    selectedTools.forEach((db) => {
      const tool = dbToolTableData.find((tool) => tool?.name === db);

      if (tool) {
        const toolData = tool[attribute.key];
        row[db] = Array.isArray(toolData)
          ? toolData.join(", ")
          : toolData !== undefined
          ? toolData
          : "No data available";
      } else {
        row[db] = "No data available";
      }
    });

    return row;
  });

  useEffect(() => {
    if (dbToolTableData && dbToolTableData.length > 0) {
      setIsLoading(false);
    }
  }, [dbToolTableData]);

  return (
    <>
      {isLoading ? (
        <Table
          rowKey="key"
          pagination={false}
          dataSource={[...Array(5)].map((_, index) => ({
            key: `key${index}`,
          }))}
          columns={columns.map((column) => ({
            ...column,
            render: function renderPlaceholder() {
              return (
                <Skeleton
                  key={column.key}
                  title
                  active={false}
                  paragraph={false}
                />
              );
            },
          }))}
        />
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
          className="w-full mt-4 db-row"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"
          }
        />
      )}
    </>
  );
};

export default ToolComparisonTable;

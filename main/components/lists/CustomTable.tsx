import React from "react";

interface Column<T> {
    label: string;
    accessor: (item: T) => React.ReactNode;
}

interface CustomTableProps<T> {
    columns: Column<T>[];
    data: T[];
    footer?: React.ReactNode;
    noDataMessage?: string;
}

const CustomTable = <T extends {}>({ columns, data, footer, noDataMessage }: CustomTableProps<T>) => {
    if (data.length === 0) {
        return (
            <div className="w-full bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto">
                <table className="min-w-full">
                    <thead
                        className="border-b border-gray-200"
                        style={{
                            backgroundColor: "var(--page-header-bg-color)",
                        }}
                    >
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 whitespace-nowrap font-semibold"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <td
                                className="px-4 py-2 whitespace-nowrap font-semibold"
                                colSpan={columns.length}
                            >
                                {noDataMessage || "No data found."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto">
            <table className="min-w-full">
                <thead
                    className="border-b border-gray-200"
                    style={{
                        backgroundColor: "var(--page-header-bg-color)",
                    }}
                >
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-2 whitespace-nowrap font-semibold`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-4 py-2 whitespace-nowrap truncate ${
                                        colIndex === 0 ? "" : "text-sm"
                                    }`}
                                >
                                    {column.accessor(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {footer && footer}
        </div>
    );
};

export default CustomTable;

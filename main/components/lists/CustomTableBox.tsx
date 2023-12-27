import React from "react";

interface Column<T> {
    label: string;
    key: keyof T;
}

interface CustomTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

const CustomTableBox = <T extends {}>({ columns, data }: CustomTableProps<T>) => {
    return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
            <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200 p-1">
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => {
                                const value = item[column.key];
                                return (
                                    <td key={colIndex} className="p-1">
                                        {value !== null && value !== undefined ? String(value) : ""}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomTableBox;

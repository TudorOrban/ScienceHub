import React from 'react';

interface Column<T> {
    label: string;
    accessor: (item: T) => React.ReactNode;
}

interface CustomTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

const CustomTable = <T extends {}>({ columns, data }: CustomTableProps<T>) => {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex}>{column.accessor(item)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CustomTable;

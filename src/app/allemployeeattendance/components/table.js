import { Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useRouter } from "next/navigation";
export default function EmployeeTable({ columns, data}) {
    const router = useRouter();

    const submite = (row) => {
        router.push(`attendance?employeeid=${row.employeeId}`) //Changewith original url
    };
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-4 font-semibold">
                <thead className="bg-gray-100">
                    <tr className="text-left">
                        {columns.map((col, idx) => (
                            <th key={idx} className="p-3 text-sm font-Bold ">
                                {col.label}
                            </th>
                        ))}
                        <th className="p-3 text-gray-600 text-sm font-extrabold">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden rounded-xl"
                        >
                            {columns.map((col, j) => (
                                <td key={j} className="p-4">
                                    {col.key === 'image' ? (
                                        <img
                                            src={(row[col.key]).length > 0 ? row[col.key] : '/default-profile.png'}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : col.key === "manager" ? (
                                        row[col.key] != null ? row[col.key] : "Admin"
                                    ) :
                                        (
                                            row[col.key]
                                        )}
                                </td>
                            ))}
                            <td className="p-4">
                                <Button
                                    className="text-gray-500 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-full transition"
                                    variant="success"
                                    onClick={() => submite(row, i)}
                                >
                                    <Eye size={16} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="text-center py-6 text-gray-400 italic"
                            >
                                No employee found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
